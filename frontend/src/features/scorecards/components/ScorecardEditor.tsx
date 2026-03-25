import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scorecardApi } from '../api/scorecardApi';
import { Settings, Plus, Star, Briefcase, Trash2, Mic, ChevronDown } from 'lucide-react';
import { ScorecardCreate, Criterion } from '@/types';
import clsx from 'clsx';

export const ScorecardEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // State mapped out entirely to edit inputs
  const [scorecardState, setScorecardState] = useState<ScorecardCreate>({
    name: location.state?.importedGoal || '',
    description: '',
    status: 'Đang hoạt động',
    threshold: 85,
    is_global_fallback: false,
    criteria: location.state?.importedCriteria || []
  });

  const { data: scorecard, isLoading } = useQuery({
    queryKey: ['scorecard', id],
    queryFn: () => scorecardApi.getScorecard(id!),
    enabled: !!id && id !== 'new'
  });

  // Load existing scorecard logic
  useEffect(() => {
    if (scorecard && id !== 'new') {
      setScorecardState(scorecard);
    }
  }, [scorecard, id]);

  const saveMutation = useMutation({
    mutationFn: () => id === 'new' 
      ? scorecardApi.createScorecard(scorecardState)
      : scorecardApi.updateScorecard(id!, scorecardState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      alert('Đã lưu Scorecard thành công!');
      navigate('/management');
    }
  });

  const updateCriterion = (idx: number, field: string, value: any) => {
    const newCriteria = [...scorecardState.criteria];
    newCriteria[idx] = { ...newCriteria[idx], [field]: value };
    setScorecardState({ ...scorecardState, criteria: newCriteria });
  };

  const removeCriterion = (idx: number) => {
    const newCriteria = scorecardState.criteria.filter((_, i) => i !== idx);
    setScorecardState({ ...scorecardState, criteria: newCriteria });
  };

  const addCriterion = (layer: 'general' | 'business') => {
    const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const prefix = layer === 'general' ? 'GEN' : 'BUS';
    const newCriteria = [...scorecardState.criteria, {
      code: `${prefix}_${suffix}`,
      name: '',
      layer,
      options_type: 'Yes/No/NA',
      yes_score: 10,
      no_score: 0,
      na_score: 10,
      max_score: 10
    } as Criterion];
    setScorecardState({ ...scorecardState, criteria: newCriteria });
  };

  const updateAudioRule = (field: 'max_hold_time_s' | 'ideal_speaking_rate_wpm', value: number) => {
    const newCriteria = [...scorecardState.criteria];
    let audioCriterionIndex = newCriteria.findIndex(c => c.layer === 'audio_rules');
    
    if (audioCriterionIndex === -1) {
      newCriteria.push({
        code: `AUDIO_RULE`,
        name: 'Giám sát Quy tắc Âm thanh',
        layer: 'audio_rules',
        options_type: 'Yes/No',
        yes_score: 10,
        no_score: 0,
        na_score: 0,
        max_score: 10,
        audio_rules_data: { max_hold_time_s: 30, ideal_speaking_rate_wpm: 120, max_silence_duration_s: 15, overlapping_threshold_percent: 20 }
      } as Criterion);
      audioCriterionIndex = newCriteria.length - 1;
    }
    
    const audioData = newCriteria[audioCriterionIndex].audio_rules_data || {};
    newCriteria[audioCriterionIndex] = {
      ...newCriteria[audioCriterionIndex],
      audio_rules_data: { ...audioData, [field]: value }
    };
    
    setScorecardState({ ...scorecardState, criteria: newCriteria });
  };

  const getAudioRule = (field: 'max_hold_time_s' | 'ideal_speaking_rate_wpm', defaultValue: number) => {
    const audioCriterion = scorecardState.criteria.find(c => c.layer === 'audio_rules');
    if (!audioCriterion || !audioCriterion.audio_rules_data) return defaultValue;
    return (audioCriterion.audio_rules_data as any)[field] || defaultValue;
  };

  if (isLoading) return <div className="p-8 font-bold text-violet-700 animate-pulse">Đang tải cấu hình Scorecard...</div>;

  const renderTable = (layer: 'general' | 'business') => {
    const layerCriteria = scorecardState.criteria.filter(c => c.layer === layer);
    
    if (layerCriteria.length === 0) {
      return <div className="text-center py-8 text-slate-400 text-sm">Chưa có tiêu chí nào. Bấm thêm mới để tạo.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm mb-6 min-w-[800px]">
          <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="pb-3 w-10"></th>
              <th className="pb-3 font-bold">MÃ</th>
              <th className="pb-3 font-bold w-1/3">TÊN TIÊU CHÍ</th>
              <th className="pb-3 font-bold">LỰA CHỌN</th>
              <th className="pb-3 font-bold text-center">YES</th>
              <th className="pb-3 font-bold text-center">NO</th>
              <th className="pb-3 font-bold text-center">N/A</th>
              <th className="pb-3 font-bold text-right">MAX</th>
              <th className="pb-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {layerCriteria.map((c) => {
              const idx = scorecardState.criteria.findIndex(item => item === c);
              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4"><input type="checkbox" checked className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4" readOnly /></td>
                  <td className="py-4 text-xs font-mono text-slate-400">
                    <input className="w-16 bg-transparent border-b-2 border-transparent focus:border-violet-300 outline-none text-slate-700 font-bold" value={c.code} onChange={e => updateCriterion(idx, 'code', e.target.value)} />
                  </td>
                  <td className="py-4 font-bold text-slate-700 pr-4">
                    <input className="w-full bg-transparent border-b-2 border-transparent focus:border-violet-300 outline-none placeholder:font-normal placeholder:text-slate-300" placeholder="Nhập tên tiêu chí..." value={c.name} onChange={e => updateCriterion(idx, 'name', e.target.value)} />
                  </td>
                  <td className="py-4 pr-4">
                    <select className="px-2 py-1 rounded-md border border-slate-200 text-xs bg-white font-medium" value={c.options_type} onChange={e => updateCriterion(idx, 'options_type', e.target.value)}>
                      <option value="Yes/No/NA">Yes/No/NA</option>
                      <option value="Yes/No">Yes/No</option>
                    </select>
                  </td>
                  <td className="py-4 text-center"><input type="number" className="w-12 text-center border border-slate-200 bg-white rounded p-1 font-mono" value={c.yes_score || 0} onChange={e => updateCriterion(idx, 'yes_score', parseInt(e.target.value) || 0)} /></td>
                  <td className="py-4 text-center"><input type="number" className="w-12 text-center border border-slate-200 bg-white rounded p-1 font-mono" value={c.no_score || 0} onChange={e => updateCriterion(idx, 'no_score', parseInt(e.target.value) || 0)} /></td>
                  <td className="py-4 text-center"><input type="number" className="w-12 text-center border border-slate-200 bg-white rounded p-1 font-mono" value={c.na_score || 0} onChange={e => updateCriterion(idx, 'na_score', parseInt(e.target.value) || 0)} disabled={c.options_type === 'Yes/No'} /></td>
                  <td className="py-4 text-right font-bold text-violet-700">
                    <input type="number" className="w-12 text-right bg-transparent border-b-2 border-transparent focus:border-violet-300 outline-none" value={c.max_score || 0} onChange={e => updateCriterion(idx, 'max_score', parseInt(e.target.value) || 0)} />
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => removeCriterion(idx)} className="text-slate-300 hover:text-red-500 transition-colors bg-white p-1 rounded-md border border-slate-200 shadow-sm"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center shrink-0">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-3">
              Chỉnh sửa Bộ tiêu chí chấm điểm
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-mono border border-slate-200">
                ID: {id === 'new' ? 'NEW' : id}
              </span>
            </h1>
            <div className="mt-2 text-slate-900 border-l-2 border-violet-500 pl-3">
              <input 
                type="text" 
                className="text-lg font-bold bg-transparent placeholder:text-slate-300 outline-none transition-colors w-96 border-b border-transparent focus:border-violet-300"
                placeholder="Nhập tên Bộ tiêu chí..."
                value={scorecardState.name}
                onChange={e => setScorecardState({ ...scorecardState, name: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => navigate('/management')}
            className="px-6 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            HUỶ
          </button>
          <button 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className={clsx(
              "px-8 py-2.5 rounded-lg text-white font-bold transition-all shadow-md active:scale-95",
              saveMutation.isPending ? "bg-violet-400 cursor-not-allowed" : "bg-violet-700 hover:bg-violet-800"
            )}
          >
            {saveMutation.isPending ? 'ĐANG LƯU...' : 'LƯU SCORECARD'}
          </button>
        </div>
      </div>
      
      {/* General Layer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
               <Star size={20} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">Tiêu chí Nền tảng (General)</h2>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">LAYER 1 • CƠ BẢN CHO MỌI CUỘC GỌI</p>
             </div>
          </div>
        </div>
        <div className="p-6">
          {renderTable('general')}
          <div className="flex justify-start">
            <button onClick={() => addCriterion('general')} className="flex items-center gap-2 text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 px-4 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm">
              <Plus size={16} /> THÊM TIÊU CHÍ NỀN TẢNG MỚI
            </button>
          </div>
        </div>
      </div>

      {/* Business Layer */}
      <div className="bg-white rounded-2xl shadow-sm border border-violet-300 overflow-hidden ring-1 ring-violet-500/20 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-600"></div>
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-violet-50/30 pl-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center shadow-sm">
               <Briefcase size={20} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">Tiêu chí Nghiệp vụ (Business-specific)</h2>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">LAYER 2 • TIÊU CHÍ ĐẶC THÙ CHO TỪNG QUY TRÌNH</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
            <span className="text-sm font-bold text-slate-700">Ngưỡng đạt (Threshold):</span>
            <input 
              type="number" 
              className="w-16 border border-slate-200 bg-slate-50 rounded px-2 py-1 text-center font-bold text-violet-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" 
              value={scorecardState.threshold || ''} 
              onChange={e => setScorecardState({ ...scorecardState, threshold: parseInt(e.target.value) || 0 })} 
            />
            <span className="text-sm font-bold text-slate-500">%</span>
          </div>
        </div>
        <div className="p-6 pl-8">
            {renderTable('business')}
            <div className="flex justify-start mt-4">
              <button onClick={() => addCriterion('business')} className="flex items-center gap-2 text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 px-4 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm">
                <Plus size={16} /> THÊM TIÊU CHÍ NGHIỆP VỤ MỚI
              </button>
            </div>
        </div>
      </div>

      {/* Audio Layer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 cursor-pointer">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
               <Mic size={20} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">Quy tắc Âm thanh (Audio Rules)</h2>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">LAYER 3 • PHÂN TÍCH SÓNG ÂM & TỐC ĐỘ</p>
             </div>
          </div>
          <ChevronDown size={20} className="text-slate-400" />
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 text-sm mb-1">Hold call time (Thời gian chờ)</div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  Cảnh báo nếu thời gian giữ máy quá lâu.
                  <span className="font-mono text-slate-400 bg-white border border-slate-200 px-1 rounded">MAX</span>
                  <input 
                    type="number" 
                    className="w-16 text-center border-b border-transparent focus:border-violet-500 focus:outline-none bg-white font-mono rounded" 
                    value={getAudioRule('max_hold_time_s', 30)} 
                    onChange={e => updateAudioRule('max_hold_time_s', parseInt(e.target.value) || 0)} 
                  />
                  <span>s</span>
                </div>
              </div>
              <div className="w-10 h-5 bg-violet-600 rounded-full cursor-pointer relative shadow-inner">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 text-sm mb-1">Speaking rate (Tốc độ nói)</div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  Kiểm soát nhịp điệu tư vấn của nhân viên.
                  <span className="font-mono text-slate-400 bg-white border border-slate-200 px-1 rounded">IDEAL</span>
                  <input 
                    type="number" 
                    className="w-16 text-center border-b border-transparent focus:border-violet-500 focus:outline-none bg-white font-mono rounded" 
                    value={getAudioRule('ideal_speaking_rate_wpm', 120)} 
                    onChange={e => updateAudioRule('ideal_speaking_rate_wpm', parseInt(e.target.value) || 0)} 
                  />
                  <span>wpm</span>
                </div>
              </div>
              <div className="w-10 h-5 bg-violet-600 rounded-full cursor-pointer relative shadow-inner">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

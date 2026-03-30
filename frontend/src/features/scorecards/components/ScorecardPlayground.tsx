import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { scorecardApi } from '../api/scorecardApi';
import { Criterion } from '@/types';
import { 
  Play, 
  UploadCloud,
  Loader2,
  FileText,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Edit2
} from 'lucide-react';
import clsx from 'clsx';

const MOCK_TRANSCRIPT = [
  { id: 1, role: 'agent', time: '00:00', text: 'Dạ BIDV xin chào, em là Nam có thể giúp gì cho anh/chị ạ?' },
  { id: 2, role: 'customer', time: '00:05', text: 'Chào em, anh vừa bị rớt thẻ ngoài đường, khóa ngay giúp anh nhé!' },
  { id: 3, role: 'agent', time: '00:10', text: 'Dạ vâng ạ. Anh vui lòng cung cấp số CMND/CCCD để em xác thực và hỗ trợ khóa thẻ khẩn cấp ạ.' },
  { id: 4, role: 'customer', time: '00:15', text: '123456789 nhé em.' },
  { id: 5, role: 'agent', time: '00:22', text: 'Cảm ơn anh. Em đã thực hiện khóa thẻ thành công trên hệ thống để đảm bảo an toàn. Anh có cần em hỗ trợ phát hành lại thẻ mới không ạ?' },
  { id: 6, role: 'customer', time: '00:30', text: 'Chưa cần đâu em, cảm ơn em.' },
  { id: 7, role: 'agent', time: '00:35', text: 'Dạ vâng, cảm ơn anh đã gọi đến BIDV, em chào anh ạ.' }
];

// Mock random simulation results
const getMockResult = (criterionName: string) => {
  const hash = criterionName.length;
  if (hash % 3 === 0) return { status: 'No', reason: 'Không phát hiện thấy câu hỏi khai thác nhu cầu bổ sung rõ ràng từ chuyên viên.' };
  if (hash % 4 === 0) return { status: 'NA', reason: 'Không phát sinh tình huống phải xin lỗi hay chờ máy trong cuộc gọi này.' };
  return { status: 'Yes', reason: 'Chuyên viên đã thực hiện đúng bước này dựa vào các câu thoại ở giây thứ 10 và 35.' };
};

export const ScorecardPlayground: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedScorecardId, setSelectedScorecardId] = useState<string>('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  // Edit State
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const { data: scorecards = [] } = useQuery({
    queryKey: ['scorecards'],
    queryFn: scorecardApi.getScorecards
  });

  const selectedScorecard = scorecards.find(sc => sc.id === selectedScorecardId);

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => scorecardApi.updateScorecard(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      setEditingCode(null);
    }
  });

  const handleSaveEdit = (e: React.MouseEvent | React.FormEvent, c: Criterion) => {
    e.preventDefault();
    if (!selectedScorecard) return;
    if (editingName.trim() === '') return;

    const updatedCriteria = selectedScorecard.criteria.map(crit => 
      crit.code === c.code ? { ...crit, name: editingName } : crit
    );

    mutation.mutate({
      id: selectedScorecard.id,
      payload: {
        ...selectedScorecard,
        criteria: updatedCriteria
      }
    });
  };

  useEffect(() => {
    let timer: any;
    if (simulationState === 'running') {
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setSimulationState('completed');
            return 100;
          }
          return p + 15;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [simulationState]);

  const handleRunSimulation = () => {
    if (!selectedScorecardId) {
      alert("Vui lòng chọn Scorecard để thử nghiệm!");
      return;
    }
    if (!fileUploaded) {
      alert("Vui lòng tải lên file ghi âm hoặc transcript!");
      return;
    }
    setSimulationState('running');
    setProgress(0);
  };

  const handleReset = () => {
    setSimulationState('idle');
    setProgress(0);
    setEditingCode(null);
  };
  
  const handleUpload = () => {
    setFileUploaded(true);
    setSimulationState('idle');
  }

  // Group Criteria
  const groupedCriteria = {
    general: selectedScorecard?.criteria.filter(c => c.layer === 'general') || [],
    business: selectedScorecard?.criteria.filter(c => c.layer === 'business') || [],
    audio_rules: selectedScorecard?.criteria.filter(c => c.layer === 'audio_rules') || []
  };

  const renderCriterionResult = (c: Criterion) => {
    const isCompleted = simulationState === 'completed';
    const result = isCompleted ? getMockResult(c.name) : null;

    return (
      <div key={c.code} className="p-4 border border-slate-200 rounded-xl mb-3 bg-white shadow-sm transition-all group/card hover:border-indigo-200">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <span className="text-xs font-bold text-slate-400 mb-1 block uppercase tracking-wider">{c.code}</span>
            {editingCode === c.code ? (
              <form onSubmit={(e) => handleSaveEdit(e, c)} className="mt-1 flex items-start gap-2">
                <textarea 
                  autoFocus
                  className="w-full text-sm border-2 border-indigo-200 rounded-lg p-2 outline-none focus:border-indigo-400 min-h-[60px]"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveEdit(e, c);
                    } else if (e.key === 'Escape') {
                      setEditingCode(null);
                    }
                  }}
                />
                <div className="flex flex-col gap-1 shrink-0">
                  <button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-50"
                    title="Lưu (Enter)"
                  >
                    {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingCode(null)}
                    disabled={mutation.isPending}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg"
                    title="Hủy (Esc)"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start gap-2 group/edit relative pr-8">
                <p className="font-semibold text-slate-800 text-sm leading-relaxed">{c.name}</p>
                <button 
                  onClick={() => {
                    setEditingCode(c.code);
                    setEditingName(c.name);
                  }}
                  className="absolute right-0 top-0 opacity-0 group-hover/card:opacity-100 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all mt-[-4px]"
                  title="Chỉnh sửa nội dung tiêu chí"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="shrink-0 w-24 flex justify-end">
            {!isCompleted ? (
              <span className="px-3 py-1 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg whitespace-nowrap">Chờ chạy...</span>
            ) : (
              <span className={clsx(
                "px-3 py-1 font-bold text-xs rounded-lg flex items-center gap-1 whitespace-nowrap",
                result?.status === 'Yes' && "bg-green-100 text-green-700",
                result?.status === 'No' && "bg-red-100 text-red-700",
                result?.status === 'NA' && "bg-slate-200 text-slate-600"
              )}>
                {result?.status === 'Yes' && <CheckCircle2 size={14} />}
                {result?.status === 'No' && <XCircle size={14} />}
                {result?.status === 'NA' && <HelpCircle size={14} />}
                {result?.status}
              </span>
            )}
          </div>
        </div>
        
        {isCompleted && result && editingCode !== c.code && (
          <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex gap-2">
            <div className="mt-0.5 text-indigo-500 shrink-0"><FileText size={16} /></div>
            <div>
              <span className="font-bold text-slate-700 mr-1">AI Reasoning (Bằng chứng):</span>
              {result.reason}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden animate-fade-in -m-8 relative">
      <div className="flex justify-between items-center px-8 py-5 border-b border-slate-200 bg-white shrink-0">
        <div>
          <h1 className="text-xl font-bold font-mono text-indigo-900 flex items-center gap-2">
            <span className="text-2xl">🧪</span> AI SCORECARD PLAYGROUND
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Xưởng thử nghiệm & tinh chỉnh tiêu chí chấm điểm tự động</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            className="border-2 border-indigo-200 rounded-lg px-4 py-2 text-sm font-semibold text-indigo-900 outline-none w-64 bg-indigo-50"
            value={selectedScorecardId}
            onChange={(e) => {
              setSelectedScorecardId(e.target.value);
              handleReset();
            }}
          >
            <option value="">-- Chọn Scorecard để test --</option>
            {scorecards.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>
          
          <button 
            onClick={handleRunSimulation}
            disabled={simulationState === 'running' || !selectedScorecardId || !fileUploaded}
            className={clsx(
              "px-5 py-2 rounded-lg font-bold text-sm text-white shadow-md flex items-center gap-2 transition-all",
              simulationState === 'running' ? "bg-indigo-400 cursor-not-allowed" : 
              (!selectedScorecardId || !fileUploaded) ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            )}
          >
            {simulationState === 'running' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            {simulationState === 'running' ? 'ĐANG CHẠY...' : 'RUN SIMULATION'}
          </button>
        </div>
      </div>

      {simulationState === 'running' && (
        <div className="absolute top-20 left-0 right-0 z-10 w-full h-1.5 bg-slate-100">
          <div className="h-full bg-indigo-600 transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Split View */}
      <div className="flex-1 overflow-hidden grid grid-cols-2 bg-slate-50 relative z-0">
        
        {/* Left Column: Conversation Insights */}
        <div className="border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Volume2 size={18} className="text-indigo-600" /> Dữ liệu Cuộc gọi (Conversation Insights)
            </h2>
            {!fileUploaded ? (
              <button 
                onClick={handleUpload}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-100 flex items-center gap-1"
              >
                <UploadCloud size={14} /> Upload File/Transcript
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 flex items-center gap-1">
                <CheckCircle2 size={14} /> file-1029-mock.wav
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {!fileUploaded ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl m-4 bg-white/50">
                <UploadCloud size={48} className="mb-4 text-slate-300" />
                <p className="font-medium">Chưa có dữ liệu gọi</p>
                <p className="text-sm mt-1">Upload một file ghi âm để AI bóc băng và phân tích.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Fake Audio Player */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm mb-6">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex justify-center items-center cursor-pointer">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-1/3"></div>
                    </div>
                  </div>
                  <span className="text-slate-500 font-mono text-xs font-bold">00:10 / 00:35</span>
                </div>
                
                {/* Chat Bubbles */}
                <div className="space-y-4">
                  {MOCK_TRANSCRIPT.map(msg => (
                    <div key={msg.id} className={clsx(
                      "flex flex-col max-w-[85%]", 
                      msg.role === 'customer' ? "self-end ml-auto items-end" : "self-start items-start"
                    )}>
                      <span className="text-xs font-bold text-slate-400 mb-1 mx-1">
                        {msg.role === 'agent' ? 'Chuyên viên' : 'Khách hàng'} • {msg.time}
                      </span>
                      <div className={clsx(
                        "p-3 rounded-2xl text-sm leading-relaxed shadow-sm w-fit",
                        msg.role === 'agent' 
                          ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none" 
                          : "bg-indigo-600 text-white rounded-tr-none"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scoring Results */}
        <div className="bg-[#f8f9fa] flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-white shrink-0 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileText size={18} className="text-amber-600" /> Kết quả chấm AI (Scoring Results)
            </h2>
            
            {simulationState === 'completed' && selectedScorecard && (
              <button 
                onClick={() => navigate('/edit/' + selectedScorecard.id)}
                className="text-xs font-bold text-slate-600 bg-slate-100 rounded-lg px-3 py-1.5 hover:bg-slate-200 flex items-center gap-1 shadow-sm transition-colors border border-slate-200"
              >
                Cài đặt nâng cao <Edit2 size={12} className="ml-0.5" />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {!selectedScorecardId ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400 font-medium">Chưa chọn Scorecard để thử nghiệm.</p>
              </div>
            ) : simulationState === 'idle' ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Play size={24} className="text-indigo-300" />
                  </div>
                  <p className="text-slate-500 font-semibold mb-1 w-64">Sẵn sàng chạy mô phỏng giả lập.</p>
                  <p className="text-slate-400 text-sm">Nhấn RUN SIMULATION để bắt đầu.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in pb-10">
                {groupedCriteria.general.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2 text-sm uppercase">1. Tiêu chí Nền tảng (General)</h3>
                    {groupedCriteria.general.map(renderCriterionResult)}
                  </section>
                )}
                
                {groupedCriteria.business.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2 text-sm uppercase mt-8">2. Tiêu chí Nghiệp vụ (Business)</h3>
                    {groupedCriteria.business.map(renderCriterionResult)}
                  </section>
                )}

                {groupedCriteria.audio_rules.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2 text-sm uppercase mt-8">3. Quy tắc Âm thanh (Audio Rules)</h3>
                    {groupedCriteria.audio_rules.map(renderCriterionResult)}
                  </section>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

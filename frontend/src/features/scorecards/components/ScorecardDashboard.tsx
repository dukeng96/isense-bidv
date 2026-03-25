import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { scorecardApi } from '../api/scorecardApi';
import { Settings, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export const ScorecardDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // state
  const [selectedFallback, setSelectedFallback] = useState<string>('');
  const [localMappings, setLocalMappings] = useState<Record<string, string>>({});

  // Queries
  const { data: scorecards = [], isLoading: isLoadSc } = useQuery({
    queryKey: ['scorecards'],
    queryFn: scorecardApi.getScorecards
  });

  const { data: mappings = [], isLoading: isLoadMap } = useQuery({
    queryKey: ['mappings'],
    queryFn: scorecardApi.getMappings
  });

  const fallbackMutation = useMutation({
    mutationFn: scorecardApi.setGlobalFallback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      alert('Đã lưu Cấu hình Global Fallback thành công!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: scorecardApi.deleteScorecard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
    }
  });

  const saveMappingMutation = useMutation({
    mutationFn: async () => {
      const promises = Object.entries(localMappings).map(([topicId, scorecardId]) => {
        const mapping = mappings.find(m => m.topic_id === topicId);
        if (!mapping) return Promise.resolve();
        return scorecardApi.createMapping({
          topic_id: topicId,
          topic_name: mapping.topic_name,
          scorecard_id: scorecardId
        });
      });
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
      setLocalMappings({});
      alert('Đã cập nhật Mapping thành công!');
    }
  });

  const handleSaveFallback = () => {
    if (selectedFallback) {
      fallbackMutation.mutate(selectedFallback);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Đang hoạt động') return 'bg-green-100 text-green-700';
    return 'bg-slate-100 text-slate-500';
  };

  if (isLoadSc || isLoadMap) return <div className="p-8">Đang tải dữ liệu...</div>;

  const currentFallback = scorecards.find(s => s.is_global_fallback)?.id || '';

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-12">
      
      {/* Top Section - Management */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý Bộ tiêu chí chấm điểm</h1>
            <p className="text-slate-500 mt-1">Tạo và cấu hình các bộ quy tắc chấm điểm cho các cuộc hội thoại.</p>
          </div>
          <button
            onClick={() => navigate('/edit/new')}
            className="bg-violet-700 hover:bg-violet-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-sm transition-colors"
          >
            <Plus size={18} />
            TẠO BỘ TIÊU CHÍ MỚI
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left bg-white">
            <thead className="bg-[#f8f9fa] border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="py-4 px-6 font-bold">ID</th>
                <th className="py-4 px-6 font-bold">TÊN BỘ TIÊU CHÍ</th>
                <th className="py-4 px-6 font-bold">MÔ TẢ</th>
                <th className="py-4 px-6 font-bold">TRẠNG THÁI</th>
                <th className="py-4 px-6 font-bold text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scorecards.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400">Chưa có bộ tiêu chí nào.</td></tr>
              ) : scorecards.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-violet-600 font-mono text-xs">{sc.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{sc.name}</td>
                  <td className="py-4 px-6 text-slate-500 text-sm max-w-md">{sc.description}</td>
                  <td className="py-4 px-6">
                    <span className={clsx("px-3 py-1 rounded-full text-xs font-bold", getStatusColor(sc.status))}>
                      {sc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => navigate('/edit/' + sc.id)}
                        className="text-slate-400 hover:text-violet-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa bộ tiêu chí này không?')) {
                            deleteMutation.mutate(sc.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Xoá vĩnh viễn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Topics Mapping Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Mapping Topic & Scorecard</h2>
          <p className="text-slate-500 mt-1">Gán bộ tiêu chí cụ thể cho từng chủ đề hội thoại để hệ thống tự động chấm điểm.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Fallback Config */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-violet-50/50 rounded-2xl border border-violet-100 p-6 flex flex-col items-center text-center shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center bg-violet-100 text-violet-600 rounded-full mb-4">
                <Settings size={24} />
              </div>
              <h3 className="font-bold text-violet-900 mb-2">Cấu hình Global Fallback</h3>
              <p className="text-xs text-violet-700/80 mb-6">
                Nếu một cuộc gọi không thuộc bất kỳ Topic nào được mapping bên phải, hệ thống sẽ sử dụng bộ tiêu chí mặc định này để chấm điểm.
              </p>

              <div className="w-full text-left">
                <label className="text-xs font-bold text-violet-950/70 mb-2 block uppercase tracking-wider">CHỌN SCORECARD MẶC ĐỊNH</label>
                <select 
                  className="w-full p-2.5 rounded-lg border border-violet-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 mb-4 font-medium"
                  value={selectedFallback || currentFallback}
                  onChange={(e) => setSelectedFallback(e.target.value)}
                >
                  <option value="" disabled>-- Chọn Scorecard --</option>
                  {scorecards.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleSaveFallback}
                  disabled={fallbackMutation.isPending}
                  className="w-full bg-slate-200 hover:bg-violet-600 hover:text-white text-slate-600 font-bold py-2.5 rounded-lg text-sm transition-colors"
                >
                  {fallbackMutation.isPending ? 'Đang lưu...' : 'LƯU FALLBACK'}
                </button>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 shadow-sm">
              <h4 className="font-bold text-orange-900 mb-3 text-sm">Lưu ý quan trọng</h4>
              <ul className="list-disc pl-4 text-xs text-orange-800/80 space-y-2">
                <li>Mỗi Topic chỉ có thể mapping với 01 Scorecard tại một thời điểm.</li>
                <li>Việc thay đổi mapping sẽ áp dụng cho các cuộc gọi mới phát sinh sau thời điểm lưu.</li>
              </ul>
            </div>
          </div>

          {/* Mapping Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left bg-white">
                <thead className="bg-[#f8f9fa] border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="py-4 px-6 font-bold w-32">ID TOPIC</th>
                    <th className="py-4 px-6 font-bold">TÊN TOPIC</th>
                    <th className="py-4 px-6 font-bold min-w-[300px]">SCORECARD TƯƠNG ỨNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mappings.length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-slate-400">Chưa có mapping nào.</td></tr>
                  ) : mappings.map((mapping) => (
                    <tr key={mapping.topic_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 text-violet-600 font-mono text-xs">{mapping.topic_id}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{mapping.topic_name}</td>
                      <td className="py-4 px-6">
                        <select 
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium"
                          value={localMappings[mapping.topic_id] !== undefined ? localMappings[mapping.topic_id] : mapping.scorecard_id}
                          onChange={(e) => setLocalMappings(prev => ({ ...prev, [mapping.topic_id]: e.target.value }))}
                        >
                          <option value="" disabled>-- Chọn Scorecard --</option>
                          {scorecards.map(sc => (
                            <option key={sc.id} value={sc.id}>{sc.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
                 <button 
                   onClick={() => Object.keys(localMappings).length > 0 && saveMappingMutation.mutate()}
                   disabled={Object.keys(localMappings).length === 0 || saveMappingMutation.isPending}
                   className={clsx(
                     "px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2",
                     Object.keys(localMappings).length === 0 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                      : "bg-violet-700 hover:bg-violet-800 text-white active:scale-95"
                   )}
                 >
                   {saveMappingMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                   LƯU CẤU HÌNH MAPPING ({Object.keys(localMappings).length})
                 </button>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

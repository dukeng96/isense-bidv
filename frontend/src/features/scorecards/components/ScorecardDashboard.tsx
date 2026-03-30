import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { scorecardApi } from '../api/scorecardApi';
import { mockFunnelStore, Hotline, Branch, TopicLocal } from '../api/mockFunnelStore';
import { 
  Plus, 
  Settings, 
  ChevronRight, 
  Phone, 
  Network,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';

export const ScorecardDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Local state for Navigation Funnel
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [topics, setTopics] = useState<TopicLocal[]>([]);
  
  const [selectedHotlineId, setSelectedHotlineId] = useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  // Queries (API)
  const { data: scorecards = [], isLoading: isLoadSc } = useQuery({
    queryKey: ['scorecards'],
    queryFn: scorecardApi.getScorecards
  });

  const { data: mappings = [], isLoading: isLoadMap } = useQuery({
    queryKey: ['mappings'],
    queryFn: scorecardApi.getMappings
  });

  // Mutations
  const mappingMutation = useMutation({
    mutationFn: scorecardApi.createMapping,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mappings'] })
  });
  
  const deleteMappingMutation = useMutation({
    mutationFn: scorecardApi.deleteMapping,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mappings'] })
  });

  const fallbackMutation = useMutation({
    mutationFn: scorecardApi.setGlobalFallback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      alert('Đã cập nhật Fallback Mặc định.');
    }
  });

  useEffect(() => {
    // Load local mock data
    const data = mockFunnelStore.getData();
    setHotlines(data.hotlines);
    setBranches(data.branches);
    setTopics(data.topics);
    if (data.hotlines.length > 0) {
      setSelectedHotlineId(data.hotlines[0].id);
    }
  }, []);

  const handleCreateTopic = () => {
    const virtualBranchId = currentBranches.length > 0 ? selectedBranchId : `hotline_${selectedHotlineId}`;
    if (!newTopicName.trim() || !virtualBranchId) return;
    const newTopic: TopicLocal = {
      id: `T-${Date.now()}`,
      branch_id: virtualBranchId,
      name: newTopicName,
      description: newTopicDesc
    };
    mockFunnelStore.addTopic(newTopic);
    setTopics([...topics, newTopic]);
    setNewTopicName('');
    setNewTopicDesc('');
    setShowAddTopic(false);
    setSelectedTopicId(newTopic.id);
  };

  const handleScorecardSelect = (topicId: string, topicName: string, scorecardId: string) => {
    if (!scorecardId) {
      deleteMappingMutation.mutate(topicId);
    } else {
      mappingMutation.mutate({
        topic_id: topicId,
        topic_name: topicName,
        scorecard_id: scorecardId
      });
    }
  };

  // handleToggleTopicStatus removed

  if (isLoadSc || isLoadMap) return <div className="p-8 flex justify-center items-center text-slate-400">Đang tải dữ liệu...</div>;

  const currentFallback = scorecards.find(s => s.is_global_fallback)?.id || '';
  const currentBranches = branches.filter(b => b.hotline_id === selectedHotlineId);
  const currentTopics = currentBranches.length > 0 
    ? topics.filter(t => t.branch_id === selectedBranchId)
    : topics.filter(t => t.branch_id === `hotline_${selectedHotlineId}`);
  const selectedTopic = topics.find(t => t.id === selectedTopicId);
  const getTopicMapping = (tId: string) => mappings.find(m => m.topic_id === tId);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center py-6 px-8 bg-white border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý chủ đề - scorecards</h1>
          <p className="text-slate-500 mt-1 text-sm">Định nghĩa chủ đề và gán bộ tiêu chí chấm điểm</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Default Fallback:</span>
            <select 
              className="bg-transparent text-sm font-semibold text-violet-700 outline-none w-48 truncate cursor-pointer"
              value={currentFallback}
              onChange={(e) => fallbackMutation.mutate(e.target.value)}
            >
              <option value="" disabled>-- Chưa thiết lập --</option>
              {scorecards.map(sc => (
                <option key={sc.id} value={sc.id}>{sc.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => navigate('/edit/new')}
            className="bg-violet-700 hover:bg-violet-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-sm transition-colors"
          >
            <Plus size={18} />
            TẠO BỘ TIÊU CHÍ
          </button>
        </div>
      </div>

      {/* 3-Pane Layout Body */}
      <div className="flex-1 overflow-hidden flex bg-[#f8f9fa]">
        
        {/* Pane 1: Hotline & Branch */}
        <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-100">
            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">CHỌN HOTLINE</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-violet-500" size={18} />
              <select
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer"
                value={selectedHotlineId}
                onChange={(e) => {
                  setSelectedHotlineId(e.target.value);
                  setSelectedBranchId('');
                  setSelectedTopicId('');
                }}
              >
                {hotlines.map(h => (
                  <option key={h.id} value={h.id}>{h.name} ({h.phone})</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-xs font-bold text-slate-400 mb-3 ml-2 uppercase tracking-wider flex items-center gap-1">
              <Network size={14} /> Cấu trúc IVR Nhánh
            </div>
            {currentBranches.length === 0 ? (
              <div className="text-center p-4 text-slate-400 text-sm italic">
                Không có nhánh nào.<br/>Quản lý chủ đề trực tiếp cho Hotline bên phải.
              </div>
            ) : (
              <ul className="space-y-1">
                {currentBranches.map(branch => (
                  <li key={branch.id}>
                    <button
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                        setSelectedTopicId('');
                        setShowAddTopic(false);
                      }}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all",
                        selectedBranchId === branch.id
                          ? "bg-violet-50 text-violet-700 font-bold border-l-4 border-violet-600"
                          : "text-slate-600 hover:bg-slate-50 font-medium"
                      )}
                    >
                      <span>{branch.name}</span>
                      {selectedBranchId === branch.id && <ChevronRight size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Pane 2: Topic Library */}
        <div className="flex-1 border-r border-slate-200 bg-slate-50 flex flex-col relative">
          {(!selectedBranchId && currentBranches.length > 0) ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
              <Network size={48} className="text-slate-200 mb-4" />
              <p className="text-lg font-medium text-slate-600">Chưa chọn nhánh IVR</p>
              <p className="text-sm">Vui lòng chọn một nhánh bên trái để xem và quản lý chủ đề hội thoại.</p>
            </div>
          ) : (
            <>
              <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Chủ đề hội thoại (Topic)</h2>
                  <p className="text-xs text-slate-500">
                    {currentBranches.length > 0 
                      ? `Thuộc ${branches.find(b => b.id === selectedBranchId)?.name}`
                      : `Trực tiếp cho Hotline ${hotlines.find(h => h.id === selectedHotlineId)?.phone}`
                    }
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddTopic(true)}
                  className="bg-white border border-slate-200 text-slate-700 hover:text-violet-700 hover:border-violet-300 hover:bg-violet-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-semibold transition-colors shadow-sm"
                >
                  <Plus size={16} /> Thêm Chủ đề
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {showAddTopic && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-violet-200 ring-2 ring-violet-50 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-sm mb-3 text-violet-900">Thêm chủ đề mới</h3>
                    <input 
                      type="text"
                      placeholder="Tên chủ đề (vd: Báo mất thẻ)"
                      className="w-full mb-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                    />
                    <textarea 
                      placeholder="Mô tả bối cảnh..."
                      rows={2}
                      className="w-full mb-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                      value={newTopicDesc}
                      onChange={(e) => setNewTopicDesc(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setShowAddTopic(false)}
                        className="px-4 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={handleCreateTopic}
                        className="px-4 py-1.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                )}

                {currentTopics.length === 0 && !showAddTopic && (
                  <div className="text-center p-10 bg-white border border-dashed border-slate-300 rounded-2xl">
                    <p className="text-slate-500 font-medium">Nhánh này chưa có chủ đề nào.</p>
                    <button onClick={() => setShowAddTopic(true)} className="mt-3 text-sm text-violet-600 font-bold hover:underline">Nhấn vào đây để thêm</button>
                  </div>
                )}

                {currentTopics.map(topic => {
                  const isSelected = selectedTopicId === topic.id;
                  const mapping = getTopicMapping(topic.id);
                  const isMapped = !!mapping;

                  return (
                    <div 
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={clsx(
                        "p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4",
                        isSelected 
                          ? "bg-white border-violet-400 shadow-md ring-2 ring-violet-50" 
                          : "bg-white border-slate-200 shadow-sm hover:border-violet-300 hover:shadow-md"
                      )}
                    >
                      <div className="mt-1">
                        {isMapped ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 size={18} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                            <AlertCircle size={18} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-slate-800 text-base">{topic.name}</h3>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{topic.description || 'Chưa có mô tả'}</p>
                        
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            "text-xs font-semibold px-2.5 py-1 rounded-lg border",
                            isMapped 
                              ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                              : "bg-slate-100 border-slate-200 text-slate-600 flex items-center gap-1"
                          )}>
                            {isMapped ? '🔗 Đã gán Scorecard tùy chỉnh' : '↳ Không chấm điểm'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pane 3: Quick Config */}
        <div className="w-[360px] bg-white flex flex-col shrink-0">
          {!selectedTopic ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Settings size={48} className="text-slate-200 mb-4" />
              <p className="text-sm">Chọn một Chủ đề ở Cột 2<br/>để thiết lập cấu hình nâng cao.</p>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-8 h-full flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-[#fbfbfe]">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Cấu hình Chủ đề</h2>
                <div className="text-sm text-slate-500 font-mono text-xs flex items-center gap-2">
                  ID: <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{selectedTopic.id}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                
                {/* Scorecard Assignment */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={16} className="text-violet-600" /> Scorecard chấm điểm
                  </label>
                  <p className="text-xs text-slate-500">
                    Bộ tiêu chí sẽ dùng để phân tích và đánh giá tự động các cuộc gọi rơi vào Chủ đề này.
                  </p>
                  
                  <div className="relative">
                    <select
                      className={clsx(
                        "w-full p-3 bg-white border-2 rounded-xl text-sm font-semibold transition-all cursor-pointer appearance-none outline-none",
                        getTopicMapping(selectedTopic.id)
                          ? "border-violet-300 text-violet-800 ring-4 ring-violet-50"
                          : "border-slate-300 text-slate-600 hover:border-slate-400"
                      )}
                      value={getTopicMapping(selectedTopic.id)?.scorecard_id || ''}
                      onChange={(e) => handleScorecardSelect(selectedTopic.id, selectedTopic.name, e.target.value)}
                      disabled={mappingMutation.isPending || deleteMappingMutation.isPending}
                    >
                      <option value="">[Không chấm điểm]</option>
                      {scorecards.map(sc => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      {(mappingMutation.isPending || deleteMappingMutation.isPending) ? (
                        <Loader2 size={16} className="animate-spin text-violet-600" />
                      ) : (
                        <ChevronRight size={16} className="rotate-90" />
                      )}
                    </div>
                  </div>
                  
                  {getTopicMapping(selectedTopic.id) && (
                    <div className="flex justify-end pr-1 text-xs">
                      <button 
                        onClick={() => navigate('/edit/' + getTopicMapping(selectedTopic.id)!.scorecard_id)}
                        className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                      >
                        Mở Editor Scorecard này ↗
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

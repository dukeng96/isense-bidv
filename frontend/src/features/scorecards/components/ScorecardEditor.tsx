import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { scorecardApi } from '../api/scorecardApi';
import { Settings, Plus, Star, Briefcase, Mic, ChevronDown } from 'lucide-react';

export const ScorecardEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: scorecard, isLoading } = useQuery({
    queryKey: ['scorecard', id],
    queryFn: () => scorecardApi.getScorecard(id!),
    enabled: !!id && id !== 'new'
  });

  if (isLoading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-3">
              Chỉnh sửa Bộ tiêu chí chấm điểm
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-mono border border-slate-200">
                ID: {id === 'new' ? 'NEW' : id}
              </span>
            </h1>
            <div className="text-lg font-medium text-slate-700 mt-1">
              {scorecard?.name || 'Tạo mới Scorecard'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/management')}
            className="px-6 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            HUỶ
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-violet-700 text-white font-bold hover:bg-violet-800 transition-colors shadow-sm">
            LƯU
          </button>
        </div>
      </div>
      <div className="text-right text-xs text-slate-400 italic -mt-6">
        * Các thay đổi sẽ có hiệu lực từ 00:00 ngày hôm sau
      </div>

      {/* General Layer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 cursor-pointer">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
               <Star size={20} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">Tiêu chí Nền tảng (General)</h2>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">LAYER 1 • CƠ BẢN CHO MỌI CUỘC GỌI</p>
             </div>
          </div>
          <ChevronDown size={20} className="text-slate-400" />
        </div>
        
        <div className="p-6">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="pb-3 w-10"></th>
                <th className="pb-3 font-bold">MÃ</th>
                <th className="pb-3 font-bold">TÊN TIÊU CHÍ</th>
                <th className="pb-3 font-bold">LỰA CHỌN</th>
                <th className="pb-3 font-bold text-center">YES</th>
                <th className="pb-3 font-bold text-center">NO</th>
                <th className="pb-3 font-bold text-center">N/A</th>
                <th className="pb-3 font-bold text-right">MAX SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4"><input type="checkbox" checked className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4" readOnly /></td>
                <td className="py-4 text-xs font-mono text-slate-400">GEN_01</td>
                <td className="py-4 font-bold text-slate-700">Chào hỏi đúng kịch bản</td>
                <td className="py-4"><span className="px-2 py-1 rounded-md border border-slate-200 text-xs">Yes/No/NA</span></td>
                <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="10" /></td>
                <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="0" /></td>
                <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="10" /></td>
                <td className="py-4 text-right font-bold text-violet-700">10</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4"><input type="checkbox" checked className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4" readOnly /></td>
                <td className="py-4 text-xs font-mono text-slate-400">GEN_02</td>
                <td className="py-4 font-bold text-slate-700">Thái độ chuyên nghiệp & Lịch sự</td>
                <td className="py-4"><span className="px-2 py-1 rounded-md border border-slate-200 text-xs">Yes/No/NA</span></td>
                <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="20" /></td>
                <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="-5" /></td>
                <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="0" /></td>
                <td className="py-4 text-right font-bold text-violet-700">20</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
              <Plus size={16} /> THÊM TIÊU CHÍ NỀN TẢNG MỚI
            </button>
          </div>
        </div>
      </div>

      {/* Business Layer */}
      <div className="bg-white rounded-2xl shadow-sm border border-violet-300 overflow-hidden ring-1 ring-violet-500/20 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-600"></div>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-violet-50/30 cursor-pointer pl-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center shadow-sm">
               <Briefcase size={20} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">Tiêu chí Nghiệp vụ (Business-specific)</h2>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">LAYER 2 • DÀNH RIÊNG CHO KỊCH BẢN SMARTKIDS</p>
             </div>
          </div>
          <ChevronDown size={20} className="text-slate-400" />
        </div>
        
        <div className="p-6 pl-8">
            <table className="w-full text-left text-sm mb-6">
              <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="pb-3 font-bold">MÃ</th>
                  <th className="pb-3 font-bold">TÊN TIÊU CHÍ</th>
                  <th className="pb-3 font-bold">LỰA CHỌN</th>
                  <th className="pb-3 font-bold text-center">YES</th>
                  <th className="pb-3 font-bold text-center">NO</th>
                  <th className="pb-3 font-bold text-center">N/A</th>
                  <th className="pb-3 font-bold text-right">MAX SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-xs font-mono text-slate-400">BUS_01</td>
                  <td className="py-4 font-bold text-slate-700">Nếu khách hàng có từ hai người dùng...</td>
                  <td className="py-4"><span className="px-2 py-1 rounded-md border border-slate-200 text-xs">Yes/No/NA</span></td>
                  <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="15" /></td>
                  <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="0" /></td>
                  <td className="py-4 text-center"><input type="text" className="w-12 text-center border border-slate-200 rounded p-1" defaultValue="15" /></td>
                  <td className="py-4 text-right font-bold text-violet-700">15</td>
                </tr>
              </tbody>
            </table>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">Ngưỡng đạt (Threshold):</span>
                <input type="number" className="w-16 border border-slate-200 rounded px-2 py-1 text-center font-bold" defaultValue="85" />
                <span className="text-sm font-bold text-slate-500">%</span>
              </div>
              <button className="flex items-center gap-2 text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
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
                  <span className="font-mono text-slate-400">MAX</span>
                  <input type="text" className="w-12 text-center border border-slate-200 rounded px-1" defaultValue="30" />
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
                  <span className="font-mono text-slate-400">IDEAL</span>
                  <input type="text" className="w-12 text-center border border-slate-200 rounded px-1" defaultValue="120" />
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

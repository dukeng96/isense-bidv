import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { importerApi } from '../api/importerApi';
import { Criterion } from '@/types';
import { Edit3, Sparkles, CheckCircle2, ListChecks } from 'lucide-react';
import clsx from 'clsx';

export const SmartImporter: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [rawText, setRawText] = useState('');
  const [result, setResult] = useState<Criterion[] | null>(null);

  const generateMutation = useMutation({
    mutationFn: importerApi.generateScorecard,
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleGenerate = () => {
    if (rawText.length < 10) {
      alert("Vui lòng nhập quy trình nghiệp vụ dài hơn 10 ký tự.");
      return;
    }
    generateMutation.mutate({ goal, raw_text: rawText });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Top Header Section matched to preview screenshot */}
      <div className="bg-violet-900 rounded-xl p-6 text-white flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-violet-300" />
            Smart Scorecard Importer - PREVIEW
          </h2>
          <p className="text-violet-200 text-sm mt-1">
            Vui lòng paste quy trình nghiệp vụ chi tiết của bạn vào ô dưới đây. AI sẽ tự động phân tích và tạo bộ tiêu chí chấm điểm gợi ý.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Input Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                Mục tiêu của quy trình (Procedure Goal - Optional)
                <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">GỢI Ý AI</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., Khóa SmartKids"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all transition-colors"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Nhập quy trình nghiệp vụ (Enter Business Procedure)
              </label>
              <textarea 
                rows={8}
                placeholder="Copy paste văn bản quy trình vào đây...\n\nVí dụ:\nBước 1: Kiểm tra thông tin khách hàng...\nBước 2: Xác minh lý do cần khóa tài khoản..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all resize-none font-mono text-sm leading-relaxed"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className={clsx(
                  "flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-md transition-all",
                  generateMutation.isPending 
                    ? "bg-violet-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700 hover:shadow-lg active:scale-95"
                )}
              >
                {generateMutation.isPending ? (
                  <span className="animate-pulse">Đang phân tích AI...</span>
                ) : (
                  <>
                    <Edit3 size={20} />
                    CONVERT TO SCORECARD
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center text-xs text-slate-500 mt-4">
              Bước tiếp theo: Tự động chuyển đến màn hình <span className="font-bold text-violet-700">Cấu hình Scorecard Nghiệp vụ (Pre-filled)</span>.
            </div>
          </div>
        </div>

        {/* Feature Highlights / Results */}
        <div className="space-y-4">
          {!result ? (
            <>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Chuyển đổi siêu tốc</h3>
                <p className="text-sm text-slate-500">Tự động nhận diện các bước nghiệp vụ và chuyển thành tiêu chí Đúng/Sai.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Độ chính xác cao</h3>
                <p className="text-sm text-slate-500">AI được huấn luyện trên hàng ngàn kịch bản CSKH và Telesales thực tế.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                  <ListChecks size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Tùy biến linh hoạt</h3>
                <p className="text-sm text-slate-500">Bạn hoàn toàn có thể hiệu chỉnh trọng số và mô tả sau khi AI đề xuất.</p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h3 className="font-bold text-slate-800">Kết quả (Mock Output)</h3>
                <p className="text-xs text-slate-500">Tiêu chí được gợi ý từ AI</p>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {result.map((criterion, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-violet-700">{criterion.code}</span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase">
                        {criterion.layer}
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium">{criterion.name}</div>
                    {criterion.options_type && (
                      <div className="mt-2 text-xs text-slate-500">
                        Kiểu: {criterion.options_type} | YES: {criterion.yes_score} | NO: {criterion.no_score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

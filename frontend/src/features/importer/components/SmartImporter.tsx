import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { importerApi } from '../api/importerApi';
import { Sparkles, Edit3 } from 'lucide-react';
import clsx from 'clsx';

export const SmartImporter: React.FC = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState('');
  const [rawText, setRawText] = useState('');

  const generateMutation = useMutation({
    mutationFn: importerApi.generateScorecard,
    onSuccess: (data) => {
      navigate('/edit/new', { state: { importedCriteria: data, importedGoal: goal } });
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

      <div className="max-w-4xl mx-auto w-full">
        
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

        </div>
    </div>
  );
};

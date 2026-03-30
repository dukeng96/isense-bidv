import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { importerApi } from '../api/importerApi';
import { Sparkles, Edit3, CheckCircle, Loader2, Circle } from 'lucide-react';
import clsx from 'clsx';

export const SmartImporter: React.FC = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState('');
  const [rawText, setRawText] = useState('');

  // Mock states
  const [isMocking, setIsMocking] = useState(false);
  const [mockProgress, setMockProgress] = useState(0);
  const [mockStep, setMockStep] = useState(0);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [isMockSuccess, setIsMockSuccess] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const generateMutation = useMutation({
    mutationFn: importerApi.generateScorecard,
  });

  // Auto-scroll console
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLines]);

  const runMockSequence = async () => {
    if (rawText.length < 10) {
      alert("Vui lòng nhập quy trình nghiệp vụ dài hơn 10 ký tự.");
      return;
    }

    setIsMocking(true);
    setMockProgress(0);
    setMockStep(1);
    setConsoleLines([]);
    setIsMockSuccess(false);

    // Start backend request in background
    let generatedData: any = null;
    generateMutation.mutateAsync({ goal, raw_text: rawText })
      .then(data => generatedData = data)
      .catch(console.error);

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    const addLine = (line: string) => setConsoleLines(prev => [...prev, line]);

    // Initial popup
    setMockProgress(10);
    
    // Step 1: Phân tích cấu trúc (~1s)
    addLine("> [Mã hóa] Đang đọc văn bản thô... Done.");
    await sleep(300);
    setMockProgress(15);
    addLine("> [Cấu trúc] Tìm thấy: Mục 1. Kênh tiếp nhận... Done.");
    await sleep(300);
    setMockProgress(22);
    addLine("> [Cấu trúc] Tìm thấy bảng: Mục 3. Bộ câu hỏi xác thực (BCH)... Done.");
    await sleep(200);
    setMockProgress(28);
    addLine("> [Cấu trúc] Tìm thấy bảng: Mục 4. Quy trình thực hiện (5 bước tác nghiệp)... Done.");
    await sleep(200);
    addLine("> [Cấu trúc] Tìm thấy: Mục 5. Các lưu ý khác... Done.");
    setMockProgress(32);
    await sleep(150);
    addLine("> [Phân loại] Đã nhận diện quy trình: Khóa user SmartKids.");
    setMockProgress(35);

    // Step 2: Lọc bỏ thao tác hệ thống (~1.3s)
    setMockStep(2);
    addLine("> [Phân loại hành động] Đang quét 5 bước tác nghiệp...");
    await sleep(300);
    setMockProgress(40);
    addLine("> [Lọc] Bước 1: TVV Tiếp nhận yêu cầu & Xác thực -> [GIỮ LẠI - Thoại].");
    await sleep(200);
    addLine("> [Lọc bỏ] Thao tác: Bot tự so sánh với metadata kênh tiếp nhận -> [BỎ].");
    setMockProgress(46);
    await sleep(300);
    addLine("> [Lọc bỏ] Bước 2: TVV chọn chức năng, tìm kiếm, bấm icon Khóa dịch vụ -> [BỎ - Hệ thống].");
    await sleep(200);
    setMockProgress(52);
    addLine("> [Lọc bỏ] Bước 3: GSV duyệt khóa dịch vụ -> [BỎ - GSV tác nghiệp].");
    await sleep(200);
    addLine("> [Lọc bỏ] Bước 4: Cán bộ hậu kiểm -> [BỎ].");
    setMockProgress(58);
    await sleep(300);
    addLine("> [Lọc] Bước 5: TVV Khuyến cáo khóa SIM 2 chiều -> [GIỮ LẠI - Thoại].");
    await sleep(150);
    addLine("> [Lọc] Bước 5: TVV hướng dẫn khách hàng khai báo cơ quan chức năng -> [GIỮ LẠI - Thoại].");
    setMockProgress(62);
    await sleep(50);
    addLine("> [Kết quả] Đã lọc 7/11 hành động không phải thoại.");
    setMockProgress(65);

    // Step 3: Soạn thảo tiêu chí (~0.5s)
    setMockStep(3);
    addLine("> [Chuyển đổi logic] Đang soạn thảo câu hỏi chấm điểm...");
    await sleep(100);
    setMockProgress(70);
    addLine("> [Gen] Tiêu chí: Khai thác nguyên nhân muốn khóa user (mất ĐT, lộ TT...) -> Done.");
    addLine("> [Gen] Tiêu chí KYC: Xác thực đủ 05 câu hỏi (3 bắt buộc, 2 lựa chọn) -> Done.");
    await sleep(150);
    setMockProgress(78);
    addLine("> [Gen] Tiêu chí KYC: Xác nhận chính xác user phụ cần khóa (nếu có >2 user) -> Done.");
    addLine("> [Gen] Tiêu chí: Hướng dẫn KH tự thao tác trên App (nếu KYC sai) -> Done.");
    await sleep(150);
    setMockProgress(85);
    addLine("> [Gen] Tiêu chí Khuyến cáo: Hướng dẫn KH liên hệ nhà mạng khóa SIM -> Done.");
    addLine("> [Gen] Tiêu chí Tra soát: Hướng dẫn KH kiểm tra thiết bị, link giả mạo -> Done.");
    await sleep(100);
    addLine("> [Gen] Tiêu chí Tra soát: Hướng dẫn KH khai báo cơ quan chức năng -> Done.");
    addLine("> [Hoàn tất] Đã tạo 7 tiêu chí nghiệp vụ draft.");
    setMockProgress(90);

    // Step 4: Kiểm tra & Hoàn thiện (~0.4s)
    setMockStep(4);
    addLine("> [Validation] Đang kiểm tra cấu trúc JSON iSense... OK.");
    await sleep(100);
    setMockProgress(95);
    addLine("> [Validation] Kiểm tra bộ điểm Yes/No/NA... OK.");
    addLine("> [Validation] Kiểm tra logic Max_Score... OK.");
    await sleep(150);
    addLine("> [Tích hợp] Đã thêm Layer General (Chào hỏi, Thái độ) mặc định.");
    addLine("> [Tích hợp] Đã bật các Audio Rules (Hold call, Ngắt lời) mặc định.");
    await sleep(100);
    addLine("> [Success] Scorecard \"Khoá user SmartKids\" đã sẵn sàng.");
    
    // Wait for API if needed
    while(!generatedData) {
      await sleep(100);
    }
    
    setMockProgress(100);
    setIsMockSuccess(true);
    setMockStep(5);

    // Redirect after 0.5s instead of 2s
    await sleep(500);
    navigate('/edit/new', { state: { importedCriteria: generatedData, importedGoal: goal } });
  };

  const StepItem = ({ stepNum, label }: { stepNum: number, label: string }) => {
    let status = 'pending'; // pending, active, done
    if (mockStep > stepNum) status = 'done';
    else if (mockStep === stepNum) status = 'active';

    return (
      <div className="flex items-center gap-3 py-2">
        {status === 'pending' && <Circle size={20} className="text-slate-300" />}
        {status === 'active' && <Loader2 size={20} className="text-violet-600 animate-spin" />}
        {status === 'done' && <CheckCircle size={20} className="text-green-500" />}
        <span className={clsx("text-sm transition-colors", status === 'active' ? "font-bold text-violet-900" : "text-slate-600")}>
          {stepNum}. {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative">
      
      {/* Overlay & Modal */}
      {isMocking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-center gap-3">
              {isMockSuccess ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <Sparkles className="animate-pulse text-violet-600" size={24} />
              )}
              <h3 className={clsx("text-lg font-bold uppercase tracking-wide", isMockSuccess ? "text-green-600" : "text-violet-900")}>
                {isMockSuccess ? "Soạn thảo thành công!" : "AI đang soạn thảo bộ tiêu chí"}
              </h3>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Tiến trình</span>
                  <span className={isMockSuccess ? "text-green-600" : "text-violet-600"}>{mockProgress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={clsx("h-full transition-all duration-500 ease-out", isMockSuccess ? "bg-green-500" : "bg-violet-600")}
                    style={{ width: `${mockProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1">
                <StepItem stepNum={1} label="Phân tích cấu trúc quy trình" />
                <StepItem stepNum={2} label="Lọc bỏ thao tác hệ thống" />
                <StepItem stepNum={3} label="Soạn thảo bộ tiêu chí nghiệp vụ" />
                <StepItem stepNum={4} label="Kiểm tra format & Hoàn thiện" />
              </div>

              {/* Console */}
              <div className="bg-[#212121] rounded-xl p-4 h-48 overflow-y-auto border border-violet-900/20 shadow-inner font-mono text-xs text-green-400 space-y-1">
                {consoleLines.map((line, idx) => (
                  <div key={idx} className="break-words">{line}</div>
                ))}
                {!isMockSuccess && <div className="animate-pulse">_</div>}
                <div ref={consoleEndRef} />
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                onClick={runMockSequence}
                disabled={isMocking || generateMutation.isPending}
                className={clsx(
                  "flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-md transition-all",
                  (isMocking || generateMutation.isPending)
                    ? "bg-violet-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700 hover:shadow-lg active:scale-95"
                )}
              >
                {(isMocking || generateMutation.isPending) ? (
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

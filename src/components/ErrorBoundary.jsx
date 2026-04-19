import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRestart = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    // Force reset state by clearing storage if needed, but for now just reload
    localStorage.removeItem('aml-game-storage');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full glass-panel-heavy border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
              Hệ Thống Gặp Lỗi
            </h1>
            
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Một tiến trình trong mạng lưới đã bị gián đoạn bất ngờ. <br/>
              Thông tin lỗi: <code className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-[10px]">{this.state.error?.message || "Unknown error"}</code>
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRestart}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
              >
                <RefreshCcw className="w-5 h-5" />
                THỬ LẠI LẦN NỮA
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all border border-white/10"
              >
                <Home className="w-5 h-5 text-white/60" />
                VỀ TRANG CHỦ & RESET
              </button>
            </div>

            <p className="text-[10px] text-white/20 mt-8 uppercase tracking-[0.2em]">
              AML_ASYMMETRY_CORE_STABILITY_PROTOCOL
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

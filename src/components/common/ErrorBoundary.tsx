import { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PropEase ErrorBoundary caught an exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  private handleClearStorageAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4 text-[#181A1D]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6E4DF] shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            {/* Architectural Mark */}
            <div className="w-16 h-16 rounded-2xl bg-[#111418] border border-[#C5A059]/40 flex items-center justify-center mx-auto text-[#C5A059] shadow-lg">
              <AlertTriangle className="w-8 h-8 text-[#C5A059]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8F6C27] bg-[#FBF7EE] px-2.5 py-0.5 rounded-full border border-[#C5A059]/30">
                Company A · Concierge Recovery
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#111418] pt-1">
                Session Restored Safely
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                An unexpected interface state occurred. All lead records, confirmed bookings, and GujRERA compliance registries remain protected.
              </p>
            </div>

            {/* Error Message Snippet */}
            {this.state.error && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-left">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Diagnostics</span>
                <code className="text-xs font-mono text-rose-700 block truncate mt-0.5">
                  {this.state.error.message || 'Unknown render exception'}
                </code>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-[#111418] hover:bg-[#2A3038] text-white shadow-md transition-all hover:scale-[1.02] active:scale-95 btn-ripple"
              >
                <RotateCcw className="w-4 h-4 text-[#C5A059]" />
                <span>Reload Application View</span>
              </button>

              <button
                onClick={this.handleClearStorageAndReload}
                className="w-full py-2 px-4 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                Clear Cached Demo State &amp; Restore Seeds
              </button>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DPDP Act 2023 &amp; GujRERA Safe Mode</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

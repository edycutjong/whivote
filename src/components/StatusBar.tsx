"use client";

export function StatusBar() {
  return (
    <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-lg px-4 py-2 text-xs font-mono">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">SYSTEM ONLINE</span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500">v1.0.0</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-500">LATENCY: <span className="text-cyan-400">12ms</span></span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500">UPTIME: <span className="text-emerald-400">99.9%</span></span>
      </div>
    </div>
  );
}

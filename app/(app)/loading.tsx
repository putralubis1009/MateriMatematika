import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full" />
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl relative">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      </div>
      <p className="mt-6 text-slate-400 font-medium text-sm animate-pulse">
        Memuat data...
      </p>
    </div>
  );
}

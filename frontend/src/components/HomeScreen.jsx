import { UseField } from "../hooks"

const HomeScreen = () => {
  const { reset: reset, ...proposition } = UseField("text")
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
        <h1>Logic tasks found here!</h1>
        <p className="text-slate-400 text-sm md:text-base mb-6">
          Type naturally to create symbols automatically:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
            <kbd className="px-2 py-1 bg-slate-700 rounded font-mono shadow-sm border border-slate-600 text-black text-base">
              and
            </kbd>{" "}
            <span className="text-slate-500">→</span>{" "}
            <span className="font-mono font-bold text-lg text-emerald-400">
              ∧
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
            <kbd className="px-2 py-1 bg-slate-700 rounded font-mono shadow-sm border border-slate-600 text-black text-base">
              or
            </kbd>{" "}
            <span>→</span> <span className="symbol">∨</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
            <kbd className="px-2 py-1 bg-slate-700 rounded font-mono shadow-sm border border-slate-600 text-black text-base">
              not
            </kbd>{" "}
            <span className="text-slate-500">→</span>{" "}
            <span className="font-mono font-bold text-lg text-emerald-400">
              ¬
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
            <kbd className="px-2 py-1 bg-slate-700 rounded font-mono shadow-sm border border-slate-600 text-black text-base">
              -&gt;
            </kbd>{" "}
            or{" "}
            <kbd className="px-2 py-1 bg-slate-700 rounded font-mono shadow-sm border border-slate-600 text-black text-base">
              imply
            </kbd>{" "}
            <span className="text-slate-500">→</span>{" "}
            <span className="font-mono font-bold text-lg text-emerald-400">
              →
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
            <kbd className="px-2 py-1 bg-slate-700 rounded font-mono shadow-sm border border-slate-600 text-black text-base">
              &lt;-&gt;
            </kbd>{" "}
            <span className="text-slate-500">→</span>{" "}
            <span className="font-mono font-bold text-lg text-emerald-400">
              ↔
            </span>
          </div>
          <p className="subtitle">But how do i use them?</p>
        </div>
      </div>
      <textarea
        {...proposition}
        className="w-full max-w-2xl h-32 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-600 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition resize-none shadow-inner"
        placeholder="A and B Therefore C"
      />
    </div>
  )
}

export default HomeScreen

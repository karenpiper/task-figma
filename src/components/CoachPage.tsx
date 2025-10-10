"use client";
import { useState } from "react";

const fields = ["intent", "framing", "alignment", "boundaries", "concision", "follow", "tone"] as const;
type Field = typeof fields[number];

export default function CoachPage() {
  const [summary, setSummary] = useState("");
  const [plus, setPlus] = useState("");
  const [delta, setDelta] = useState("");
  const [scores, setScores] = useState<Record<Field, number>>({
    intent: 3,
    framing: 3,
    alignment: 3,
    boundaries: 3,
    concision: 3,
    follow: 3,
    tone: 3
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/coach/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, plus, delta, ...scores })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to submit conversation" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Modern glass container */}
      <div className="glass-panel p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-gradient">
            Managing-Up Coach
          </h1>
          <p className="text-slate-600 text-lg">
            Get personalized recommendations to improve your communication and leadership skills
          </p>
        </div>

        <div className="mb-8">
          <label className="block mb-3">
            <div className="mb-3 font-semibold text-slate-800 text-lg">Conversation Summary</div>
            <textarea
              className="input-modern h-40 resize-none"
              placeholder="Describe your conversation with your manager or team member. What was discussed? What were the key points? How did it go?"
              value={summary}
              onChange={e => setSummary(e.target.value)}
            />
          </label>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Rate Your Communication</h3>
          <div className="grid gap-6">
            {fields.map(k => (
              <div key={k} className="card-modern p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="capitalize font-semibold text-slate-800 text-lg">{k}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gradient">{scores[k]}</span>
                    <span className="text-sm text-slate-500">/ 5</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={scores[k]}
                  onChange={e => setScores({ ...scores, [k]: Number(e.target.value) })}
                  className="w-full h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(scores[k] - 1) * 25}%, #e2e8f0 ${(scores[k] - 1) * 25}%, #e2e8f0 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Reflection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-3">
                <div className="mb-3 font-semibold text-slate-800">What went well? ✨</div>
                <textarea
                  className="input-modern h-32 resize-none"
                  placeholder="What aspects of the conversation went well? What did you do effectively?"
                  value={plus}
                  onChange={e => setPlus(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="block mb-3">
                <div className="mb-3 font-semibold text-slate-800">What to improve? 🎯</div>
                <textarea
                  className="input-modern h-32 resize-none"
                  placeholder="What would you like to do differently next time? Any areas for improvement?"
                  value={delta}
                  onChange={e => setDelta(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={submit}
            disabled={loading || !summary.trim()}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating Recommendations...
              </span>
            ) : (
              "Get My Recommendations"
            )}
          </button>
        </div>
      </div>

      {result?.recommendations && (
        <div className="mt-8 glass-panel p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-gradient">
              Your Personalized Recommendations
            </h2>
            <p className="text-slate-600">
              Based on your communication assessment, here are tailored suggestions to help you improve
            </p>
          </div>
          <div className="grid gap-6">
            {result.recommendations.map((r: any, index: number) => (
              <div key={r.id} className="card-modern p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold gradient-primary text-white">
                      {r.kind}
                    </span>
                  </div>
                  {r.pushed_to_kanban && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Synced to Kanban
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{r.title}</h3>
                <p className="text-slate-700 mb-4 text-lg leading-relaxed">{r.body}</p>
                {r.rationale && (
                  <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-slate-600 font-medium">
                      <span className="font-semibold">Why this helps:</span> {r.rationale}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {result?.error && (
        <div className="mt-8 glass-panel p-8 rounded-2xl">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600">{result.error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

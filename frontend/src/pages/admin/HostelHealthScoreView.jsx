import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const HostelHealthScoreView = () => {
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScore = async () => {
      try {
        const data = await analyticsService.getHostelHealthScore(1);
        setHealthScore(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadScore();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explainable Hostel Health Score</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Mathematical 100-point composite index calculated from live SLA metrics, mess reviews, and weekly audits
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-8 text-white border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            Current Health Grade: {healthScore?.ratingGrade || 'EXCELLENT'}
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            {healthScore?.hostelName || 'Kaveri Boys Hostel'}
          </h2>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            This score dynamically updates as complaints are resolved within SLA windows and students submit food/cleanliness ratings.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 text-center min-w-[200px]">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">Overall Index</span>
          <div className="text-6xl font-black text-white mt-1">
            {healthScore?.overallScore || 92}
          </div>
          <span className="text-[11px] text-emerald-400 font-bold block mt-1">Out of 100 Points</span>
        </div>
      </div>

      {/* 5 Factors Breakdown */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft space-y-6">
        <h3 className="text-base font-bold text-slate-900">Factor Breakdown &amp; Scoring Logic</h3>

        <div className="space-y-6">
          {healthScore?.factorBreakdown?.map((f, idx) => {
            const pct = Math.round((f.pointsEarned / f.maxPoints) * 100);
            return (
              <div key={idx} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">{f.factorName}</span>
                    <span className="text-[11px] text-slate-500">{f.statusDescription}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    <span className="text-indigo-600 font-extrabold">{f.pointsEarned}</span> / {f.maxPoints} pts ({pct}%)
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 85 ? 'bg-indigo-600' : pct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

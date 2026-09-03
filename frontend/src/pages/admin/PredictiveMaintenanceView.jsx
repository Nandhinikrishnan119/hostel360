import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { TrendingUp, AlertTriangle, ShieldAlert, CheckCircle2, Wrench } from 'lucide-react';

export const PredictiveMaintenanceView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const res = await analyticsService.getPredictiveInsights();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInsights();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Predictive Maintenance &amp; Failure Trends</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Intelligent pattern recognition flagging chronic room defects, asset wear, and block-level surge anomalies
        </p>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recurring Room Issues */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Chronic Recurring Defects</h3>
              <p className="text-xs text-slate-500">Rooms with 2+ repeat failures in the same category</p>
            </div>
          </div>

          {(!data?.recurringIssues || data.recurringIssues.length === 0) ? (
            <p className="text-xs text-slate-400 text-center py-8">No recurring failures detected.</p>
          ) : (
            <div className="space-y-3">
              {data.recurringIssues.map((ri, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-rose-950">
                      {ri.blockName} • Room {ri.roomNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900">
                      {ri.complaintCount} Repairs Logged
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">Issue: {ri.categoryName}</p>
                  <p className="text-[11px] text-rose-800 font-semibold mt-1">
                    💡 Recommendation: {ri.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Block Surge Trends */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Block-Level Surge Anomalies</h3>
              <p className="text-xs text-slate-500">Abnormal surge in specific complaint clusters</p>
            </div>
          </div>

          {(!data?.blockFailureTrends || data.blockFailureTrends.length === 0) ? (
            <p className="text-xs text-slate-400 text-center py-8">No block surges detected.</p>
          ) : (
            <div className="space-y-3">
              {data.blockFailureTrends.map((bt, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-950">{bt.blockName} ({bt.categoryName})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                      Risk: {bt.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{bt.insightMessage}</p>
                  <span className="text-[10px] font-bold text-amber-800 block mt-1">
                    Trend Growth: +{bt.percentageIncrease.toFixed(1)}% vs baseline
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

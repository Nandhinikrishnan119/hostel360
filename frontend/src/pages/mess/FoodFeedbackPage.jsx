import React, { useState, useEffect } from 'react';
import { messService } from '../../services/messService';
import { Star, AlertTriangle, MessageSquare, CheckCircle, ShieldAlert } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';

export const FoodFeedbackPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await messService.getFoodComplaints(1);
      setComplaints(data || []);
    } catch (err) {
      console.error('Failed to load food complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      await messService.resolveFoodComplaint(id, 'Inspected batch with cooking staff and corrected seasoning.');
      loadComplaints();
    } catch (err) {
      console.error('Failed to resolve complaint:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Food Quality, Hygiene &amp; Student Feedback Monitor
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review student meal satisfaction ratings, nutrition audits, and address mess grievances.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Mess Satisfaction"
          value="4.6 / 5.0"
          icon={Star}
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
          subtitle="Based on 140 ratings this week"
        />
        <StatCard
          title="Active Food Grievances"
          value={complaints.filter((c) => c.status !== 'RESOLVED').length}
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          subtitle="Requiring kitchen inspection"
        />
        <StatCard
          title="Hygiene Compliance"
          value="98.5%"
          icon={ShieldAlert}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          subtitle="Sanitization audit score"
        />
      </div>

      {/* Grievances List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Recent Student Food &amp; Hygiene Reports</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading food reports...</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No active food complaints! Mess hygiene standards are optimal.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <div key={c.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700">
                      {c.complaintType || 'Quality Issue'}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {c.studentName} (Roll: {c.studentRollNo})
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">"{c.description}"</p>
                  <p className="text-[11px] text-slate-400">{c.mealDate} • {c.mealType}</p>
                </div>

                {c.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleResolveComplaint(c.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm self-start md:self-center"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Resolve &amp; Inspect Batch</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 self-start md:self-center">
                    ✓ Resolved &amp; Inspected
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

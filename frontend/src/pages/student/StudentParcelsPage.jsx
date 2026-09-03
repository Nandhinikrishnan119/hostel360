import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { Package, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const StudentParcelsPage = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParcels = async () => {
      try {
        const data = await operationsService.getMyParcels();
        setParcels(data);
      } catch (err) {
        console.error('Failed to load parcels', err);
      } finally {
        setLoading(false);
      }
    };
    loadParcels();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Parcel Inward &amp; Delivery Desk</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Show your secure 6-digit OTP code to the Security Officer at Gate 1 for parcel pickup
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900">Arrived Deliveries</h3>

        {parcels.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">
            No parcels at security desk currently.
          </p>
        ) : (
          <div className="space-y-3">
            {parcels.map((p) => {
              const isPending = p.status === 'ARRIVED';
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isPending
                      ? 'bg-amber-50/50 border-amber-200 ring-1 ring-amber-500/10'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{p.courierName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Tracking No: <span className="font-mono font-bold text-slate-800">{p.trackingNumber || 'N/A'}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Arrived: {new Date(p.arrivalTimestamp).toLocaleString()} • Location: {p.remarks || 'Gate 1 Shelf'}
                    </p>
                  </div>

                  {isPending ? (
                    <div className="bg-white p-3 rounded-2xl border border-amber-300 text-center sm:text-right shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        Collection OTP
                      </span>
                      <span className="text-xl font-black text-amber-900 font-mono tracking-widest">
                        {p.collectionOtp || '------'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Collected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

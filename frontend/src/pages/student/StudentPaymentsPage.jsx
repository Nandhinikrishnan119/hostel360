import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Receipt, CreditCard, DollarSign, Download, CheckCircle, Clock } from 'lucide-react';

export const StudentPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptModal, setReceiptModal] = useState(null);

  useEffect(() => {
    loadMyPayments();
  }, []);

  const loadMyPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getMyPayments();
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to load my payments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Hostel Fee Invoices &amp; Receipts
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your official room accommodation, mess fees, and verified digital payment receipts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Fee Statement &amp; History</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading fee records...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No fee invoices recorded for your room.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 text-xs">{p.invoiceNumber}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {p.paymentType?.replace('_', ' ')}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {p.remarks || `${p.paymentType} for ${p.academicYear}`}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Due Date: <strong>{p.dueDate}</strong></span>
                    {p.paymentDate && <span>Paid on: <strong>{p.paymentDate}</strong></span>}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start md:self-center">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">₹{p.amount?.toLocaleString()}</div>
                    {p.remainingBalance > 0 ? (
                      <div className="text-[11px] font-bold text-rose-600">
                        Due: ₹{p.remainingBalance?.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-[11px] font-bold text-emerald-600">Fully Paid</div>
                    )}
                  </div>

                  <button
                    onClick={() => setReceiptModal(p)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt View Modal */}
      {receiptModal && (
        <Modal
          isOpen={!!receiptModal}
          onClose={() => setReceiptModal(null)}
          title={`Hostel Fee Receipt — ${receiptModal.invoiceNumber}`}
        >
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-sm font-bold text-slate-900">Hostel360 Official Receipt</div>
                <div className="text-[11px] text-slate-500">{receiptModal.hostelName}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {receiptModal.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Resident</div>
                <div className="font-bold text-slate-900">{receiptModal.studentName}</div>
                <div>{receiptModal.studentRollNo}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Payment Info</div>
                <div>Method: {receiptModal.paymentMethod || 'Online Transfer'}</div>
                <div className="font-mono text-[11px] truncate">Ref: {receiptModal.transactionReference || 'N/A'}</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>{receiptModal.paymentType?.replace('_', ' ')}</span>
                <span>₹{receiptModal.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold pt-1.5 border-t border-slate-100">
                <span>Total Paid</span>
                <span>₹{receiptModal.paidAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReceiptModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

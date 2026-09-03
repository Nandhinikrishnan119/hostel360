import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Receipt,
  Download,
  Check,
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    studentId: '1',
    hostelId: '1',
    paymentType: 'HOSTEL_FEE',
    amount: '',
    dueDate: '',
    academicYear: '2025-2026',
    semester: 'Spring',
    remarks: '',
  });

  const [recordForm, setRecordForm] = useState({
    paidAmount: '',
    paymentMethod: 'UPI',
    transactionReference: '',
    remarks: '',
  });

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sumData, payData] = await Promise.all([
        paymentService.getSummary(),
        paymentService.getPayments({
          status: statusFilter || undefined,
          paymentType: typeFilter || undefined,
          search: search || undefined,
          size: 50,
        }),
      ]);
      setSummary(sumData);
      setPayments(payData.content || []);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await paymentService.createInvoice({
        ...createForm,
        studentId: Number(createForm.studentId),
        hostelId: Number(createForm.hostelId),
        amount: Number(createForm.amount),
      });
      setIsCreateModalOpen(false);
      setCreateForm({
        studentId: '1',
        hostelId: '1',
        paymentType: 'HOSTEL_FEE',
        amount: '',
        dueDate: '',
        academicYear: '2025-2026',
        semester: 'Spring',
        remarks: '',
      });
      loadData();
    } catch (err) {
      console.error('Failed to create invoice:', err);
      alert('Failed to generate invoice. Please check your inputs.');
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await paymentService.recordPayment(selectedInvoice.id, {
        ...recordForm,
        paidAmount: Number(recordForm.paidAmount),
      });
      setIsRecordModalOpen(false);
      setSelectedInvoice(null);
      setRecordForm({
        paidAmount: '',
        paymentMethod: 'UPI',
        transactionReference: '',
        remarks: '',
      });
      loadData();
    } catch (err) {
      console.error('Failed to record payment:', err);
      alert('Failed to record payment.');
    }
  };

  const openRecordModal = (invoice) => {
    setSelectedInvoice(invoice);
    setRecordForm({
      paidAmount: invoice.remainingBalance || invoice.amount,
      paymentMethod: 'UPI',
      transactionReference: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
      remarks: 'Payment settled via counter/portal verification',
    });
    setIsRecordModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hostel Fee &amp; Payment Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track revenue collections, pending fee dues, defaulters, and issue official receipts.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Collected"
          value={`₹${(summary?.totalCollectedAmount || 0).toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          subtitle="Realized fee revenue"
        />
        <StatCard
          title="Pending Dues"
          value={`₹${(summary?.totalPendingAmount || 0).toLocaleString()}`}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          subtitle="Awaiting resident settlement"
        />
        <StatCard
          title="Overdue Invoices"
          value={summary?.overdueCount || 0}
          icon={AlertCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          subtitle="Past due deadline"
        />
        <StatCard
          title="Total Invoices"
          value={summary?.totalInvoices || 0}
          icon={Receipt}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          subtitle={`${summary?.paidCount || 0} fully settled`}
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, roll no, invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
              <option value="OVERDUE">OVERDUE</option>
              <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Fee Types</option>
            <option value="HOSTEL_FEE">Hostel Fee</option>
            <option value="MESS_FEE">Mess Fee</option>
            <option value="MAINTENANCE_FEE">Maintenance Fee</option>
            <option value="CAUTION_DEPOSIT">Caution Deposit</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Resident</th>
                <th className="px-5 py-3.5">Room &amp; Hostel</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Paid / Balance</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    Loading fee invoices...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    No fee payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600">
                      {p.invoiceNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{p.studentName}</div>
                      <div className="text-[11px] text-slate-500">{p.studentRollNo}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">
                        {p.blockName ? `${p.blockName} - ${p.roomNumber}` : 'Unassigned'}
                      </div>
                      <div className="text-[10px] text-slate-500">{p.hostelName}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {p.paymentType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      ₹{p.amount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-emerald-600">
                        ₹{p.paidAmount?.toLocaleString()}
                      </div>
                      {p.remainingBalance > 0 && (
                        <div className="text-[11px] text-rose-600 font-medium">
                          Bal: ₹{p.remainingBalance?.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {p.dueDate}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status !== 'PAID' && (
                          <button
                            onClick={() => openRecordModal(p)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold transition-colors"
                          >
                            Record Pay
                          </button>
                        )}
                        <button
                          onClick={() => setReceiptModal(p)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Official Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate New Hostel Fee Invoice"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
              <select
                value={createForm.studentId}
                onChange={(e) => setCreateForm({ ...createForm, studentId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="1">Ananya Sundar (23CS101 - Room B-204)</option>
                <option value="2">Pooja Chawla (23CS102 - Room B-204)</option>
                <option value="3">Kavya Nambiar (23IT205 - Room A-101)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hostel</label>
              <select
                value={createForm.hostelId}
                onChange={(e) => setCreateForm({ ...createForm, hostelId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="1">Kaveri Girls Hostel</option>
                <option value="2">Ganga Girls Hostel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fee Category</label>
              <select
                value={createForm.paymentType}
                onChange={(e) => setCreateForm({ ...createForm, paymentType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="HOSTEL_FEE">Hostel Accommodation Fee</option>
                <option value="MESS_FEE">Mess &amp; Catering Fee</option>
                <option value="MAINTENANCE_FEE">Amenities &amp; Maintenance Fee</option>
                <option value="CAUTION_DEPOSIT">Caution Deposit (Refundable)</option>
                <option value="FINE_PENALTY">Late / Disciplinary Fine</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 45000"
                value={createForm.amount}
                onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={createForm.dueDate}
                onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester / Term</label>
              <input
                type="text"
                value={createForm.semester}
                onChange={(e) => setCreateForm({ ...createForm, semester: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
            <textarea
              rows="2"
              placeholder="Notes or fee breakdown..."
              value={createForm.remarks}
              onChange={(e) => setCreateForm({ ...createForm, remarks: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={`Record Payment for ${selectedInvoice?.invoiceNumber}`}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">{selectedInvoice?.studentName}</div>
              <div className="text-[11px] text-slate-600">Total Invoice: ₹{selectedInvoice?.amount?.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Remaining Balance</div>
              <div className="font-bold text-rose-600 text-sm">₹{selectedInvoice?.remainingBalance?.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount Paying (₹)</label>
              <input
                type="number"
                required
                max={selectedInvoice?.remainingBalance}
                value={recordForm.paidAmount}
                onChange={(e) => setRecordForm({ ...recordForm, paidAmount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={recordForm.paymentMethod}
                onChange={(e) => setRecordForm({ ...recordForm, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="NET_BANKING">Net Banking / NEFT</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CASH">Counter Cash</option>
                <option value="DEMAND_DRAFT">Demand Draft (DD)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / UTR #</label>
            <input
              type="text"
              required
              placeholder="e.g. UPI-9988221144"
              value={recordForm.transactionReference}
              onChange={(e) => setRecordForm({ ...recordForm, transactionReference: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Verification Remarks</label>
            <input
              type="text"
              placeholder="e.g. Bank slip verified by warden"
              value={recordForm.remarks}
              onChange={(e) => setRecordForm({ ...recordForm, remarks: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-600/20"
            >
              Confirm &amp; Issue Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* Receipt View Modal */}
      {receiptModal && (
        <Modal
          isOpen={!!receiptModal}
          onClose={() => setReceiptModal(null)}
          title={`Official Hostel Fee Receipt — ${receiptModal.invoiceNumber}`}
        >
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5 text-xs text-slate-700">
            {/* Receipt Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-base font-bold text-slate-900">Hostel360 Official Receipt</div>
                <div className="text-[11px] text-slate-500">{receiptModal.hostelName}</div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  receiptModal.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {receiptModal.status}
                </span>
              </div>
            </div>

            {/* Resident & Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-slate-400 font-bold uppercase text-[10px]">Resident Details</div>
                <div className="font-bold text-slate-900 mt-1">{receiptModal.studentName}</div>
                <div>Roll No: {receiptModal.studentRollNo}</div>
                <div>Room: {receiptModal.blockName} - {receiptModal.roomNumber}</div>
              </div>
              <div>
                <div className="text-slate-400 font-bold uppercase text-[10px]">Payment Details</div>
                <div className="mt-1 font-semibold">Mode: {receiptModal.paymentMethod || 'Online'}</div>
                <div>Txn Ref: <span className="font-mono text-slate-900">{receiptModal.transactionReference || 'N/A'}</span></div>
                <div>Due Date: {receiptModal.dueDate}</div>
              </div>
            </div>

            {/* Amount Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between font-medium">
                <span>{receiptModal.paymentType?.replace('_', ' ')} ({receiptModal.academicYear})</span>
                <span>₹{receiptModal.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold pt-2 border-t border-slate-100">
                <span>Amount Paid</span>
                <span>₹{receiptModal.paidAmount?.toLocaleString()}</span>
              </div>
              {receiptModal.remainingBalance > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Balance Due</span>
                  <span>₹{receiptModal.remainingBalance?.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-slate-400">
              This is a digitally verified e-receipt issued by Hostel360 Administration.
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
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

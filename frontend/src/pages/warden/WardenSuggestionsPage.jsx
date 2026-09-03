import React, { useState, useEffect } from 'react';
import { suggestionService } from '../../services/suggestionService';
import { Lightbulb, ThumbsUp, Check, X, MessageSquare, Plus } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const WardenSuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('ACCEPTED');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const data = await suggestionService.getAllSuggestions(1);
      setSuggestions(data || []);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (sug, status) => {
    setSelectedSuggestion(sug);
    setNewStatus(status);
    setFeedback(status === 'ACCEPTED' ? 'Approved by Warden. Forwarding to facilities for procurement.' : 'Reviewed. Currently not feasible due to space constraints.');
    setIsFeedbackModalOpen(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedSuggestion) return;
    try {
      await suggestionService.updateStatus(selectedSuggestion.id, newStatus, feedback);
      setIsFeedbackModalOpen(false);
      setSelectedSuggestion(null);
      loadSuggestions();
    } catch (err) {
      console.error('Failed to update suggestion:', err);
      alert('Failed to update suggestion status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Student Community Suggestions &amp; Council Ideas
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review upvoted student ideas for hostel amenities, mess improvements, and recreational facilities.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading student suggestions...</div>
      ) : suggestions.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
          No student suggestions submitted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 uppercase">
                    {sug.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{sug.title}</h3>
                  <p className="text-xs text-slate-500">
                    {sug.isAnonymous ? 'Anonymous Student' : sug.studentName || 'Resident Student'}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{sug.upvotesCount || 0}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {sug.description}
              </p>

              {sug.adminFeedback && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-100">
                  <span className="font-bold text-slate-900 text-[11px] block">Warden Council Note:</span>
                  <p className="italic">"{sug.adminFeedback}"</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  sug.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                  sug.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {sug.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReview(sug, 'ACCEPTED')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleOpenReview(sug, 'REJECTED')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title={`Review Suggestion — ${newStatus}`}
      >
        <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Feedback / Action Note for Students
            </label>
            <textarea
              rows="3"
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-white font-bold ${
                newStatus === 'ACCEPTED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Save Decision
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

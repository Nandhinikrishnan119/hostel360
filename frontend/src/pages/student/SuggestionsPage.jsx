import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { suggestionService } from '../../services/suggestionService';
import { Modal } from '../../components/common/Modal';
import {
  Lightbulb,
  ThumbsUp,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const SuggestionsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Suggestion Modal
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('INFRASTRUCTURE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Weekly Survey Modal
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [foodScore, setFoodScore] = useState(4);
  const [cleanScore, setCleanScore] = useState(4);
  const [wifiScore, setWifiScore] = useState(4);
  const [waterScore, setWaterScore] = useState(5);
  const [secScore, setSecScore] = useState(5);
  const [maintScore, setMaintScore] = useState(4);
  const [surveyRemarks, setSurveyRemarks] = useState('');

  const loadSuggestions = async () => {
    try {
      const data = await suggestionService.getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    try {
      await suggestionService.submitSuggestion({
        category,
        title,
        description,
        isAnonymous,
      });
      showToast('Idea submitted to Hostel Student Council & Warden!', 'success');
      setShowModal(false);
      setTitle('');
      setDescription('');
      loadSuggestions();
    } catch (err) {
      showToast('Failed to post idea', 'error');
    }
  };

  const handleUpvote = async (id) => {
    try {
      await suggestionService.upvoteSuggestion(id);
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, upvotesCount: s.upvotesCount + 1 } : s))
      );
      showToast('Upvoted!', 'success');
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    try {
      await suggestionService.submitWeeklyFeedback({
        weekStartDate: new Date().toISOString().split('T')[0],
        foodScore,
        cleanlinessScore: cleanScore,
        wifiScore,
        waterScore,
        securityScore: secScore,
        maintenanceScore: maintScore,
        remarks: surveyRemarks,
      });
      showToast('Weekly satisfaction audit submitted! Thank you.', 'success');
      setShowSurveyModal(false);
    } catch (err) {
      showToast('Survey submission failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ideas, Suggestions &amp; Feedback</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Propose hostel facility enhancements, upvote community ideas, and audit weekly amenities
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Propose New Idea
          </button>
          <button
            onClick={() => setShowSurveyModal(true)}
            className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            Weekly Survey
          </button>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((s) => (
          <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {s.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {s.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
            </div>

            {s.adminFeedback && (
              <div className="mt-4 p-3 rounded-xl bg-teal-50 border border-teal-100 text-[11px] text-teal-900">
                <span className="font-bold">Admin Response:</span> {s.adminFeedback}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Posted by: {s.isAnonymous ? 'Anonymous Resident' : (s.student?.user?.fullName || 'Student')}
              </span>
              <button
                onClick={() => handleUpvote(s.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{s.upvotesCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="💡 Propose Hostel Improvement Idea"
        subtitle="Submit your creative suggestions for hostel life, infrastructure, or sports facilities"
      >
        <form onSubmit={handleSuggestionSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            >
              <option value="INFRASTRUCTURE">Infrastructure &amp; Rooms</option>
              <option value="WIFI">Wi-Fi &amp; Internet Connectivity</option>
              <option value="FOOD">Food &amp; Mess Upgrades</option>
              <option value="CLEANLINESS">Cleanliness &amp; Waste Management</option>
              <option value="RECREATION">Sports &amp; Common Room</option>
              <option value="SECURITY">Safety &amp; Security</option>
              <option value="OTHER">Other Ideas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Idea Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Add 2 Table Tennis boards in Block B recreation room"
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Proposal &amp; Benefits *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how this improves student wellness, costs, or convenience..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAnon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isAnon" className="text-xs text-slate-700 font-semibold">
              Post anonymously (hide my name from public card)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Submit Idea
            </button>
          </div>
        </form>
      </Modal>

      {/* Weekly Survey Modal */}
      <Modal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        title="📊 Weekly Hostel Quality Audit"
        subtitle="Your ratings directly influence the explainable Hostel Health Score"
      >
        <form onSubmit={handleSurveySubmit} className="space-y-4">
          {[
            { label: 'Mess & Food Quality', val: foodScore, setVal: setFoodScore },
            { label: 'Room & Washroom Cleanliness', val: cleanScore, setVal: setCleanScore },
            { label: 'Wi-Fi Speed & Connectivity', val: wifiScore, setVal: setWifiScore },
            { label: 'Water Supply & Heating', val: waterScore, setVal: setWaterScore },
            { label: 'Campus & Hostel Security', val: secScore, setVal: setSecScore },
            { label: 'Maintenance Responsiveness', val: maintScore, setVal: setMaintScore },
          ].map((field) => (
            <div key={field.label} className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">{field.label}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => field.setVal(n)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      field.val >= n ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Weekly Remarks
            </label>
            <textarea
              rows={2}
              value={surveyRemarks}
              onChange={(e) => setSurveyRemarks(e.target.value)}
              placeholder="Any specific praise or grievance from this week..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowSurveyModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Submit Weekly Audit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

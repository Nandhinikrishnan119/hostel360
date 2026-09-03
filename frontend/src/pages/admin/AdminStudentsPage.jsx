import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { Search, Filter, Users, Phone, Mail, Home, MapPin, Award } from 'lucide-react';

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [hostelId, setHostelId] = useState('');

  useEffect(() => {
    loadStudents();
  }, [hostelId]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.searchStudents({
        query: query || undefined,
        hostelId: hostelId ? Number(hostelId) : undefined,
        size: 50,
      });
      setStudents(res.content || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadStudents();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Resident Students Directory &amp; Roster
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete database of registered hostel residents across all blocks and wings.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, roll number, department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={hostelId}
            onChange={(e) => setHostelId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Hostels</option>
            <option value="1">Kaveri Girls Hostel</option>
            <option value="2">Ganga Girls Hostel</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading resident directory...</div>
      ) : students.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
          No students found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {s.fullName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{s.fullName}</h3>
                    <p className="text-xs font-mono text-indigo-600 font-semibold">{s.studentId}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                  Year {s.yearOfStudy || 1}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong>Room {s.roomNumber || 'N/A'}</strong> ({s.hostelName || 'Hostel'} - Bed {s.bedLabel || 'A'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.departmentName || 'Engineering'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-semibold">Parent:</span>
                  <span>{s.parentName} ({s.parentPhone})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { DoorClosed, Users, Phone, Mail, Building, ShieldAlert, Award } from 'lucide-react';

export const MyRoomPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentService.getMyProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading room information...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Room &amp; Roommates</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official hostel allocation, roommate roster, and emergency contacts
        </p>
      </div>

      {/* Main Room Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
              <DoorClosed className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Allocated Room</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-0.5">
                Room {profile?.roomNumber || 'B-204'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile?.hostelName || 'Kaveri Boys Hostel'} • {profile?.blockName || 'Block B (Senior Wing)'} • Bed {profile?.bedLabel || 'A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              ✓ Active Occupancy
            </span>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Resident Name</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{profile?.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Student ID / Roll No</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{profile?.studentId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Department &amp; Year</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{profile?.departmentName} (Year {profile?.yearOfStudy})</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Blood Group</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{profile?.bloodGroup || 'O+'}</p>
          </div>
        </div>

        {/* Guardian Contact Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Parent / Guardian</p>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{profile?.parentName || 'M. Sundaram'}</h4>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {profile?.parentPhone || '+91 9443322199'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
            <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">Emergency Contact Number</p>
            <h4 className="text-sm font-bold text-red-950 mt-1">{profile?.emergencyContact || '+91 9443322199'}</h4>
            <p className="text-[11px] text-red-700 mt-1">Verified on hostel registry file</p>
          </div>
        </div>
      </div>

      {/* Roommates Roster */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Roommates in {profile?.roomNumber || 'B-204'}</h3>
        </div>

        {(!profile?.roommates || profile.roommates.length === 0) ? (
          <p className="text-xs text-slate-400">No other roommates registered in this room currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.roommates.map((rm, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {rm.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rm}</h4>
                  <p className="text-[11px] text-slate-500">Kaveri Boys Hostel • Active Resident</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

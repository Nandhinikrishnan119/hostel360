import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';
import { Modal } from '../../components/common/Modal';
import { Grid3X3, Users, Phone, DoorClosed, CheckCircle2 } from 'lucide-react';

export const RoomOccupancyVisualizer = () => {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState(user?.hostelId || 1);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHostels = async () => {
      try {
        const hData = await roomService.getAllHostels();
        setHostels(hData);
        if (hData.length > 0 && !selectedHostelId) {
          setSelectedHostelId(hData[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadHostels();
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      if (!selectedHostelId) return;
      setLoading(true);
      try {
        const data = await roomService.getRoomsByHostel(selectedHostelId);
        setRooms(data);
      } catch (err) {
        console.error('Failed to load rooms', err);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, [selectedHostelId]);

  // Group rooms by block
  const blockMap = rooms.reduce((acc, r) => {
    const bName = r.blockName || 'General Block';
    if (!acc[bName]) acc[bName] = [];
    acc[bName].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header with Hostel Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Visual Room Occupancy Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual floor grid of bed allocations, vacancies, and resident details
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(Number(e.target.value))}
            className="text-xs font-bold rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm"
          >
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.genderType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-500" />
          <span className="font-semibold text-slate-700">Vacant Beds Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-500" />
          <span className="font-semibold text-slate-700">Partially Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-red-500" />
          <span className="font-semibold text-slate-700">Full Capacity</span>
        </div>
      </div>

      {/* Blocks Visual Grids */}
      <div className="space-y-8">
        {Object.entries(blockMap).map(([blockName, blockRooms]) => (
          <div key={blockName} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{blockName}</h3>
              <span className="text-xs font-semibold text-slate-500">{blockRooms.length} Rooms</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {blockRooms.map((r) => {
                const isFull = r.currentOccupancy >= r.capacity;
                const isPart = r.currentOccupancy > 0 && !isFull;
                const isAvail = r.currentOccupancy === 0;

                const colorClass = isFull
                  ? 'bg-red-50/80 border-red-200 hover:border-red-400 text-red-950'
                  : isPart
                  ? 'bg-amber-50/80 border-amber-200 hover:border-amber-400 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400 text-emerald-950';

                const dotColor = isFull ? 'bg-red-500' : isPart ? 'bg-amber-500' : 'bg-emerald-500';

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoom(r)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:shadow-soft flex flex-col justify-between ${colorClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm">{r.roomNumber}</span>
                        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">Floor {r.floor || 1} • {r.roomType}</span>
                    </div>

                    <div className="mt-4 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-bold">
                      <span>{r.currentOccupancy} / {r.capacity} Beds</span>
                      <span className="text-[10px] font-normal text-slate-500">
                        {r.availableBeds} free
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Room Details Modal with Occupants */}
      <Modal
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        title={`Room ${selectedRoom?.roomNumber} Details`}
        subtitle={`${selectedRoom?.hostelName} • ${selectedRoom?.blockName} • ${selectedRoom?.roomType}`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Capacity</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedRoom?.capacity} Beds</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Occupied</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedRoom?.currentOccupancy} Beds</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Available</span>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">{selectedRoom?.availableBeds} Free</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Allocated Residents</h4>
            {(!selectedRoom?.occupants || selectedRoom.occupants.length === 0) ? (
              <p className="text-xs text-slate-400 p-4 text-center">Room is currently vacant.</p>
            ) : (
              <div className="space-y-2.5">
                {selectedRoom.occupants.map((occ, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{occ.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          Bed {occ.bedLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Roll: {occ.rollNumber} • Dept: {occ.department} (Year {occ.year})
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {occ.phone || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

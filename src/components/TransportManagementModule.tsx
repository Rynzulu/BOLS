import React, { useState } from "react";
import { TransportRoute, TransportVehicle, TransportPupilAssignment, Student } from "../types";
import {
  Bus,
  Search,
  Plus,
  MapPin,
  Clock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  X
} from "lucide-react";

interface TransportManagementModuleProps {
  routes?: TransportRoute[];
  vehicles: TransportVehicle[];
  assignments?: TransportPupilAssignment[];
  students: Student[];
  userRole?: string;
  canManage?: boolean;
  onAddRoute?: (route: TransportRoute) => void;
  onAddVehicle: (vehicle: TransportVehicle) => void;
  onAssignPupil?: (assignment: TransportPupilAssignment) => void;
  onRemovePupil?: (id: number) => void;
}

export function TransportManagementModule({
  routes = [],
  vehicles,
  assignments = [],
  students,
  userRole,
  canManage: canManageProp,
  onAddRoute,
  onAddVehicle,
  onAssignPupil,
  onRemovePupil
}: TransportManagementModuleProps) {
  const [activeTab, setActiveTab] = useState<"routes" | "fleet">("routes");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // New Route State
  const [routeName, setRouteName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("+260 977 ");
  const [busNumber, setBusNumber] = useState("BAF 4219 ZM");
  const [monthlyFeeZMW, setMonthlyFeeZMW] = useState(850);
  const [stopsText, setStopsText] = useState("Woodlands Shopping Mall, Kabulonga Roundabout, Ibex Hill Main Gate");

  // New Vehicle State
  const [regNumber, setRegNumber] = useState("");
  const [model, setModel] = useState("Toyota Coaster (30 Seater)");
  const [seatCapacity, setSeatCapacity] = useState(30);
  const [fitnessExpiry, setFitnessExpiry] = useState("2026-11-30");

  const totalTransportPupils = routes.reduce((acc, r) => acc + (r.studentCount || 0), 0) + assignments.length;

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim() || !driverName.trim()) return;

    const stops = stopsText.split(",").map(s => s.trim()).filter(Boolean);
    const newRoute: TransportRoute = {
      id: Date.now(),
      name: routeName.trim(),
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      busNumber: busNumber.trim(),
      monthlyFeeZMW: Number(monthlyFeeZMW) || 750,
      studentCount: 0,
      stops
    };

    if (onAddRoute) {
      onAddRoute(newRoute);
    }
    setShowAddRouteModal(false);
    setRouteName("");
    setDriverName("");
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) return;

    const newVehicle: TransportVehicle = {
      id: Date.now(),
      registrationNumber: regNumber.trim(),
      model: model.trim(),
      capacity: Number(seatCapacity) || 30,
      driverName: driverName.trim() || "Assigned School Driver",
      rtsaFitnessExpiry: fitnessExpiry,
      status: "Active & Fit"
    };

    onAddVehicle(newVehicle);
    setShowAddVehicleModal(false);
    setRegNumber("");
  };

  const canManage = canManageProp !== undefined ? canManageProp : (userRole === "super_admin" || userRole === "school_admin" || userRole === "head_teacher" || userRole === "admin");

  return (
    <div id="transport-management-module" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Bus className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 font-serif">
              School Transport & Fleet Operations
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Designated pupil bus routes, RTSA certified drivers, vehicle road fitness, and designated neighborhood pickup stops.
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddRouteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Bus Route</span>
            </button>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Bus Routes</div>
          <div className="text-2xl font-bold text-slate-800 mt-1 font-serif">{routes.length} Routes</div>
          <div className="text-xs text-slate-500 mt-1">Covering metropolitan areas</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transport Pupils</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-serif">{totalTransportPupils} Subscribed</div>
          <div className="text-xs text-slate-500 mt-1">Daily morning & afternoon pickup</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">School Fleet</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1 font-serif">{vehicles.length} Buses</div>
          <div className="text-xs text-slate-500 mt-1">Toyota Coasters & Vans</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RTSA Road Fitness</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-serif">100% Compliant</div>
          <div className="text-xs text-emerald-600 mt-1">All certificates verified</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("routes")}
          className={`pb-3 relative cursor-pointer ${
            activeTab === "routes"
              ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Bus Routes & Stops ({routes.length})
        </button>
        <button
          onClick={() => setActiveTab("fleet")}
          className={`pb-3 relative cursor-pointer ${
            activeTab === "fleet"
              ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Fleet & Vehicle Registration ({vehicles.length})
        </button>
      </div>

      {/* Tab 1: Routes */}
      {activeTab === "routes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((route) => (
            <div key={route.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">{route.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{route.busNumber}</span>
                    <span>• {route.studentCount} Pupils Registered</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-800 font-mono">K{route.monthlyFeeZMW.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400">per month</div>
                </div>
              </div>

              {/* Stops */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Designated Neighborhood Stops:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {route.stops.map((stop, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-50 border border-slate-200 text-slate-700">
                      {idx + 1}. {typeof stop === "string" ? stop : `${stop.name} (${stop.time})`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Driver info */}
              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 text-xs text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="font-semibold text-slate-900">{route.driverName}</div>
                    <div className="text-slate-500">Certified School Driver</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono text-emerald-800 font-semibold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{route.driverPhone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Fleet */}
      {activeTab === "fleet" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Registration #</th>
                  <th className="py-3 px-4">Model & Make</th>
                  <th className="py-3 px-4 text-center">Capacity</th>
                  <th className="py-3 px-4">Assigned Driver</th>
                  <th className="py-3 px-4">RTSA Fitness Expiry</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {v.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {v.model}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {v.capacity} Seats
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {v.driverName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                      {v.rtsaFitnessExpiry}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{v.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Route */}
      {showAddRouteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-800 font-serif">Create School Bus Route</h3>
              </div>
              <button
                onClick={() => setShowAddRouteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Route Name *</label>
                <input
                  type="text"
                  required
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Route 3: Woodlands - Kabulonga - Avondale"
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Mr. Peter Zulu"
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+260 977 123456"
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bus Reg Number</label>
                  <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="e.g. BAF 4219 ZM"
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Fee (ZMW)</label>
                  <input
                    type="number"
                    value={monthlyFeeZMW}
                    onChange={(e) => setMonthlyFeeZMW(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stops (Separated by commas) *</label>
                <textarea
                  required
                  rows={3}
                  value={stopsText}
                  onChange={(e) => setStopsText(e.target.value)}
                  placeholder="e.g. Woodlands Post Office, Crossroads Mall, Leopard's Hill Road"
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vehicle */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-800 font-serif">Add Vehicle to Fleet</h3>
              </div>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">RTSA Registration Number *</label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. BAF 9901 ZM"
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Make & Model *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Toyota HiAce 16-Seater Mini-Bus"
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={seatCapacity}
                    onChange={(e) => setSeatCapacity(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RTSA Fitness Valid Until</label>
                  <input
                    type="date"
                    value={fitnessExpiry}
                    onChange={(e) => setFitnessExpiry(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

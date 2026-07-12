import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Pencil, Trash2, X } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { cabApi, CabResponseDto, CabDto } from '../../services/api';

const emptyForm: CabDto = {
  cabNumber: '',
  carModel: '',
  cabType: 'Economy',
  capacity: 4,
  available: true,
};

export default function AdminVehicles() {
  const [cabs, setCabs] = useState<CabResponseDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCab, setEditingCab] = useState<CabResponseDto | null>(null);
  const [form, setForm] = useState<CabDto>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchCabs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await cabApi.getAll();
      setCabs(res.data);
    } catch {
      setError('Failed to load vehicles. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabs();
  }, []);

  const openAddForm = () => {
    setEditingCab(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (cab: CabResponseDto) => {
    setEditingCab(cab);
    setForm({
      cabNumber: cab.cabNumber,
      carModel: cab.carModel,
      cabType: cab.cabType,
      capacity: cab.capacity,
      available: cab.available,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      if (editingCab) {
        const res = await cabApi.update(editingCab.cabId, form);
        setCabs((prev) => prev.map((c) => (c.cabId === editingCab.cabId ? res.data : c)));
      } else {
        const res = await cabApi.add(form);
        setCabs((prev) => [...prev, res.data]);
      }
      setShowForm(false);
    } catch (err: any) {
      const data = err.response?.data;
      if (typeof data === 'string') setFormError(data);
      else if (data?.errors) setFormError(Object.values(data.errors).join(', '));
      else setFormError(`Failed to ${editingCab ? 'update' : 'add'} vehicle.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete vehicle "${name}"?`)) return;
    setDeleting(id);
    try {
      await cabApi.delete(id);
      setCabs((prev) => prev.filter((c) => c.cabId !== id));
    } catch {
      alert('Failed to delete vehicle.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = cabs.filter(
    (c) =>
      c.cabNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.carModel.toLowerCase().includes(search.toLowerCase()) ||
      c.cabType.toLowerCase().includes(search.toLowerCase())
  );

  const available = cabs.filter((c) => c.available).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <Header />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vehicles / Cabs</h1>
              <p className="text-gray-600 mt-1">Manage your fleet of vehicles</p>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchCabs} disabled={loading} className="btn-secondary flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button onClick={openAddForm} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Vehicle
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Vehicles', value: cabs.length, color: 'bg-blue-100 text-primary' },
              { label: 'Available', value: available, color: 'bg-green-100 text-green-700' },
              { label: 'Unavailable', value: cabs.length - available, color: 'bg-red-100 text-red-700' },
              { label: 'Economy', value: cabs.filter(c => c.cabType === 'Economy').length, color: 'bg-yellow-100 text-yellow-700' },
            ].map((s, i) => (
              <div key={i} className="card-base p-4">
                <p className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingCab ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </h2>
                  <button
                    onClick={() => { setShowForm(false); setFormError(''); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cab Number</label>
                    <input
                      type="text"
                      value={form.cabNumber}
                      onChange={(e) => setForm({ ...form, cabNumber: e.target.value })}
                      placeholder="KA-01-AB-1234"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Car Model</label>
                    <input
                      type="text"
                      value={form.carModel}
                      onChange={(e) => setForm({ ...form, carModel: e.target.value })}
                      placeholder="Honda City"
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Cab Type</label>
                      <select
                        value={form.cabType}
                        onChange={(e) => setForm({ ...form, cabType: e.target.value })}
                        className="input-field"
                      >
                        <option>Economy</option>
                        <option>Premium</option>
                        <option>SUV</option>
                        <option>Luxury</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="available"
                      checked={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.checked })}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="available" className="text-sm font-medium text-gray-700">Available for booking</label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setFormError(''); }}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {editingCab ? 'Saving...' : 'Adding...'}
                        </span>
                      ) : (
                        editingCab ? 'Save Changes' : 'Add Vehicle'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="card-base p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by cab number, model or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="card-base overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading vehicles...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Cab ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Cab Number</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Model</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Capacity</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((cab) => (
                      <tr key={cab.cabId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">#{cab.cabId}</td>
                        <td className="px-6 py-4 text-gray-700 font-mono font-semibold">{cab.cabNumber}</td>
                        <td className="px-6 py-4 text-gray-700">{cab.carModel}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {cab.cabType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{cab.capacity} seats</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              cab.available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {cab.available ? '✓ Available' : '✗ Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => openEditForm(cab)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cab.cabId, cab.cabNumber)}
                              disabled={deleting === cab.cabId}
                              className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleting === cab.cabId ? (
                                <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🚗</div>
                    <p className="text-gray-500">No vehicles found. Add your first vehicle!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {filtered.length} of {cabs.length} vehicles
          </p>
        </div>
      </main>
    </div>
  );
}

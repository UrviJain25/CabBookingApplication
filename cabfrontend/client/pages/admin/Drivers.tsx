import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Pencil, Trash2, X } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { driverApi, DriverResponseDto, DriverDto } from '../../services/api';

const emptyForm: DriverDto = {
  driverName: '',
  licenceNo: '',
  mobileNumber: '',
  email: '',
};

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<DriverResponseDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverResponseDto | null>(null);
  const [form, setForm] = useState<DriverDto>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await driverApi.getAll();
      setDrivers(res.data);
    } catch {
      setError('Failed to load drivers. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAddForm = () => {
    setEditingDriver(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (driver: DriverResponseDto) => {
    setEditingDriver(driver);
    setForm({
      driverName: driver.driverName,
      licenceNo: driver.licenceNo,
      mobileNumber: driver.mobileNumber,
      email: driver.email,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      if (editingDriver) {
        const res = await driverApi.update(editingDriver.driverId, form);
        setDrivers((prev) =>
          prev.map((d) => (d.driverId === editingDriver.driverId ? res.data : d))
        );
      } else {
        const res = await driverApi.add(form);
        setDrivers((prev) => [...prev, res.data]);
      }
      setShowForm(false);
    } catch (err: any) {
      const data = err.response?.data;
      if (typeof data === 'string') setFormError(data);
      else if (data?.errors) setFormError(Object.values(data.errors).join(', '));
      else setFormError(`Failed to ${editingDriver ? 'update' : 'add'} driver.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete driver "${name}"?`)) return;
    setDeleting(id);
    try {
      await driverApi.delete(id);
      setDrivers((prev) => prev.filter((d) => d.driverId !== id));
    } catch {
      alert('Failed to delete driver.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = drivers.filter(
    (d) =>
      d.driverName.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.licenceNo.toLowerCase().includes(search.toLowerCase()) ||
      d.mobileNumber.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <Header />

      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
              <p className="text-gray-600 mt-1">Manage your driver fleet</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchDrivers}
                disabled={loading}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={openAddForm}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Driver
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Add / Edit Driver Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingDriver ? 'Edit Driver' : 'Add New Driver'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Driver Name</label>
                    <input
                      type="text"
                      value={form.driverName}
                      onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                      placeholder="Full name"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Licence No.</label>
                    <input
                      type="text"
                      value={form.licenceNo}
                      onChange={(e) => setForm({ ...form, licenceNo: e.target.value })}
                      placeholder="DL-XXXX-XXXX"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                    <input
                      type="tel"
                      value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                      placeholder="9876543210"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="driver@example.com"
                      className="input-field"
                      required
                    />
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
                          {editingDriver ? 'Saving...' : 'Adding...'}
                        </span>
                      ) : (
                        editingDriver ? 'Save Changes' : 'Add Driver'
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
                placeholder="Search by name, email, licence or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Drivers Table */}
          <div className="card-base overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading drivers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Driver</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Licence No.</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Mobile</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Cab</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((d) => (
                      <tr key={d.driverId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">#{d.driverId}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-sm">
                              {d.driverName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{d.driverName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-mono text-sm">{d.licenceNo}</td>
                        <td className="px-6 py-4 text-gray-700">{d.mobileNumber}</td>
                        <td className="px-6 py-4 text-gray-700">{d.email}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                            ⭐ {d.rating?.toFixed(1) || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {d.cabNumber ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                              {d.cabNumber}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => openEditForm(d)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(d.driverId, d.driverName)}
                              disabled={deleting === d.driverId}
                              className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleting === d.driverId ? (
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
                    <div className="text-4xl mb-3">👷</div>
                    <p className="text-gray-500">No drivers found. Add your first driver!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {filtered.length} of {drivers.length} drivers
          </p>
        </div>
      </main>
    </div>
  );
}

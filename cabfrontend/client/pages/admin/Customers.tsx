import { useState, useEffect } from 'react';
import { Search, Trash2, RefreshCw, User } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { customerApi, CustomerResponseDto } from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerResponseDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await customerApi.getAll();
      setCustomers(res.data);
    } catch {
      setError('Failed to load customers. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete customer "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await customerApi.delete(id);
      setCustomers((prev) => prev.filter((c) => c.customerId !== id));
    } catch {
      alert('Failed to delete customer.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
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
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">Manage your customer base</p>
            </div>
            <button
              onClick={fetchCustomers}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Search */}
          <div className="card-base p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, username or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-base p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card-base overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading customers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Username</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Address</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((c) => (
                      <tr key={c.customerId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">#{c.customerId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{c.email}</td>
                        <td className="px-6 py-4 text-gray-700 font-mono">{c.phone}</td>
                        <td className="px-6 py-4 text-gray-700">@{c.username}</td>
                        <td className="px-6 py-4 text-gray-700 text-sm max-w-[180px] truncate">{c.address}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(c.customerId, c.name)}
                            disabled={deleting === c.customerId}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            title="Delete customer"
                          >
                            {deleting === c.customerId ? (
                              <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No customers found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Showing {filtered.length} of {customers.length} customers
          </p>
        </div>
      </main>
    </div>
  );
}

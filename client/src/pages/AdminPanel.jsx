import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSortConfig, setUserSortConfig] = useState({ key: 'username', direction: 'asc' });
  const [listingSortConfig, setListingSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [modal, setModal] = useState({ open: false, type: '', id: null });
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [userRes, listingRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/listings', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setUsers(await userRes.json());
      setListings(await listingRes.json());
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (type, id) => setModal({ open: true, type, id });

  const handleDelete = async () => {
    const { type, id } = modal;
    try {
      await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success(`${type.slice(0, -1)} deleted successfully`);
      fetchData();
    } catch {
      toast.error(`Failed to delete ${type}`);
    } finally {
      setModal({ open: false, type: '', id: null });
    }
  };

  const sortData = (data, key, direction) =>
    [...data].sort((a, b) =>
      a[key] > b[key] ? (direction === 'asc' ? 1 : -1)
        : a[key] < b[key] ? (direction === 'asc' ? -1 : 1)
        : 0
    );

  const requestSort = (key, setConfig, currentConfig) => {
    const direction = currentConfig.key === key && currentConfig.direction === 'asc' ? 'desc' : 'asc';
    setConfig({ key, direction });
  };

  const getSortIcon = (config, key) =>
    config.key === key ? (config.direction === 'asc' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />) : null;

  const sortedUsers = sortData(users, userSortConfig.key, userSortConfig.direction);
  const sortedListings = sortData(listings, listingSortConfig.key, listingSortConfig.direction);

  if (loading) return <div className="text-center p-10 text-xl">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>

      {/* USERS SECTION */}
      <Section title="Users">
        <Table
          headers={[
            { key: 'username', label: 'Username', sortable: true, config: userSortConfig, setConfig: setUserSortConfig },
            { key: 'createdAt', label: 'Created', sortable: true, config: userSortConfig, setConfig: setUserSortConfig },
            { key: 'email', label: 'Email' },
            { key: 'action', label: 'Action' },
          ]}
          data={sortedUsers}
          renderRow={(user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => confirmDelete('users', user._id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          )}
        />
        <EntriesInfo count={sortedUsers.length} />
      </Section>

      {/* LISTINGS SECTION */}
      <Section title="Listings">
        <Table
          headers={[
            { key: 'name', label: 'Name', sortable: true, config: listingSortConfig, setConfig: setListingSortConfig },
            { key: 'action', label: 'Action' },
          ]}
          data={sortedListings}
          renderRow={(listing) => (
            <tr
              key={listing._id}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td
                className="py-2 px-4 border-b text-blue-600 hover:underline"
                onClick={() => navigate(`/listing/${listing._id}`)}
              >
                {listing.name}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete('listings', listing._id);
                  }}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          )}
        />
        <EntriesInfo count={sortedListings.length} />
      </Section>

      {/* CONFIRMATION MODAL */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setModal({ open: false, type: '', id: null })}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function Table({ headers, data, renderRow }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className={`py-2 px-4 border-b ${h.sortable ? 'cursor-pointer' : ''}`}
                  onClick={() => h.sortable && requestSort(h.key, h.setConfig, h.config)}
                >
                  {h.label} {h.sortable && getSortIcon(h.config, h.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map(renderRow)}</tbody>
        </table>
      </div>
    );
  }

  function Section({ title, children }) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {children}
      </section>
    );
  }

  function EntriesInfo({ count }) {
    return (
      <p className="text-sm text-gray-600 mt-2">
        Showing {count} {count === 1 ? 'entry' : 'entries'}
      </p>
    );
  }
}

import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const userRes = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listingRes = await fetch('/api/admin/listings', {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(await userRes.json());
    setListings(await listingRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchData();
  };

  const deleteListing = async (id) => {
    await fetch(`/api/admin/listings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    fetchData();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="grid gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <p className="font-medium">{u.username}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
              </div>
              <button
                onClick={() => deleteUser(u._id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Listings</h2>
        <div className="grid gap-4">
          {listings.map((l) => (
            <div
              key={l._id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition"
            >
              <p className="font-medium">{l.name}</p>
              <button
                onClick={() => deleteListing(l._id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, userApi } from "@/app/lib/api/admin/user";


const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await userApi.getAll();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await userApi.delete(id);
      if (res.error) {
        alert(res.error);
        return;
      }
      alert(res.message);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err: any) {
      alert("Failed to delete user: " + (err.message || "Unknown error"));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading users...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <Link
          href="/admin/dashboard/users/create"
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
        >
          + Create New User
        </Link>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto shadow rounded-lg bg-white border border-gray-200">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-gray-700 font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{user.fullName || user.username || "N/A"}</td>
                  <td className="px-6 py-4">{user.email || "N/A"}</td>
                  <td className="px-6 py-4 capitalize">{user.role || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.isActive
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/admin/dashboard/users/${user._id}/edit`}
                      className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
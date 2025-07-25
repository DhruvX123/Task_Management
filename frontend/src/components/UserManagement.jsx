import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import Loader from './utils/Loader';

const UserManagement = () => {
  const { user } = useSelector(state => state.authReducer);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [formErrors, setFormErrors] = useState({});
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', {
        headers: { Authorization: user.token },
      });
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password && !editUserId) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editUserId) {
        // Update user
        await api.put(`/users/${editUserId}`, formData, {
          headers: { Authorization: user.token },
        });
      } else {
        // Create user
        await api.post('/users', formData, {
          headers: { Authorization: user.token },
        });
      }
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = user => {
    setEditUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const handleDelete = async userId => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: user.token },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'admin') {
    return <p className="text-center mt-8">You do not have permission to view this page.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Role</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td className="border border-gray-300 p-2">{u.name}</td>
                  <td className="border border-gray-300 p-2">{u.email}</td>
                  <td className="border border-gray-300 p-2">{u.role}</td>
                  <td className="border border-gray-300 p-2 space-x-2">
                    <button
                      className="bg-yellow-400 px-2 py-1 rounded"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">{editUserId ? 'Edit User' : 'Add User'}</h3>
            <div className="mb-3">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {formErrors.name && <p className="text-red-600 text-sm">{formErrors.name}</p>}
            </div>
            <div className="mb-3">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {formErrors.email && <p className="text-red-600 text-sm">{formErrors.email}</p>}
            </div>
            {!editUserId && (
              <div className="mb-3">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
                {formErrors.password && <p className="text-red-600 text-sm">{formErrors.password}</p>}
              </div>
            )}
            <div className="mb-3">
              <label className="block mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              {editUserId ? 'Update User' : 'Add User'}
            </button>
            {editUserId && (
              <button
                type="button"
                className="ml-4 px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => {
                  setEditUserId(null);
                  setFormData({ name: '', email: '', password: '', role: 'user' });
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default UserManagement;

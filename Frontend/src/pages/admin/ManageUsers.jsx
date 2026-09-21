import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'
import { motion } from 'framer-motion'

const ManageUsers = () => {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (error) {
                setUsers([]);
            } finally {
                setLoading(false)
            }
        }; fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (!confirm('Delete this user permanently?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch {
            alert('Failed to delete user.');
        }
    };

    const toggleRole = async (id, current) => {
        const newRole = current === 'admin' ? 'user' : 'admin';
        try {
            const res = await api.put(`/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: res.data.user.role } : u));
        } catch {
            alert('Failed to update role.');
        }
    };

    return (
        <div className='min-h-screen bg-darkBase p-8'>
            <Link to="/admin/dashboard" className='flex items-center gap-1 font-serif text-brandRed text-sm hover:underline'>
                <ArrowLeft className='w-4 h-4' /> Back to Dashboard
            </Link>
            <h1 className="text-white text-3xl font-bold mt-4 mb-8 font-serif">Manage Users</h1>

            {loading ? (
                <div className="space-y-3">{Array(5).fill(null).map((_, i) => <div key={i} className="h-14 bg-darkSurface rounded animate-pulse" />)}</div>
            ) : users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <div className="bg-darkSurface border border-gray-800 rounded overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-800">
                            <tr>
                                {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-gray-400 px-4 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.12 }}
                                    viewport={{ once: true }}
                                    className="border-b border-gray-800/50">

                                    <td className="px-4 py-3 text-white">{user.name}</td>
                                    <td className="px-4 py-3 text-gray-400">{user.email}</td>
                                    <td className="px-4 py-3 text-gray-400">{user.phone}</td>
                                    <td className="px-4 py-3">
                                        <span className={`capitalize text-xs px-2 py-1 rounded ${user.role === 'admin' ? 'bg-brandRed/20 text-brandRed' : 'bg-gray-700 text-gray-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 flex gap-3">
                                        <button onClick={() => toggleRole(user._id, user.role)} className="text-blue-400 hover:underline text-xs">
                                            {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                        </button>
                                        <button onClick={() => deleteUser(user._id)} className="text-red-400 hover:underline text-xs">Delete</button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
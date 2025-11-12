'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/app/api/user.service';
import { User } from '@/types';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?')) {
      return;
    }

    try {
      await userService.promoteToAdmin(userId);
      await fetchUsers();
      alert('Utilisateur promu avec succès');
    } catch (err: any) {
      alert(err.response?.data || 'Erreur lors de la promotion');
    }
  };

  const handleDemote = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir rétrograder cet administrateur en vendeur ?')) {
      return;
    }

    try {
      await userService.demoteToSeller(userId);
      await fetchUsers();
      alert('Administrateur rétrogradé avec succès');
    } catch (err: any) {
      alert(err.response?.data || 'Erreur lors de la rétrogradation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Gestion des utilisateurs
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ville
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.firstname} {user.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.cityId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {user.role === 'SELLER' ? (
                    <button
                      onClick={() => handlePromote(user.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Promouvoir
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDemote(user.id)}
                      className="text-red-600 hover:text-red-900 mr-4"
                    >
                      Rétrograder
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
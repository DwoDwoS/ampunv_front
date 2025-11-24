'use client';

import { useEffect, useState } from 'react';
import { userApi } from '@/lib/api/users';
import { User } from '@/types';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId: number) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?"
      )
    ) {
      return;
    }

    try {
      await userApi.promoteToAdmin(userId);
      await fetchUsers();
      alert("Utilisateur promu avec succès");
    } catch (err: any) {
      alert(err.response?.data || "Erreur lors de la promotion");
    }
  };

  const handleDemote = async (userId: number) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir rétrograder cet administrateur en vendeur ?"
      )
    ) {
      return;
    }

    try {
      await userApi.demoteToSeller(userId);
      await fetchUsers();
      alert("Administrateur rétrogradé avec succès");
    } catch (err: any) {
      alert(err.response?.data || "Erreur lors de la rétrogradation");
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    try {
      await userApi.deleteUser(userId);
      await fetchUsers();
      alert("Utilisateur supprimé avec succès");
    } catch (err: any) {
      alert(err.response?.data || "Erreur lors de la suppression");
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
                      user.role === "ADMIN"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.cityId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    {!user.isOriginalAdmin &&
                      (user.role === "SELLER" ? (
                        <button
                          onClick={() => handlePromote(user.id)}
                          className="flex items-center gap-1.5 text-green-600 hover:text-green-900 transition-colors"
                          title="Promouvoir en administrateur"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                          Promouvoir
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDemote(user.id)}
                          className="flex items-center gap-1.5 text-orange-600 hover:text-orange-900 transition-colors"
                          title="Rétrograder en vendeur"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                          Rétrograder
                        </button>
                      ))}

                    {!user.isOriginalAdmin && (
                      <button
                        onClick={() =>
                          handleDelete(
                            user.id,
                            `${user.firstname} ${user.lastname}`
                          )
                        }
                        className="flex items-center gap-1.5 text-red-600 hover:text-red-900 transition-colors"
                        title="Supprimer l'utilisateur"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Supprimer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
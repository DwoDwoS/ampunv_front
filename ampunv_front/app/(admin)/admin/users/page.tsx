"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/lib/api/users";
import { User } from "@/types";

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

      <div className="space-y-4 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-900">
                {user.firstname} {user.lastname}
              </h2>

              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === "ADMIN"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">ID :</span> {user.id}
              </p>
              <p>
                <span className="font-semibold">Email :</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Ville :</span> {user.cityId}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {!user.isOriginalAdmin &&
                (user.role === "SELLER" ? (
                  <button
                    onClick={() => handlePromote(user.id)}
                    className="w-full text-green-600 hover:text-green-900 text-sm flex items-center gap-1.5"
                    aria-label={`Promouvoir l'utilisateur ${user.firstname} ${user.lastname} en administrateur`}
                  >
                    Promouvoir
                  </button>
                ) : (
                  <button
                    onClick={() => handleDemote(user.id)}
                    className="w-full text-orange-600 hover:text-orange-900 text-sm flex items-center gap-1.5"
                    aria-label={`Rétrograder l'administrateur ${user.firstname} ${user.lastname} en vendeur`}
                  >
                    Rétrograder
                  </button>
                ))}

              {!user.isOriginalAdmin && (
                <button
                  onClick={() =>
                    handleDelete(user.id, `${user.firstname} ${user.lastname}`)
                  }
                  className="w-full text-red-600 hover:text-red-900 text-sm flex items-center gap-1.5"
                  aria-label={`Supprimer l'utilisateur ${user.firstname} ${user.lastname}`}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden mt-6">
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
                          className="text-green-600 hover:text-green-900"
                        >
                          Promouvoir
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDemote(user.id)}
                          className="text-orange-600 hover:text-orange-900"
                        >
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
                        className="text-red-600 hover:text-red-900"
                      >
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
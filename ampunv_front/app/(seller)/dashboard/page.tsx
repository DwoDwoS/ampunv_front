'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { authApi } from '@/lib/api/auth';
import { furnitureApi } from '@/lib/api/furnitures';
import { Furniture } from '@/types';

export default function SellerDashboard() {
  const router = useRouter();
  const user = authApi.getUser();
  const [myFurnitures, setMyFurnitures] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejection, setSelectedRejection] = useState<Furniture | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    sold: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchMyFurnitures = async () => {
      try {
        const furnitures = await furnitureApi.getMyFurnitures();
        setMyFurnitures(furnitures);
        
        setStats({
          total: furnitures.length,
          available: furnitures.filter(f => f.status === 'APPROVED').length,
          pending: furnitures.filter(f => f.status === 'PENDING').length,
          sold: furnitures.filter(f => f.status === 'SOLD').length,
          rejected: furnitures.filter(f => f.status === 'REJECTED').length,
        });
      } catch (error) {
        console.error('Erreur lors du chargement de mes meubles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyFurnitures();
  }, []);

  const handleEditRejectedFurniture = (furnitureId: number) => {
    router.push(`/edit-furniture/${furnitureId}`);
  };

  return (
    <ProtectedRoute>
      <PublicNavbar />
      
      <main className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Bienvenue, {user?.firstname} !
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Gérez vos annonces de meubles
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="shrink-0 bg-blue-500 rounded-md p-2 sm:p-3 mb-2 sm:mb-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="sm:ml-5">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="shrink-0 bg-green-500 rounded-md p-2 sm:p-3 mb-2 sm:mb-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="sm:ml-5">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Disponibles</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.available}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="shrink-0 bg-yellow-500 rounded-md p-2 sm:p-3 mb-2 sm:mb-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="sm:ml-5">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">En attente</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="shrink-0 bg-purple-500 rounded-md p-2 sm:p-3 mb-2 sm:mb-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="sm:ml-5">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Vendus</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.sold}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="shrink-0 bg-red-500 rounded-md p-2 sm:p-3 mb-2 sm:mb-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="sm:ml-5">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Rejetés</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/create-furniture"
                className="flex items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition"
              >
                <div className="shrink-0">
                  <svg className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Créer une annonce</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Publiez un nouveau meuble à vendre</p>
                </div>
              </Link>

              <Link
                href="/my-furnitures"
                className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition"
              >
                <div className="shrink-0">
                  <svg className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Mes annonces</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Gérer toutes mes annonces</p>
                </div>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : myFurnitures.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Mes dernières annonces
                </h2>
                <Link
                  href="/my-furnitures"
                  className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                >
                  Voir tout →
                </Link>
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myFurnitures.slice(0, 5).map((furniture) => (
                      <tr key={furniture.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {furniture.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {furniture.price.toFixed(2)} €
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            furniture.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800' 
                              : furniture.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : furniture.status === 'SOLD'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {furniture.status === 'APPROVED' ? 'Disponible' : 
                             furniture.status === 'PENDING' ? 'En attente' : 
                             furniture.status === 'SOLD' ? 'Vendu' :
                             'Rejeté'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(furniture.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {furniture.status === 'REJECTED' && (
                            <button
                              onClick={() => setSelectedRejection(furniture)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Voir le motif
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden space-y-4">
                {myFurnitures.slice(0, 5).map((furniture) => (
                  <div key={furniture.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 flex-1">{furniture.title}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        furniture.status === 'APPROVED' 
                          ? 'bg-green-100 text-green-800' 
                          : furniture.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : furniture.status === 'SOLD'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {furniture.status === 'APPROVED' ? 'Disponible' : 
                         furniture.status === 'PENDING' ? 'En attente' : 
                         furniture.status === 'SOLD' ? 'Vendu' :
                         'Rejeté'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix:</span>
                        <span className="font-semibold text-gray-900">{furniture.price.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-gray-900">{new Date(furniture.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {furniture.status === 'REJECTED' && (
                      <button
                        onClick={() => setSelectedRejection(furniture)}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Voir le motif et modifier
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Aucune annonce pour le moment
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Commencez par créer votre première annonce de meuble !
              </p>
              <Link
                href="/create-furniture"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Créer ma première annonce
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedRejection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-start mb-4">
              <div className="shrink-0 bg-red-100 rounded-full p-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Annonce rejetée
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedRejection.title}
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-red-800 mb-1">
                Motif du rejet :
              </p>
              <p className="text-sm text-red-700">
                {selectedRejection.rejectionReason || "Aucun motif spécifié"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleEditRejectedFurniture(selectedRejection.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Modifier l'annonce
              </button>
              <button
                onClick={() => setSelectedRejection(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
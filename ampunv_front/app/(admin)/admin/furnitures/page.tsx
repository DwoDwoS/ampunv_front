'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/layout/Footer';
import FurnitureDetailModal from '@/components/FurnitureDetailModal';
import RejectModal from '@/components/RejectModal';
import { furnitureApi } from '@/lib/api/furnitures';
import { Furniture } from '@/types';

export default function AdminFurnituresPage() {
  const [furnitures, setFurnitures] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [furnitureToReject, setFurnitureToReject] = useState<Furniture | null>(
    null
  );
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "SOLD">(
    "PENDING"
  );

  useEffect(() => {
    fetchFurnitures();
  }, []);

  const fetchFurnitures = async () => {
    try {
      setLoading(true);
      const data = await furnitureApi.getAll();
      setFurnitures(data);
    } catch (error) {
      alert("Impossible de charger les meubles");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: number,
    newStatus: "APPROVED" | "PENDING" | "SOLD"
  ) => {
    try {
      await furnitureApi.update(id, { status: newStatus });
      alert(`Statut mis à jour avec succès !`);
      await fetchFurnitures();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du statut"
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce meuble ?")) {
      return;
    }

    try {
      await furnitureApi.delete(id);
      alert("Meuble supprimé avec succès !");
      await fetchFurnitures();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleViewDetails = (furniture: Furniture) => {
    setSelectedFurniture(furniture);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: number) => {
    try {
      await furnitureApi.approve(id);
      alert("Meuble approuvé avec succès !");
      await fetchFurnitures();
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors de l'approbation");
    }
  };

  const handleReject = async (id: number) => {
    const furniture = furnitures.find((f) => f.id === id);
    if (furniture) {
      setFurnitureToReject(furniture);
      setIsRejectModalOpen(true);
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (!furnitureToReject) return;

    try {
      await furnitureApi.reject(furnitureToReject.id, reason);
      alert(`Meuble rejeté avec succès. Raison : ${reason}`);
      await fetchFurnitures();
      setIsRejectModalOpen(false);
      setIsModalOpen(false);
      setFurnitureToReject(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors du rejet");
    }
  };

  const filteredFurnitures =
    filter === "ALL"
      ? furnitures
      : furnitures.filter((f) => f.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            Disponible
          </span>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            En attente
          </span>
        );
      case "SOLD":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            Vendu
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des meubles
            </h1>
            <p className="text-gray-600">
              {filteredFurnitures.length} meuble
              {filteredFurnitures.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous ({furnitures.length})
              </button>
              <button
                onClick={() => setFilter("PENDING")}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === "PENDING"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                En attente (
                {furnitures.filter((f) => f.status === "PENDING").length})
              </button>
              <button
                onClick={() => setFilter("APPROVED")}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === "APPROVED"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Disponibles (
                {furnitures.filter((f) => f.status === "APPROVED").length})
              </button>
              <button
                onClick={() => setFilter("SOLD")}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === "SOLD"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vendus ({furnitures.filter((f) => f.status === "SOLD").length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredFurnitures.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Aucun meuble dans cette catégorie</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFurnitures.map((furniture) => (
                      <tr key={furniture.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {furniture.primaryImageUrl ? (
                            <img
                              src={furniture.primaryImageUrl}
                              alt={furniture.title}
                              className="h-16 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                              <svg
                                className="h-8 w-8 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {furniture.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {furniture.cityName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {furniture.price.toFixed(2)} €
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {furniture.furnitureTypeName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {furniture.sellerName ||
                              `ID: ${furniture.sellerId}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(furniture.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleViewDetails(furniture)}
                              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                              title="Voir les détails"
                            >
                              👁 Détails
                            </button>
                            {furniture.status !== "APPROVED" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(furniture.id, "APPROVED")
                                }
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                title="Approuver"
                              >
                                ✓
                              </button>
                            )}
                            {furniture.status !== "PENDING" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(furniture.id, "PENDING")
                                }
                                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                                title="Mettre en attente"
                              >
                                ⏸ En attente
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(furniture.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                              title="Supprimer"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedFurniture && (
        <FurnitureDetailModal
          furniture={selectedFurniture}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <RejectModal
        isOpen={isRejectModalOpen}
        furnitureTitle={furnitureToReject?.title || ""}
        onClose={() => {
          setIsRejectModalOpen(false);
          setFurnitureToReject(null);
        }}
        onConfirm={handleConfirmReject}
      />
    </>
  );
}
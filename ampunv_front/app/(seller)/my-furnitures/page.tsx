"use client";

import { useEffect, useState } from "react";
import { Furniture } from "@/types";
import { furnitureApi } from "@/lib/api/furnitures";
import PublicNavbar from "@/components/layout/PublicNavbar";
import EditFurniturePage from "../edit-furniture/[id]/page";

export default function MyFurnituresPage() {
  const [furnitures, setFurnitures] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFurnitures = async () => {
      try {
        const data = await furnitureApi.getMyFurnitures();
        setFurnitures(data);
      } catch (error) {
        console.error("Erreur chargement meubles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFurnitures();
  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800 font-semibold",
        label: "En attente",
      },
      APPROVED: {
        bg: "bg-green-100",
        text: "text-green-800 font-semibold",
        label: "Approuvé",
      },
      REJECTED: { 
        bg: "bg-red-100", 
        text: "text-red-800 font-semibold", 
        label: "Rejeté" },
      SOLD: { 
        bg: "bg-gray-100", 
        text: "text-gray-800 font-semibold", 
        label: "Vendu" },
    };

    const badge = badges[status as keyof typeof badges] || badges.PENDING;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <PublicNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de vos meubles...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Mes meubles</h1>
            <p className="mt-2 text-gray-600">Gérez vos annonces de meubles</p>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {furnitures.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Aucun meuble
              </h3>
              <p className="mt-2 text-gray-500">
                Vous n'avez pas encore ajouté de meubles.
              </p>
              <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Ajouter un meuble">
                Ajouter un meuble
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {furnitures.map((furniture) => (
                <div
                  key={furniture.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg
                      className="h-16 w-16 text-gray-400"
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

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-lg font-semibold text-gray-900 flex-1">
                        {furniture.title}
                      </h2>
                      {getStatusBadge(furniture.status)}
                    </div>

                    <p className="text-2xl font-bold text-gray-900 mb-3">
                      {furniture.price} €
                    </p>

                    {furniture.status === "REJECTED" &&
                      furniture.rejectionReason && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start">
                            <svg
                              className="h-5 w-5 text-red-600 mt-0.5 mr-2 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <p className="text-sm font-semibold text-red-800">
                                Motif du rejet :
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                {furniture.rejectionReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {furniture.status === "PENDING" && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                          <svg
                            className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-sm text-yellow-800">
                            En attente de validation par un administrateur
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          <EditFurniturePage />
                        }
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        aria-label={`Modifier le meuble ${furniture.title}`}
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
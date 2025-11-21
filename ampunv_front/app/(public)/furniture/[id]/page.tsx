"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { furnitureApi } from "@/lib/api/furnitures";
import { imageApi } from "@/lib/api/images";
import { paymentApi } from "@/lib/api/payments";
import { authApi } from "@/lib/api/auth";
import { cartManager } from "@/lib/cart";
import { Furniture, Image } from "@/types";
import { addPrimaryImageUrl } from "@/lib/utils/furniture";

export default function FurnitureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const furnitureId = params.id as string;

  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [furnitureData, imagesData] = await Promise.all([
          furnitureApi.getById(Number(furnitureId)),
          imageApi.getImagesByFurniture(Number(furnitureId)),
        ]);
        setFurniture(furnitureData);
        setImages(imagesData);
        setIsInCart(cartManager.isInCart(Number(furnitureId)));
      } catch (err: any) {
        setError("Impossible de charger le meuble");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleCartUpdate = () => {
      setIsInCart(cartManager.isInCart(Number(furnitureId)));
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [furnitureId]);

  const handleBuyNow = async () => {
    const isAuthenticated = authApi.isAuthenticated();
    const user = authApi.getUser();
    let buyerEmail: string | null = null;

    if (!isAuthenticated) {
      buyerEmail = prompt("Entrez votre email pour recevoir la confirmation :");

      if (buyerEmail === null) {
        return;
      }

      if (!buyerEmail.trim() || !buyerEmail.includes("@")) {
        alert("Email invalide. Veuillez réessayer.");
        return;
      }
    } else {
      buyerEmail = user?.email || null;
    }

    try {
      console.log(
        "Création du paiement pour le meuble:",
        furnitureId,
        "Email:",
        buyerEmail
      );

      const response = await paymentApi.createPaymentIntent(
        Number(furnitureId),
        buyerEmail || undefined
      );

      console.log("Réponse de l'API:", response);

      const { clientSecret } = response;

      if (!clientSecret) {
        throw new Error("Client secret manquant dans la réponse");
      }

      router.push(
        `/payment?furniture_id=${furnitureId}&client_secret=${clientSecret}`
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création du paiement. Veuillez réessayer.";

      alert(`Erreur: ${errorMessage}`);
    }
  };

  const handleAddToCart = () => {
    if (!furniture) return;

    const furnitureWithImage = addPrimaryImageUrl({
      ...furniture,
      images: images,
    });

    const added = cartManager.addToCart(furnitureWithImage);
    if (added) {
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    } else {
      alert("Ce meuble est déjà dans votre panier");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !furniture) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Meuble introuvable"}</p>
          <button
            onClick={() => router.push("/catalog")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              {images.length > 0 ? (
                <div>
                  <img
                    src={images[currentImageIndex]?.url}
                    alt={images[currentImageIndex]?.altText || furniture.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {images.map((img, index) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                            index === currentImageIndex
                              ? "border-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Aucune image disponible</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {furniture.title}
              </h1>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  {furniture.price.toFixed(2)} €
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-semibold text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600">
                    {furniture.furnitureTypeName || "Non spécifié"}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">État:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      furniture.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : furniture.status === "SOLD"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {furniture.status === "APPROVED"
                      ? "Disponible"
                      : furniture.status === "SOLD"
                      ? "Vendu"
                      : "En attente"}
                  </span>
                </div>

                {furniture.description && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Description:
                    </span>
                    <p className="mt-2 text-gray-600">
                      {furniture.description}
                    </p>
                  </div>
                )}
              </div>

              {furniture.status === "APPROVED" && (
                <div className="space-y-3">
                  {showAddedMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Ajouté au panier !
                    </div>
                  )}

                  {!isInCart ? (
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Ajouter au panier
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/cart")}
                      className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center gap-2"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Déjà dans le panier
                    </button>
                  )}

                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Acheter maintenant
                  </button>
                </div>
              )}

              {furniture.status === "SOLD" && (
                <div className="w-full bg-gray-200 text-gray-600 py-3 px-6 rounded-lg text-center font-semibold">
                  Ce meuble a été vendu
                </div>
              )}

              {furniture.status === "PENDING" && (
                <div className="w-full bg-yellow-100 text-yellow-800 py-3 px-6 rounded-lg text-center font-semibold">
                  En attente de validation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
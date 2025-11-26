"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Furniture } from "@/types";
import Image from "next/image";
import { cartManager } from "@/lib/cart";
import { useState, useEffect } from "react";
import { addPrimaryImageUrl } from "@/lib/utils/furniture";

interface FurnitureCardProps {
  furniture: Furniture;
}

export default function FurnitureCard({ furniture }: FurnitureCardProps) {
  const router = useRouter();
  const primaryImage =
    furniture.images?.find((img) => img.isPrimary) || furniture.images?.[0];
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    setIsInCart(cartManager.isInCart(furniture.id));

    const handleCartUpdate = () => {
      setIsInCart(cartManager.isInCart(furniture.id));
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [furniture.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = cartManager.addToCart(addPrimaryImageUrl(furniture));
    if (!added) {
      alert("Ce meuble est déjà dans votre panier");
    }
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/cart");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/furniture/${furniture.id}`}>
        <div className="relative h-48 bg-gray-200">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={furniture.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
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
          )}
          <div className="absolute top-2 right-2">
            {furniture.status === "APPROVED" ? (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                Disponible
              </span>
            ) : furniture.status === "PENDING" ? (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                En attente
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                Vendu
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/furniture/${furniture.id}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {furniture.furnitureTypeName || "Meuble"}
            </span>
            <span className="text-xs text-gray-500">{furniture.condition}</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {furniture.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {furniture.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <p className="text-2xl font-bold text-blue-600">
              {furniture.price.toFixed(2)} €
            </p>
            {furniture.cityName && (
              <p className="text-xs text-gray-500">{furniture.cityName}</p>
            )}
          </div>
        </Link>

        {furniture.status === "APPROVED" &&
          (!isInCart ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              aria-label="Ajouter le meuble au panier"
            >
              <svg
                className="w-4 h-4"
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
              onClick={handleGoToCart}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              aria-label="Aller au panier"
            >
              <svg
                className="w-4 h-4"
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
              Dans le panier
            </button>
          ))}
      </div>
    </div>
  );
}
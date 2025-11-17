'use client';

import { useState, useEffect } from 'react';
import { Furniture, Image, ReferenceData } from '@/types';
import { imageApi } from '@/lib/api/images';

interface FurnitureDetailModalProps {
  furniture: Furniture;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  referenceData: ReferenceData;
}

export default function FurnitureDetailModal({
  furniture,
  isOpen,
  onClose,
  onApprove,
  onReject,
  referenceData,
}: FurnitureDetailModalProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const materialName =
    furniture.materialName ||
    referenceData.materials.find((m) => m.id === furniture.materialId)?.name ||
    'Non spécifié';

  const colorName =
    furniture.colorName ||
    referenceData.colors.find((c) => c.id === furniture.colorId)?.name ||
    'Non spécifié';

  const cityName =
    furniture.cityName ||
    referenceData.cities?.find((city) => city.id === furniture.cityId)?.name ||
    'Non spécifié';

  useEffect(() => {
    if (isOpen && furniture) {
      fetchImages();
    }
  }, [isOpen, furniture]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await imageApi.getImagesByFurniture(furniture.id);
      setImages(data);
      setCurrentImageIndex(0);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Détails du meuble
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <div className="relative bg-gray-200 rounded-lg overflow-hidden h-72 sm:h-96">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  </div>
                ) : images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex].url}
                      alt={images[currentImageIndex].altText || furniture.title}
                      className="w-full h-full object-contain"
                    />

                    {images[currentImageIndex].isPrimary && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                        Image principale
                      </div>
                    )}

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                        >
                          ←
                        </button>

                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                        >
                          →
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black bg-opacity-40 text-white px-3 py-1 rounded-full text-xs">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Aucune image</p>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? 'border-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 wrap-break-word">
                  {furniture.title}
                </h4>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {furniture.price.toFixed(2)} €
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">
                  Description
                </h5>
                <p className="text-black whitespace-pre-wrap">
                  {furniture.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">

                <div>
                  <p className="text-sm text-gray-900">Type</p>
                  <p className="font-medium text-gray-900">
                    {furniture.furnitureTypeName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-900">Matériau</p>
                  <p className="font-medium text-gray-900">{materialName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-900">Couleur</p>
                  <p className="font-medium text-gray-900">{colorName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-900">État</p>
                  <p className="font-medium text-gray-900">{furniture.condition}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-900">Ville</p>
                  <p className="font-medium text-gray-900">{cityName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-900">Vendeur</p>
                  <p className="font-medium text-gray-900">
                    {furniture.sellerName || `ID: ${furniture.sellerId}`}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-900">Statut actuel</p>
                <span
                  className={`inline-block px-3 py-1 mt-1 text-sm font-semibold rounded-full ${
                    furniture.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : furniture.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {furniture.status === 'APPROVED'
                    ? 'Disponible'
                    : furniture.status === 'PENDING'
                    ? 'En attente'
                    : 'Vendu'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Fermer
          </button>

          {furniture.status === 'PENDING' && (
            <>
              <button
                onClick={() => {
                  onReject(furniture.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Rejeter
              </button>

              <button
                onClick={() => {
                  onApprove(furniture.id);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approuver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
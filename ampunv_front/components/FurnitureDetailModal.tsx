'use client';

import { useState, useEffect } from 'react';
import { Furniture, Image } from '@/types';
import { imageApi } from '@/lib/api/images';

interface FurnitureDetailModalProps {
  furniture: Furniture;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function FurnitureDetailModal({
  furniture,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: FurnitureDetailModalProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
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
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Détails du meuble
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-white px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : images.length > 0 ? (
                    <>
                      <img
                        src={images[currentImageIndex].url}
                        alt={images[currentImageIndex].altText || furniture.title}
                        className="w-full h-full object-contain"
                      />
                      {images[currentImageIndex].isPrimary && (
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Image principale
                        </div>
                      )}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
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
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{furniture.title}</h4>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {furniture.price.toFixed(2)} €
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Description</h5>
                  <p className="text-gray-600 whitespace-pre-wrap">{furniture.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium text-gray-900">{furniture.furnitureTypeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Matériau</p>
                    <p className="font-medium text-gray-900">{furniture.materialName || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Couleur</p>
                    <p className="font-medium text-gray-900">{furniture.colorName || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">État</p>
                    <p className="font-medium text-gray-900">{furniture.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ville</p>
                    <p className="font-medium text-gray-900">{furniture.cityName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendeur</p>
                    <p className="font-medium text-gray-900">{furniture.sellerName || `ID: ${furniture.sellerId}`}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500">Statut actuel</p>
                  <span className={`inline-block px-3 py-1 mt-1 text-sm font-semibold rounded-full ${
                    furniture.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : furniture.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {furniture.status === 'AVAILABLE' ? 'Disponible' :
                     furniture.status === 'PENDING' ? 'En attente' : 'Vendu'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
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
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => {
                    onApprove(furniture.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Approuver
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
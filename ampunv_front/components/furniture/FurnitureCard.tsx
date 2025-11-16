import Link from 'next/link';
import { Furniture } from '@/types';
import Image from 'next/image';

interface FurnitureCardProps {
  furniture: Furniture;
}

export default function FurnitureCard({ furniture }: FurnitureCardProps) {
  const primaryImage = furniture.images?.find(img => img.isPrimary) || furniture.images?.[0];

  return (
    <Link href={`/furniture/${furniture.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
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
          </div>
          <div className="absolute top-2 right-2">
            {furniture.status === 'APPROVED' ? (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                Disponible
              </span>
            ) : furniture.status === 'PENDING' ? (
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

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {furniture.furnitureTypeName || "Meuble"}
            </span>
            <span className="text-xs text-gray-500">
              {furniture.condition}
            </span>
          </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {furniture.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {furniture.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {furniture.price.toFixed(2)} €
              </p>
              {furniture.cityName && (
                <p className="text-xs text-gray-500 mt-1">
                   {furniture.cityName}
                </p>
              )}
            </div>

            <div className="text-right">
              {furniture.furnitureTypeName && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-1">
                  {furniture.furnitureTypeName}
                </span>
              )}
              {furniture.condition && (
                <p className="text-xs text-gray-500">
                  État : {furniture.condition}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
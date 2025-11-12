import { Furniture } from '@/types';
import FurnitureCard from './FurnitureCard';

interface FurnitureGridProps {
  furnitures: Furniture[];
  emptyMessage?: string;
}

export default function FurnitureGrid({
  furnitures,
  emptyMessage = 'Aucun meuble disponible pour le moment.',
}: FurnitureGridProps) {
  if (furnitures.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-blue-200"
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
        <p className="mt-4 text-blue-200">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {furnitures.map((furniture) => (
        <FurnitureCard key={furniture.id} furniture={furniture} />
      ))}
    </div>
  );
}
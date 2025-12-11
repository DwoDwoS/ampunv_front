'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cartManager } from '@/lib/cart';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const furnitureId = searchParams.get('furniture_id');
  const paymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    if (paymentIntent && furnitureId) {
      cartManager.removeFromCart(Number(furnitureId));
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/catalog');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, paymentIntent, furnitureId]);

  if (!paymentIntent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">Une erreur est survenue lors du paiement.</p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h1>
        <p className="text-gray-600 mb-4">
          Votre achat a été confirmé. Le meuble a été marqué comme vendu et retiré de votre panier.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Redirection automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}...
        </p>

        <div className="space-y-3">
          {furnitureId && (
            <Link
              href={`/furniture/${furnitureId}`}
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir le meuble acheté
            </Link>
          )}
          <Link
            href="/catalog"
            className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Retourner maintenant au catalogue
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            💡 Le traitement du paiement est en cours. Le meuble apparaîtra comme vendu dans quelques instants.
          </p>
        </div>
      </div>
    </div>
  );
}
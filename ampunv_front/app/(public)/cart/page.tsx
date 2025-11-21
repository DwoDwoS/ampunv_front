'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cartManager, CartItem } from '@/lib/cart';
import { paymentApi } from '@/lib/api/payments';
import { authApi } from '@/lib/api/auth';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    setCartItems(cartManager.getCart());
    setLoading(false);
  };

  const handleRemove = (furnitureId: number) => {
    cartManager.removeFromCart(furnitureId);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const isAuthenticated = authApi.isAuthenticated();
    const user = authApi.getUser();
    let buyerEmail: string | null = null;

    if (!isAuthenticated) {
      buyerEmail = prompt('Entrez votre email pour recevoir la confirmation :');
      
      if (buyerEmail === null) {
        return;
      }
      
      if (!buyerEmail.trim() || !buyerEmail.includes('@')) {
        alert('Email invalide. Veuillez réessayer.');
        return;
      }
    } else {
      buyerEmail = user?.email || null;
    }

    setProcessingPayment(true);

    try {
      console.log('Création du paiement pour:', {
        nombreArticles: cartItems.length,
        email: buyerEmail,
        total: total
      });
      const response = await paymentApi.createPaymentIntent(
        cartItems[0].furniture.id,
        buyerEmail || undefined
      );
            
      const { clientSecret } = response;
      
      if (!clientSecret) {
        throw new Error('Client secret manquant dans la réponse');
      }

      if (cartItems.length === 1) {
        router.push(`/payment?furniture_id=${cartItems[0].furniture.id}&client_secret=${clientSecret}`);
      } else {
        const furnitureIds = cartItems.map(item => item.furniture.id).join(',');
        router.push(`/payment?furniture_ids=${furnitureIds}&client_secret=${clientSecret}`);
      }
    } catch (error: any) {
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message
        || 'Erreur lors de la création du paiement. Veuillez réessayer.';
      
      alert(`Erreur: ${errorMessage}`);
      setProcessingPayment(false);
    }
  };

  const total = cartManager.getTotal();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
            <p className="text-gray-600 mb-6">Ajoutez des meubles à votre panier pour commencer vos achats</p>
            <button
              onClick={() => router.push('/catalog')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Parcourir le catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {cartItems.map((item, index) => (
            <div
              key={item.furniture.id}
              className={`p-6 flex gap-6 ${
                index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {item.furniture.primaryImageUrl ? (
                  <img
                    src={item.furniture.primaryImageUrl}
                    alt={item.furniture.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.furniture.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.furniture.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {item.furniture.furnitureTypeName}
                  </span>
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                    {item.furniture.condition}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="text-2xl font-bold text-blue-600">
                  {item.furniture.price.toFixed(2)} €
                </p>
                <button
                  onClick={() => handleRemove(item.furniture.id)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-700">Sous-total</span>
              <span className="font-semibold text-gray-600 ">{total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-700">Frais de service</span>
              <span className="font-semibold text-gray-600">0.00 €</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processingPayment}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg mt-6"
            >
              {processingPayment ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Préparation...
                </span>
              ) : (
                'Procéder au paiement'
              )}
            </button>

            <button
              onClick={() => router.push('/catalog')}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
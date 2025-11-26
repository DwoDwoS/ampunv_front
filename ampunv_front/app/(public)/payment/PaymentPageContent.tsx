'use client';

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentApi } from "@/lib/api/payments";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({ furnitureId }: { furnitureId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?furniture_id=${furnitureId}`,
      },
    });

    if (error) {
      setMessage(error.message || "Une erreur est survenue");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Traitement en cours..." : "Payer maintenant"}
      </button>

      {message && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{message}</div>
      )}
    </form>
  );
}

export default function PaymentPageContent() {
  const searchParams = useSearchParams();
  const furnitureId = searchParams.get("furniture_id");
  const clientSecretParam = searchParams.get("client_secret");
  const [clientSecret, setClientSecret] = useState<string>(
    clientSecretParam || ""
  );
  const [loading, setLoading] = useState(!clientSecretParam);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientSecretParam) {
      setClientSecret(clientSecretParam);
      setLoading(false);
      return;
    }

    if (!furnitureId) {
      setError("ID du meuble manquant");
      setLoading(false);
      return;
    }

    paymentApi
      .createPaymentIntent(Number(furnitureId))
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || "Erreur lors de la création du paiement"
        );
        setLoading(false);
      });
  }, [furnitureId, clientSecretParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Préparation du paiement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-600 text-center">
          Paiement sécurisé
        </h1>

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm furnitureId={Number(furnitureId)} />
          </Elements>
        )}
      </div>
    </div>
  );
}
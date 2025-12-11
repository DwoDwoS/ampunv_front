import { Suspense } from 'react';
import PaymentSuccessContent from './content';

export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Chargement…</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
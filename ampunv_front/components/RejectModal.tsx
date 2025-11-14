'use client';

import { useState } from 'react';

interface RejectModalProps {
  isOpen: boolean;
  furnitureTitle: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function RejectModal({
  isOpen,
  furnitureTitle,
  onClose,
  onConfirm,
}: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    'Photos de mauvaise qualité',
    'Description insuffisante',
    'Prix non conforme au marché',
    'Produit non conforme aux conditions',
    'Informations manquantes',
    'Autre (préciser ci-dessous)',
  ];

  const handleSubmit = () => {
    const finalReason = reason === 'Autre (préciser ci-dessous)' ? customReason : reason;
    
    if (!finalReason.trim()) {
      alert('Veuillez sélectionner ou saisir une raison');
      return;
    }

    onConfirm(finalReason);
    setReason('');
    setCustomReason('');
  };

  const handleCancel = () => {
    setReason('');
    setCustomReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Rejeter le meuble</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Vous êtes sur le point de rejeter : <strong>{furnitureTitle}</strong>
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison du rejet *
            </label>
            <div className="space-y-2">
              {predefinedReasons.map((r) => (
                <label key={r} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {reason === 'Autre (préciser ci-dessous)' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Précisez la raison *
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Expliquez pourquoi ce meuble est rejeté..."
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Confirmer le rejet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

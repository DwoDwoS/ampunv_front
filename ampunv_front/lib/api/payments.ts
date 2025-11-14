import apiClient from './client';

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const paymentApi = {
  createPaymentIntent: async (furnitureId: number): Promise<PaymentIntentResponse> => {
    const response = await apiClient.post<PaymentIntentResponse>(
      `/api/payments/create-intent`,
      null,
      { params: { furnitureId } }
    );
    return response.data;
  },
};
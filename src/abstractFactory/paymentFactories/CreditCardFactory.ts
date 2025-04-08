// paymentFactories.ts
import { CreditCardForm } from '../paymentForms/CreditCardForm';
import { PaymentProcessorFactory, PaymentMethod, PaymentResult, PaymentDetails, PaymentFormComponent } from './interfaces';

// Factory para Tarjeta de Crédito
export class CreditCardFactory implements PaymentProcessorFactory {
  createPaymentMethod(config: any): PaymentMethod {
    return new CreditCardPayment(config);
  }

  createFormComponent(): PaymentFormComponent {
    return CreditCardForm;
  }

  getType(): string {
    return 'credit';
  }
}

class CreditCardPayment implements PaymentMethod {
  constructor(private cardDetails: any) {}

  async processPayment(amount: number): Promise<PaymentResult> {
    // Lógica real de procesamiento de tarjeta de crédito
    const payload = {
      monto:amount,
      metodo: 'credito',  
      ...this.cardDetails
    };
    
    const data = await processCreditCardPayment(payload);
    return {
      success: true,
      transactionId: `CC-${Math.random().toString(36).substring(2, 10)}`,
      message: 'Credit card payment processed successfully '+ data.data
    };
  }

  getPaymentDetails(): PaymentDetails {
    return {
      type: 'Credit Card',
      fees: 0.03, // 3% fee
      currency: 'USD'
    };
  }
}

const processCreditCardPayment = async (payload: any) => {
  const response = await fetch('https://localhost:8080/api/pagos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(await response.text());
  }
  
  return response.json();
};
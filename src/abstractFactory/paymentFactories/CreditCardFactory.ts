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

import axios from 'axios';

class CreditCardPayment implements PaymentMethod {
  constructor(private creditCardData: { cardNumber: string; cvv: string; expiry: string }) {}

  async processPayment(amount: number): Promise<PaymentResult> {
    try {
      const response = await axios.post('https://localhost:8080/api/pagos', {
        monto: amount,
        metodo: 'creditcard',
        ...this.creditCardData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        transactionId: `CC-${Math.random().toString(36).substring(2, 10)}`,
        message: 'Credit card payment successful 💳✨ ' + response.data
      };
    } catch (error) {
      let errorMessage = 'Credit card payment failed 💔';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                       error.message || 
                       'Error processing credit card payment';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  getPaymentDetails(): PaymentDetails {
    return {
      type: 'Credit Card',
      fees: 0.03, // Puedes ajustar la tarifa 💸
      currency: 'USD'
    };
  }
}

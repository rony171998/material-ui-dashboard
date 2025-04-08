// paymentFactories.ts
import axios from 'axios';
import { PayPalForm } from '../paymentForms/PayPalForm';
import { PaymentProcessorFactory, PaymentMethod, PaymentResult, PaymentDetails, PaymentFormComponent } from './interfaces';

// Factory para PayPal
export class PayPalFactory implements PaymentProcessorFactory {
  createPaymentMethod(config: any): PaymentMethod {
    return new PayPalPayment(config);
  }

  createFormComponent(): PaymentFormComponent {
    return PayPalForm;
  }

  getType(): string {
    return 'paypal';
  }
}

class PayPalPayment implements PaymentMethod {
  constructor(private paypalData: { email: string }) {}

  async processPayment(amount: number): Promise<PaymentResult> {
    try {
      const response = await axios.post('https://localhost:8080/api/pagos', {
        monto: amount,
        metodo: 'paypal',
        email: this.paypalData.email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Axios ya parsea la respuesta JSON automáticamente
      // y encapsula los errores HTTP (status != 2xx)
      return {
        success: true,
        transactionId: `PP-${Math.random().toString(36).substring(2, 10)}`,
        message: 'PayPal payment successful ' + response.data
      };
    } catch (error) {
      // Manejo de errores con Axios
      let errorMessage = 'PayPal payment failed';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Error processing PayPal payment';
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
      type: 'PayPal',
      fees: 0.02,
      currency: 'USD'
    };
  }
}
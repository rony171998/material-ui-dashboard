// paymentFactories.ts
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

// paymentFactories.ts
class PayPalPayment implements PaymentMethod {
  constructor(private paypalData: { email: string }) {}

  async processPayment(amount: number): Promise<PaymentResult> {
    try {
      const response = await fetch('https://localhost:8080/api/pagos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          monto:amount,
          metodo: 'paypal', 
          email: this.paypalData.email
        })
      });

      if (!response.ok) {
        throw new Error('PayPal payment failed');
      }

      const data = await response.json();

      return {
        success: true,
        transactionId: `PP-${Math.random().toString(36).substring(2, 10)}`,
        message: 'PayPal payment successful '+data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'PayPal payment failed'
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
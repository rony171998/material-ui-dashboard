// paymentFactories.ts
import { BankTransferForm } from '../paymentForms/BankTransferForm';
import { PaymentProcessorFactory, PaymentMethod, PaymentResult, PaymentDetails, PaymentFormComponent } from './interfaces';

// Factory para Transferencia Bancaria
export class BankTransferFactory implements PaymentProcessorFactory {
  createPaymentMethod(config: any): PaymentMethod {
    return new BankTransferPayment(config);
  }

  createFormComponent(): PaymentFormComponent {
    return BankTransferForm;
  }

  getType(): string {
    return 'bank';
  }
}

import axios from 'axios';

class BankTransferPayment implements PaymentMethod {
  constructor(private bankDetails: any) {}

  async processPayment(amount: number): Promise<PaymentResult> {
    const payload = {
      monto: amount,
      metodo: 'transferencia',
      ...this.bankDetails
    };

    try {
      const response = await axios.post('https://localhost:8080/api/pagos', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        transactionId: `BT-${Math.random().toString(36).substring(2, 10)}`,
        message: 'Bank transfer initiated successfully 🏦✨ ' + response.data
      };
    } catch (error) {
      let errorMessage = 'Bank transfer failed 😢';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message ||
                       error.message ||
                       'Error processing bank transfer';
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
      type: 'Bank Transfer',
      fees: 0.01, // 1% fee 💸
      currency: 'USD'
    };
  }
}

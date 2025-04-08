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

class BankTransferPayment implements PaymentMethod {
  constructor(private bankDetails: any) {}

  async processPayment(amount: number): Promise<PaymentResult> {
    // Lógica real de transferencia bancaria
    const payload = {
      monto:amount,
      metodo: 'transferencia',  
      ...this.bankDetails
    };
    
    const data = await processCreditCardPayment(payload);

    return {
      success: true,
      transactionId: `BT-${Math.random().toString(36).substring(2, 10)}`,
      message: 'Bank transfer initiated successfully'+ data.data
    };
  }

  getPaymentDetails(): PaymentDetails {
    return {
      type: 'Bank Transfer',
      fees: 0.01, // 1% fee
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
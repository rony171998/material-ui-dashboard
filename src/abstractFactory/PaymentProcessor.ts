// PaymentProcessor.ts
import { PaymentProcessorFactory, PaymentMethod } from './interfaces';

export class PaymentProcessor {
  private factory: PaymentProcessorFactory;
  private paymentMethod?: PaymentMethod;

  constructor(factory: PaymentProcessorFactory) {
    this.factory = factory;
  }

  initializePaymentMethod(config: any) {
    this.paymentMethod = this.factory.createPaymentMethod(config);
  }

  async processOrder(total: number, products: any[]): Promise<any> {
    if (!this.paymentMethod) {
      throw new Error('Payment method not initialized');
    }
    
    const paymentResult = await this.paymentMethod.processPayment(total);
    
    if (paymentResult.success) {
      return {
        success: true,
        transactionId: paymentResult.transactionId,
        message: paymentResult.message,
        paymentDetails: this.paymentMethod.getPaymentDetails(),
        products
      };
    }
    throw new Error(paymentResult.message);
  }

  getFormComponent(): React.FC<any> {
    return this.factory.createFormComponent();
  }
}
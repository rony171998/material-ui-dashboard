// interfaces.ts
export interface PaymentMethod {
  processPayment(amount: number): Promise<PaymentResult>;
  getPaymentDetails(): PaymentDetails;
}

export interface PaymentFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export interface PaymentFormComponent extends React.FC<PaymentFormProps> {
  validate?: () => boolean;
}

export interface NotificacionFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export interface NotificacionFormComponent extends React.FC<NotificacionFormProps> {
  validate?: () => boolean;
}

export interface PaymentProcessorFactory {
  createPaymentMethod(config: any): PaymentMethod;
  createFormComponent(): PaymentFormComponent;
  getType(): string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface PaymentDetails {
  type: string;
  fees: number;
  currency: string;
}
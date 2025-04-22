// interfaces.ts
export interface NotificationMethod {
  processNotification(): Promise<NotificationResult>;
  getNotificationDetails(): NotificationDetails;
}

export interface NotificacionFormProps {
  onChange: (data: any) => void;
  onSubmit?: () => void;
}

export interface NotificacionFormComponent extends React.FC<NotificacionFormProps> {
  validate?: () => boolean;
}

export interface NotificationProcessorFactory {
  createNotificationMethod(config: any): NotificationMethod;
  createFormComponent(): NotificacionFormComponent;
  getType(): string;
}

export interface NotificationResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export interface NotificationDetails {
  type: string;
  fees: number;
  currency: string;
}
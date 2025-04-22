// NotificationProcessor.ts
import { NotificationProcessorFactory, NotificationMethod } from './interfacesNotification';

export class NotificationProcessor {
  private factory: NotificationProcessorFactory;
  private notificationMethod?: NotificationMethod;

  constructor(factory: NotificationProcessorFactory) {
    this.factory = factory;
  }

  initializeNotificationMethod(config: any) {
    this.notificationMethod = this.factory.createNotificationMethod(config);
  }

  async processOrder(): Promise<any> {
    if (!this.notificationMethod) {
      throw new Error('Notification method not initialized');
    }
    
    const notificationResult = await this.notificationMethod.processNotification();
    
    if (notificationResult.success) {
      return {
        success: true,
        transactionId: notificationResult.transactionId,
        message: notificationResult.message,
        notificationDetails: this.notificationMethod.getNotificationDetails(),
      };
    }
    throw new Error(notificationResult.message);
  }

  getFormComponent(): React.FC<any> {
    return this.factory.createFormComponent();
  }
}
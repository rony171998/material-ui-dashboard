// notificationFactories.ts
import axios from 'axios';
import { NotificationProcessorFactory, NotificationMethod, NotificationResult, NotificationDetails, NotificationFormComponent } from './interfaces';
import { PushForm } from '../notificationForm/PushForm';

// Factory para Push
export class PushFactory implements NotificationProcessorFactory {
  createNotificationMethod(config: any): NotificationMethod {
    return new PushNotification(config);
  }

  createFormComponent(): NotificationFormComponent {
    return PushForm;
  }

  getType(): string {
    return 'push';
  }
}

class PushNotification implements NotificationMethod {
  constructor(private pushData: { push: string }) {}

  async processNotification(amount: number): Promise<NotificationResult> {
    try {
      const response = await axios.post(`http://localhost:8080/api/notificacion/push`, {
        ...this.pushData
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
        message: 'Push notification successful ' + response.data
      };
    } catch (error) {
      // Manejo de errores con Axios
      let errorMessage = 'Push notification failed';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Error processing Push notification';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  getNotificationDetails(): NotificationDetails {
    return {
      type: 'Push',
      fees: 0.02,
      currency: 'USD'
    };
  }
}
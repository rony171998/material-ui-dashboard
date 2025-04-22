// notificationFactories.ts
import axios from 'axios';
import { NotificationProcessorFactory, NotificationMethod, NotificationResult, NotificationDetails, NotificationFormComponent } from './interfaces';
import { SmsForm } from '../notificationForm/SmsForm';

// Factory para Sms
export class SmsFactory implements NotificationProcessorFactory {
  createNotificationMethod(config: any): NotificationMethod {
    return new SmsNotification(config);
  }

  createFormComponent(): NotificationFormComponent {
    return SmsForm;
  }

  getType(): string {
    return 'sms';
  }
}

class SmsNotification implements NotificationMethod {
  constructor(private smsData: { email: string }) {}

  async processNotification(amount: number): Promise<NotificationResult> {
    try {
      const response = await axios.post(`http://localhost:8080/api/notificacion/sms`, {
        ...this.smsData
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
        message: 'Sms notification successful ' + response.data
      };
    } catch (error) {
      // Manejo de errores con Axios
      let errorMessage = 'Sms notification failed';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Error processing Sms notification';
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
      type: 'Sms',
      fees: 0.02,
      currency: 'USD'
    };
  }
}
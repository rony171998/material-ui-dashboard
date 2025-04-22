// notificationFactories.ts
import axios from 'axios';
import { NotificationProcessorFactory, NotificationMethod, NotificationResult, NotificationDetails, NotificationFormComponent } from './interfaces';
import { EmailForm } from '../notificationForm/EmailForm';

// Factory para Email
export class EmailFactory implements NotificationProcessorFactory {
  createNotificationMethod(config: any): NotificationMethod {
    return new EmailNotification(config);
  }

  createFormComponent(): NotificationFormComponent {
    return EmailForm;
  }

  getType(): string {
    return 'email';
  }
}

class EmailNotification implements NotificationMethod {
  constructor(private emailData: { email: string }) {}

  async processNotification(amount: number): Promise<NotificationResult> {
    try {
      const response = await axios.post(`http://localhost:8080/api/notificacion/email`, {
        ...this.emailData
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
        message: 'Email notification successful ' + response.data
      };
    } catch (error) {
      // Manejo de errores con Axios
      let errorMessage = 'Email notification failed';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Error processing Email notification';
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
      type: 'Email',
      fees: 0.02,
      currency: 'USD'
    };
  }
}
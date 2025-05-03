import { PaymentDetails } from "../abstractFactory/interfaces";
import { NotificationDetails } from "../abstractFactory/interfacesNotification";

// 1. Interfaz de Prototype
interface CheckoutPrototype {
    clone(): CheckoutPrototype;
  }
  
  // 2. Clase concreta de Checkout
  export class CheckoutSession implements CheckoutPrototype {
    paymentMethod: string;
    notificationMethod: string;
    selectedProducts: any[];
    paymentDetails: {};
    notificationDetails: {};
  
    constructor(
      paymentMethod: string,
      notificationMethod: string,
      selectedProducts: any[] = [],
      paymentDetails: PaymentDetails,
      notificationDetails: NotificationDetails,

    ) {
      this.paymentMethod = paymentMethod;
      this.notificationMethod = notificationMethod;
      this.selectedProducts = selectedProducts;
      this.paymentDetails = paymentDetails;
      this.notificationDetails = notificationDetails;
    }
  
    clone(): CheckoutSession {
      // Validación de datos antes de clonar
      if (!this.paymentMethod || !this.notificationMethod) {
        throw new Error("Cannot clone incomplete checkout session");
      }
    
      return new CheckoutSession(
        this.paymentMethod,
        this.notificationMethod,
        [...this.selectedProducts],
        structuredClone(this.paymentDetails), // Clonación profunda moderna
        structuredClone(this.notificationDetails) // Clonación profunda moderna
      );
    }
  }
  
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
      paymentDetails = {},
      notificationDetails= {},  

    ) {
      this.paymentMethod = paymentMethod;
      this.notificationMethod = notificationMethod;
      this.selectedProducts = selectedProducts;
      this.paymentDetails = paymentDetails;
      this.notificationDetails = notificationDetails;
    }
  
    clone(): CheckoutSession {
      // Hacemos una clonación profunda
      return new CheckoutSession(
        this.paymentMethod,
        this.notificationMethod,
        [...this.selectedProducts],
        this.paymentDetails,
        this.notificationDetails
      );
    }
  }
  
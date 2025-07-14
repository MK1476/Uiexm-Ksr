export interface WhatsAppConfig {
  phoneNumber: string;
  message: string;
}

export const generateWhatsAppLink = (config: WhatsAppConfig): string => {
  const { phoneNumber, message } = config;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const generateProductEnquiryLink = (productName: string, productPrice?: string): string => {
  const phoneNumber = "+919704100544";
  const baseMessage = `Hello KSR Agros, I am interested in your ${productName}`;
  const priceMessage = productPrice ? ` (Price: ${productPrice})` : "";
  const message = `${baseMessage}${priceMessage}. Please provide more details.`;
  
  return generateWhatsAppLink({
    phoneNumber,
    message,
  });
};

export const generateContactEnquiryLink = (): string => {
  const phoneNumber = "+919704100544";
  const message = "Hello KSR Agros, I would like to inquire about your products and services.";
  
  return generateWhatsAppLink({
    phoneNumber,
    message,
  });
};

export const openWhatsApp = (link: string): void => {
  window.open(link, "_blank");
};

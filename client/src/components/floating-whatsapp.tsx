import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateContactEnquiryLink, openWhatsApp } from "@/lib/whatsapp";

const FloatingWhatsApp = () => {
  const handleClick = () => {
    const link = generateContactEnquiryLink();
    openWhatsApp(link);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Contact us on WhatsApp</span>
      </Button>
    </div>
  );
};

export default FloatingWhatsApp;

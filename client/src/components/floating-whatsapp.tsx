import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateContactEnquiryLink, openWhatsApp } from "@/lib/whatsapp";
import { useLanguage } from "@/contexts/language-context";

const FloatingWhatsApp = () => {
  const { t } = useLanguage();
  
  const handleClick = () => {
    const link = generateContactEnquiryLink();
    openWhatsApp(link);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4 shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">{t("contactUs")}</span>
      </Button>
    </div>
  );
};

export default FloatingWhatsApp;

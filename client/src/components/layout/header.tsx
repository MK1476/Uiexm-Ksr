import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Tractor, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/language-context";

const Header = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("categories"), href: "/categories" },
    { name: t("products"), href: "/products" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <header className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 shadow-xl sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
              <Tractor className="h-10 w-10 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">KSR Agros</span>
              <span className="text-sm text-green-100 -mt-1">Agricultural Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-white/20 text-white shadow-md"
                      : "text-green-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="ml-4 text-green-100 hover:bg-white/10 hover:text-white"
            >
              <Languages className="h-4 w-4 mr-2" />
              {language === 'en' ? 'తెలుగు' : 'English'}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-green-600 to-green-700">
              <div className="flex flex-col space-y-2 mt-8">
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-green-500">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Tractor className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white">KSR Agros</span>
                    <p className="text-sm text-green-100">Agricultural Solutions</p>
                  </div>
                </div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-lg font-medium transition-all duration-300 p-3 rounded-lg ${
                      isActive(item.href)
                        ? "bg-white/20 text-white shadow-md"
                        : "text-green-100 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Language Toggle */}
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="text-green-100 hover:bg-white/10 hover:text-white justify-start p-3 rounded-lg"
                >
                  <Languages className="h-5 w-5 mr-3" />
                  {language === 'en' ? 'తెలుగు' : 'English'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

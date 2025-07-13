import { Link } from "wouter";
import { Tractor, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Settings } from "lucide-react";

const Footer = () => {
  return (
    <footer className="premium-gradient text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Tractor className="h-8 w-8" />
              <span className="text-xl font-bold">KSR Agros</span>
            </div>
            <p className="text-green-100 mb-4 leading-relaxed">
              Your trusted partner in agricultural equipment and machinery. 
              Empowering farmers with quality solutions since 2003.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 hover:text-white transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-100 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-green-100 hover:text-white transition-colors duration-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-green-100 hover:text-white transition-colors duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-green-100 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-100 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/tractors" className="text-green-100 hover:text-white transition-colors duration-300">
                  Tractors
                </Link>
              </li>
              <li>
                <Link href="/categories/harvesters" className="text-green-100 hover:text-white transition-colors duration-300">
                  Harvesters
                </Link>
              </li>
              <li>
                <Link href="/categories/plowing-equipment" className="text-green-100 hover:text-white transition-colors duration-300">
                  Plowing Equipment
                </Link>
              </li>
              <li>
                <Link href="/categories/irrigation-systems" className="text-green-100 hover:text-white transition-colors duration-300">
                  Irrigation Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2">
              <p className="text-green-100 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-300" />
                123 Agriculture Lane, Farming District
              </p>
              <p className="text-green-100 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-300" />
                +91 98765 43210
              </p>
              <p className="text-green-100 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-300" />
                info@ksragros.com
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-200 text-sm mb-4 md:mb-0">
            © 2024 KSR Agros. All rights reserved.
          </p>
          <div className="flex space-x-6 items-center">
            <Link href="#" className="text-green-200 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-green-200 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-green-200 hover:text-white transition-colors text-sm">
              Cookie Policy
            </Link>
            <Link href="/admin" className="text-green-300 hover:text-white transition-colors text-xs opacity-60 hover:opacity-100">
              <Settings className="h-3 w-3 inline-block mr-1" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

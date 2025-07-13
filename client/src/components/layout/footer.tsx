import { Link } from "wouter";
import { Tractor, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Tractor className="h-8 w-8" />
              <span className="text-xl font-bold">KSR Agros</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner in agricultural equipment and machinery. 
              Empowering farmers with quality solutions since 2003.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
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
                <Link href="/categories/tractors" className="text-gray-300 hover:text-white transition-colors">
                  Tractors
                </Link>
              </li>
              <li>
                <Link href="/categories/harvesters" className="text-gray-300 hover:text-white transition-colors">
                  Harvesters
                </Link>
              </li>
              <li>
                <Link href="/categories/plowing-equipment" className="text-gray-300 hover:text-white transition-colors">
                  Plowing Equipment
                </Link>
              </li>
              <li>
                <Link href="/categories/irrigation-systems" className="text-gray-300 hover:text-white transition-colors">
                  Irrigation Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2">
              <p className="text-gray-300 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                123 Agriculture Lane, Farming District
              </p>
              <p className="text-gray-300 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +91 98765 43210
              </p>
              <p className="text-gray-300 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@ksragros.com
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 KSR Agros. All rights reserved. |{" "}
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

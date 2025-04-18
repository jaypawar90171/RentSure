import { Link } from "react-router-dom"
import { FileText, Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-rentsure-900 to-rentsure-800 rounded-xl p-6 md:p-8 mb-12 transform transition-all duration-500 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-rentsure-100">Get the latest news and updates from RentSure</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rentsure-400 transition-all duration-300"
                />
                <button className="bg-white text-rentsure-800 px-4 py-2 rounded-md font-medium hover:bg-rentsure-100 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link
              to="/"
              className="flex items-center space-x-2 mb-6 transform transition-all duration-300 hover:translate-x-1"
            >
              <FileText className="h-6 w-6 text-rentsure-400" />
              <span className="font-bold text-xl text-white">RentSure</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Revolutionizing rental agreements with blockchain technology for transparent, secure, and efficient
              property management.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="h-5 w-5" />, color: "hover:text-blue-400" },
                { icon: <Twitter className="h-5 w-5" />, color: "hover:text-blue-400" },
                { icon: <Instagram className="h-5 w-5" />, color: "hover:text-pink-400" },
                { icon: <Linkedin className="h-5 w-5" />, color: "hover:text-blue-500" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@rentsure.com</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Blockchain Ave, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {[
            {
              title: "Platform",
              links: [
                { name: "For Landlords", path: "/landlord" },
                { name: "For Tenants", path: "/tenant" },
                { name: "Smart Contracts", path: "/contracts" },
                { name: "How It Works", path: "/" },
              ],
            },
            {
              title: "Resources",
              links: [
                { name: "Help Center", path: "#" },
                { name: "Blog", path: "#" },
                { name: "FAQs", path: "#" },
                { name: "Contact Support", path: "#" },
              ],
            },
            {
              title: "Company",
              links: [
                { name: "About Us", path: "#" },
                { name: "Careers", path: "#" },
                { name: "Legal", path: "#" },
                { name: "Privacy Policy", path: "#" },
              ],
            },
          ].map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="font-semibold text-lg mb-4 relative inline-block">
                {section.title}
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-rentsure-500 rounded-full"></span>
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="transform transition-all duration-300 hover:translate-x-1">
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-2 text-rentsure-500">›</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p className="hover:text-white transition-colors duration-300">
            © {new Date().getFullYear()} RentSure. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

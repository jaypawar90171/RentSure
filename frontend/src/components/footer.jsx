import { Link } from "react-router-dom"
import { FileText, Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Abstract shapes in background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 blur-3xl"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 md:p-10 mb-16 shadow-xl transform transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="mb-8 md:mb-0 md:max-w-md">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay Updated</h3>
              <p className="text-indigo-200 text-lg">
                Get the latest news and updates from RentSure delivered to your inbox
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder:text-indigo-200 border border-indigo-400/30 min-w-[250px]"
                />
                <button className="bg-white text-indigo-900 px-5 py-3 rounded-xl font-medium hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group">
                  Subscribe
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="col-span-1 lg:col-span-1">
            <Link
              to="/"
              className="flex items-center space-x-2 mb-6 transform transition-all duration-300 hover:translate-x-1"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                RentSure
              </span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Revolutionizing rental agreements with blockchain technology for transparent, secure, and efficient
              property management.
            </p>
            <div className="flex space-x-4 mb-8">
              {[
                { icon: <Facebook className="h-5 w-5" />, color: "hover:text-blue-400", bg: "hover:bg-blue-400/10" },
                { icon: <Twitter className="h-5 w-5" />, color: "hover:text-blue-400", bg: "hover:bg-blue-400/10" },
                { icon: <Instagram className="h-5 w-5" />, color: "hover:text-pink-400", bg: "hover:bg-pink-400/10" },
                { icon: <Linkedin className="h-5 w-5" />, color: "hover:text-blue-500", bg: "hover:bg-blue-500/10" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-gray-400 ${social.color} ${social.bg} transition-all duration-300 transform hover:scale-110 p-2 rounded-full`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-400 hover:text-indigo-300 transition-colors duration-300 group">
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-indigo-900/30 mr-3 transition-colors duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <span>contact@rentsure.com</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-indigo-300 transition-colors duration-300 group">
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-indigo-900/30 mr-3 transition-colors duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-indigo-300 transition-colors duration-300 group">
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-indigo-900/30 mr-3 transition-colors duration-300">
                  <MapPin className="h-4 w-4" />
                </div>
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
              <h3 className="font-semibold text-lg mb-5 relative inline-block">
                {section.title}
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="transform transition-all duration-300 hover:translate-x-1">
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="text-indigo-500 mr-2">›</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p className="hover:text-indigo-300 transition-colors duration-300 mb-4 md:mb-0">
            © {new Date().getFullYear()} RentSure. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="hover:text-indigo-300 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-indigo-300 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-indigo-300 transition-colors duration-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
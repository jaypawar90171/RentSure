import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { FileCheck, Shield, Wallet2 } from "lucide-react"

export function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-10 md:py-16 overflow-hidden"> {/* Reduced padding */}
      <div className="container mx-auto px-6 mt-25">
        <div className="max-w-4xl mx-auto text-center transform transition-all duration-700 hover:scale-[1.01]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rentsure-600 to-blue-600">
              Smart Rental Contracts
            </span>{" "}
            for the Modern Landlord and Tenant
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-300">
            <Button
              size="lg"
              className="bg-rentsure-600 hover:bg-rentsure-700 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link to="/landlord" className="flex items-center gap-2">
                Get Started as Landlord
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-rentsure-600 text-rentsure-600 hover:bg-rentsure-50 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link to="/tenant" className="flex items-center gap-2">
                Get Started as Tenant
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-6"> {/* Reduced margin-top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileCheck className="text-rentsure-600 h-6 w-6" />,
              title: "Digital Contracts",
              description: "Create, sign, and manage rental agreements digitally with legally binding smart contracts.",
            },
            {
              icon: <Shield className="text-rentsure-600 h-6 w-6" />,
              title: "Secure & Transparent",
              description: "Blockchain technology ensures your agreements are tamper-proof and fully transparent.",
            },
            {
              icon: <Wallet2 className="text-rentsure-600 h-6 w-6" />,
              title: "Automated Payments",
              description: "Set up recurring payments, security deposits, and handle disputes efficiently.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.1 + 0.1}s`, animationFillMode: "forwards" }}
            >
              <div className="rounded-full bg-rentsure-100 p-3 w-12 h-12 flex items-center justify-center mb-4 transform transition-all duration-300 hover:scale-110 hover:bg-rentsure-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

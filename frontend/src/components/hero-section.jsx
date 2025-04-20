import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { FileCheck, Shield, Wallet2 } from "lucide-react"

function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 md:py-24 overflow-hidden relative">
      {/* Abstract shapes in background
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-blue-300 to-teal-300 blur-3xl"></div>
      </div> */}

      <div className="container mx-auto px-6 mt-6 pt-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center transform transition-all duration-700 hover:scale-[1.01]">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-medium">
            Revolutionizing Rental Agreements
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Smart Rental Contracts
            </span>{" "}
            for the Modern Landlord and Tenant
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure, transparent, and efficient rental agreements powered by blockchain technology
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-300">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-0"
            >
              <Link to="/login" className="flex items-center gap-2">
                Get Started 
              </Link>
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link to="/tenant" className="flex items-center gap-2">
                Get Started as Tenant
              </Link>
            </Button> */}
          </div>
        </div>
      </div>

      {/* <div className="container mx-auto px-6 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileCheck className="text-indigo-600 h-7 w-7" />,
              title: "Digital Contracts",
              description: "Create, sign, and manage rental agreements digitally with legally binding smart contracts.",
              color: "from-indigo-500 to-blue-500",
              bgColor: "bg-indigo-50",
            },
            {
              icon: <Shield className="text-purple-600 h-7 w-7" />,
              title: "Secure & Transparent",
              description: "Blockchain technology ensures your agreements are tamper-proof and fully transparent.",
              color: "from-purple-500 to-pink-500",
              bgColor: "bg-purple-50",
            },
            {
              icon: <Wallet2 className="text-teal-600 h-7 w-7" />,
              title: "Automated Payments",
              description: "Set up recurring payments, security deposits, and handle disputes efficiently.",
              color: "from-teal-500 to-emerald-500",
              bgColor: "bg-teal-50",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-slide-up group"
              style={{ animationDelay: `${index * 0.1 + 0.1}s`, animationFillMode: "forwards" }}
            >
              <div
                className={`rounded-2xl ${feature.bgColor} p-4 w-16 h-16 flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              <div
                className={`h-1 w-16 mt-6 rounded-full bg-gradient-to-r ${feature.color} transform transition-all duration-300 group-hover:w-24`}
              ></div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default HeroSection;
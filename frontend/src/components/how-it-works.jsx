import { Card, CardContent } from "../components/ui/card"
import { CheckCircle2, FileSignature, Home, Wallet } from "lucide-react"

 function HowItWorks() {
  const steps = [
    {
      icon: <Home className="h-8 w-8 text-indigo-600" />,
      title: "Create Property Listing",
      description: "Add your property details including address, rent amount, and lease terms.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <FileSignature className="h-8 w-8 text-purple-600" />,
      title: "Generate Smart Contract",
      description: "Our platform creates a blockchain-based rental agreement with your specified terms.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Wallet className="h-8 w-8 text-teal-600" />,
      title: "Secure Digital Signatures",
      description: "Both parties sign the contract digitally, creating a legally binding agreement.",
      gradient: "from-teal-500 to-emerald-500",
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-amber-600" />,
      title: "Manage Your Rental",
      description: "Track payments, handle maintenance requests, and manage all documentation.",
      gradient: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
            Simple Process
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How RentSure Works</h2>
          <p className="text-lg text-gray-600">Our simple, four-step process makes rental management effortless</p>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-0 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.gradient}`}></div>
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="inline-block bg-gray-300 text-gray-800 text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorks;
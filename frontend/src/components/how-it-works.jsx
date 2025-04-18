import { Card, CardContent } from "../components/ui/card";
import { CheckCircle2, FileSignature, Home, Wallet } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Home className="h-8 w-8 text-rentsure-600" />,
      title: "Create Property Listing",
      description: "Add your property details including address, rent amount, and lease terms."
    },
    {
      icon: <FileSignature className="h-8 w-8 text-rentsure-600" />,
      title: "Generate Smart Contract",
      description: "Our platform creates a blockchain-based rental agreement with your specified terms."
    },
    {
      icon: <Wallet className="h-8 w-8 text-rentsure-600" />,
      title: "Secure Digital Signatures",
      description: "Both parties sign the contract digitally, creating a legally binding agreement."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-rentsure-600" />,
      title: "Manage Your Rental",
      description: "Track payments, handle maintenance requests, and manage all documentation."
    }
  ];

  return (
    <div className="bg-gray-50 ">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How RentSure Works
          </h2>
          <p className="text-lg text-gray-600">
            Our simple, four-step process makes rental management effortless
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-rentsure-600"></div>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  {step.icon}
                  <div className="inline-block bg-rentsure-100 text-rentsure-800 text-sm font-semibold rounded-full w-8 h-8 items-center justify-center mt-3">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
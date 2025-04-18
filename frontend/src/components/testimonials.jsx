import { Card, CardContent, CardFooter } from "../components/ui/card";
import { StarIcon } from "lucide-react";

export function Testimonials() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Landlords and Tenants
          </h2>
          <p className="text-lg text-gray-600">
            Hear from our users who have simplified their rental process with RentSure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a landlord with multiple properties, RentSure has been a game-changer. 
                I've reduced paperwork and tenant disputes significantly."
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 text-gray-700 text-sm py-3 px-6">
              Michael K., Landlord in Seattle
            </CardFooter>
          </Card>
          
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "I love the transparency. I can see my payment history, maintenance requests, and 
                my lease details all in one place."
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 text-gray-700 text-sm py-3 px-6">
              Jennifer T., Tenant in Chicago
            </CardFooter>
          </Card>
          
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The automated payments feature has eliminated late rent completely. 
                My tenants appreciate the reminders and easy payment options."
              </p>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 text-gray-700 text-sm py-3 px-6">
              Robert L., Property Manager
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
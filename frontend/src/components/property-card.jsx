import PropTypes from "prop-types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CalendarIcon, FileText, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PropertyCard({ property }) {

  const navigate = useNavigate();
  
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    pending: "bg-yellow-200 text-yellow-800",
    active: "bg-green-200 text-green-800",
    expired: "bg-red-200 text-red-800",
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Add image at the top of the card */}
      {property.image && (
        <img
          src={`https://gateway.pinata.cloud/ipfs/${property.image}`}  
          alt={property.name || "Property Image"}
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{property.name || "Unnamed Property"}</CardTitle>
          <Badge className={statusColors[property.isAvailable ? "active" : "draft"]}>
            {property.isAvailable ? "Available" : "Not Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Home className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-gray-700">
             {property.address?.street || "Address not available"}
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-gray-700">
              {formatDate(property.startDate)} - {formatDate(property.endDate)}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Monthly Rent</div>
            <div className="text-xl font-semibold text-gray-900">
              {formatCurrency(property.rentAmount)}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 border-t">
        <Button
          variant="outline"
          className="w-full text-rentsure-600 border-rentsure-300 hover:bg-rentsure-50"
          onClick={() => navigate(`/properties/${property._id}`)}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Contract
        </Button>
      </CardFooter>
    </Card>
  );
}

// Define PropTypes for the component
PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    id: PropTypes.string.isRequired,
    address: PropTypes.shape({
      street: PropTypes.string,
    }),
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    rentAmount: PropTypes.string.isRequired,
    isAvailable: PropTypes.bool.isRequired,
    image: PropTypes.string, // Ensure the image prop is defined
  }).isRequired,
};
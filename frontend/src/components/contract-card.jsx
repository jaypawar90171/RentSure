import PropTypes from "prop-types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CalendarIcon, FileText, Home, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ContractCard({ contract }) {
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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{contract.title}</CardTitle>
          <Badge className={statusColors[contract.status]}>
            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Home className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-gray-700">{contract.address}</span>
          </div>

          <div className="flex items-start space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-gray-700">
              {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <Users className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <div className="text-gray-700">Landlord: {contract.parties.landlord}</div>
              {contract.parties.tenant && (
                <div className="text-gray-700">Tenant: {contract.parties.tenant}</div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Monthly Rent</div>
            <div className="text-xl font-semibold text-gray-900">{formatCurrency(contract.monthlyRent)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button
          variant="outline"
          className="w-full text-rentsure-600 border-rentsure-300 hover:bg-rentsure-50"
          onClick={() => navigate(`/contracts/${contract.id}`)}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Contract
        </Button>
      </CardFooter>
    </Card>
  );
}

// Define PropTypes for the component
ContractCard.propTypes = {
  contract: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    monthlyRent: PropTypes.number.isRequired,
    status: PropTypes.oneOf(["draft", "pending", "active", "expired"]).isRequired,
    parties: PropTypes.shape({
      landlord: PropTypes.string.isRequired,
      tenant: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
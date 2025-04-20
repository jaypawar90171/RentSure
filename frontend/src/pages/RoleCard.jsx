import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of Navigate

const RoleSelectionCard = () => {
  const navigate = useNavigate(); // Correctly use the useNavigate hook

  // Function to handle role selection
  const handleRoleSelection = (selectedRole) => {
    // Store the selected role in local storage
    localStorage.setItem("user-role", selectedRole);

    // Redirect to the respective page based on the selected role
    if (selectedRole === "landlord") {
      navigate("/register-landlord");
    } else {
      navigate("/register-tenant");
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Choose your role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full p-8 flex items-center gap-4 hover:bg-primary/5"
            onClick={() => handleRoleSelection("landlord")}
          >
            <Building2 className="h-6 w-6" />
            <span className="text-lg">I am a Landlord</span>
          </Button>
          <Button
            variant="outline"
            className="w-full p-8 flex items-center gap-4 hover:bg-primary/5"
            onClick={() => handleRoleSelection("tenant")}
          >
            <UserRound className="h-6 w-6" />
            <span className="text-lg">I am a Tenant</span>
          </Button>
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  );
};

export default RoleSelectionCard;
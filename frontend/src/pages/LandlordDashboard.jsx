import React from "react";
import  Navbar from "../components/navbar";
import  Footer  from "../components/footer";
import { Button } from "../components/ui/button";
import { LandlordStats } from "../components/dashboard-stats";
import { PropertyCard } from "../components/property-card";
// import { WalletConnect } from "../components/wallet-connect";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState} from "react";
import PageTransition from "./PageTransition"; // Add this import
const LandlordDashboard = () => {
  const [properties, setProperties] = React.useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  useEffect(() => {
    console.log("Fetching properties...");
    const fetchProperties = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user-info")); // Assuming user info is stored in localStorage
        const response = await axios.get(`http://localhost:5000/api/properties?userId=${userInfo._id}`);
        setProperties(response.data);
      } catch (error) {
        console.error("There was an error fetching the properties!", error);
      }
    };

    // Fetch maintenance requests for this landlord
  const fetchMaintenanceRequests = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      const response = await axios.get(
        `http://localhost:5000/api/maintenance?userId=${userInfo._id}`
      );
      setMaintenanceRequests(response.data);
    } catch (error) {
      console.error("Error fetching maintenance requests!", error);
    }
  };

    fetchProperties();
    // Uncomment the following line if maintenance requests are needed
    fetchMaintenanceRequests();
  }, []);

  return (
    <PageTransition>
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-indigo-300 to-purple-300">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your rental properties and contracts</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {/* <WalletConnect /> */}
              <Link to="/create-property">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-colors duration-200">
                <Plus className="mr-2 h-4 w-4" />
                New Property
              </Button>
            </Link>
            </div>
          </div>

          <div className="mb-8">
            <LandlordStats />
          </div>

          {/* Maintenance Requests Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Maintenance Requests</h2>
            <div className="rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white shadow-sm border border-gray-100 p-2">
              <table className="w-full overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-100 via-purple-100 to-white border-b">
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Property Name</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Title</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Description</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceRequests.length > 0 ? (
                    maintenanceRequests.map((req) => (
                      <tr key={req._id} className="border-b hover:bg-indigo-50/60 transition-colors">
                        <td className="py-4 px-6">{req.propertyName}</td>
                        <td className="py-4 px-6">{req.title}</td>
                        <td className="py-4 px-6">{req.category}</td>
                        <td className="py-4 px-6">{req.description}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            req.urgency === "high"
                              ? "bg-red-100 text-red-700"
                              : req.urgency === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No maintenance requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="rounded-xl border border-gray-400 shadow-md hover:shadow-xl hover:border-indigo-400 transition-all duration-300 bg-white"
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </PageTransition>
  );
};

export default LandlordDashboard;
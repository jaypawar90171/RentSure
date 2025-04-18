import React, { use } from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { LandlordStats } from "../components/dashboard-stats";
import { ContractCard } from "../components/contract-card";
import { WalletConnect } from "../components/wallet-connect";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
const LandlordDashboard = () => {
  // const contracts = [
  //   {
  //     id: "c1",
  //     title: "Downtown Apartment",
  //     address: "123 Main St, Apt 4B, New York, NY",
  //     startDate: "2024-01-01",
  //     endDate: "2024-12-31",
  //     monthlyRent: 1250,
  //     status: "active",
  //     parties: {
  //       landlord: "ABC Properties",
  //       tenant: "John Smith",
  //     },
  //   },
  //   {
  //     id: "c2",
  //     title: "Suburban House",
  //     address: "456 Oak Lane, Chicago, IL",
  //     startDate: "2024-03-15",
  //     endDate: "2025-03-14",
  //     monthlyRent: 1800,
  //     status: "active",
  //     parties: {
  //       landlord: "ABC Properties",
  //       tenant: "Maria Johnson",
  //     },
  //   },
  //   {
  //     id: "c3",
  //     title: "Luxury Condo",
  //     address: "789 Park Ave, San Francisco, CA",
  //     startDate: "2024-05-01",
  //     endDate: "2025-04-30",
  //     monthlyRent: 2200,
  //     status: "pending",
  //     parties: {
  //       landlord: "ABC Properties",
  //     },
  //   },
  //   {
  //     id: "c4",
  //     title: "Studio Apartment",
  //     address: "101 Pine St, Seattle, WA",
  //     startDate: "2023-11-01",
  //     endDate: "2024-10-31",
  //     monthlyRent: 1100,
  //     status: "active",
  //     parties: {
  //       landlord: "ABC Properties",
  //       tenant: "David Wilson",
  //     },
  //   },
  //   {
  //     id: "c5",
  //     title: "Beach House",
  //     address: "555 Ocean Dr, Miami, FL",
  //     startDate: "2023-12-15",
  //     endDate: "2024-12-14",
  //     monthlyRent: 3000,
  //     status: "draft",
  //     parties: {
  //       landlord: "ABC Properties",
  //     },
  //   },
  // ];

  const [properties, setProperties] = React.useState([]);
  // const [propertyCount, setPropertyCount] = React.useState(0);  
  // const [activeContracts, setActiveContracts] = React.useState(0);
  
  useEffect(() => { 
    console.log("Fetching properties...");
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("There was an error fetching the properties!", error);
      }
    };

    fetchProperties();
  } , []);
  // axios.get("http://localhost:5000/api/properties") 
  // .then((response) => {
  //   console.log(response.data);
  //   setProperties(response.data);
  //  })
  // .catch((error) => {
  //   console.error("There was an error!", error);
  // });



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your rental properties and contracts</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {/* <WalletConnect /> */}
              <Link to="/create-contract">
                <Button className="bg-rentsure-600 hover:bg-rentsure-700 mt-2 sm:mt-0">
                  <Plus className="mr-2 h-4 w-4" />
                  New Contract
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <LandlordStats />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Contracts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <ContractCard key={property._id} contract={property} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandlordDashboard;
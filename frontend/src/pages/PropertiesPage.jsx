
import React, { useState } from "react";
import  Navbar from "../components/navbar";
import  Footer  from "../components/footer";
import {  PropertyCard } from "../components/property-card";
import { Button } from "../components/ui/button";
// import { WalletConnect } from "../components/wallet-connect";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import PageTransition from "./PageTransition";
const PropertiesPage = () => {
  
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    // console.log("Fetching properties on mount...");
  const fetchProperties = async () => {
    try {

      await axios.get("http://localhost:5000/api/properties")
  .then((response) => {
    console.log("Fetched properties:", response.data);
    setProperties(response.data); // Ensure propertyName is part of response.data
    setLoading(false);
  })
      .catch((error) => {
        console.error("There was an error fetching the properties!", error) });
      // console.log("Fetched properties:", response.data);
      // setProperties(response.data);
      // setAllProperties(response.data);
      // setLoading(false);

    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again later.");
      setLoading(false);
    }
    console.log("Properties fetched:", properties);
  };

  const displayProperties =  () => {
    console.log("Properties fetched:", properties);
  };


  fetchProperties();
  displayProperties();
 
} , []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProperties = properties.filter((property) => {
    const searchLower = searchTerm.toLowerCase();
  
    // Check if the property matches the search term
    const matchesSearch =
      (property.name?.toLowerCase().includes(searchLower)) ||
      (property.address?.street?.toLowerCase().includes(searchLower)) ||
      (property.address?.city?.toLowerCase().includes(searchLower)) ||
      (property.address?.state?.toLowerCase().includes(searchLower)) ||
      (property.address?.zipCode?.toLowerCase().includes(searchLower)) ||
      (property.rentAmount?.toString().includes(searchTerm));
   
    const matchesStatus =
      statusFilter === "all" || property.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <PageTransition>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rental Properties</h1>
              <p className="text-gray-600 mt-1">View and manage all your properties</p>
            </div>
            
          </div>

          <div className="bg-white p-4 rounded-lg border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search properties by title, address, or city..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any contracts yet"}
              </p>
              
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Link to={`/properties/${property._id}`}
                state={{ property }}
                key={property._id}>

                <PropertyCard  property={property} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </PageTransition>
  );
};

export default PropertiesPage;
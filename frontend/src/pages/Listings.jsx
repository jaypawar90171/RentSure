import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import  Navbar  from "../components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Grid, List } from "lucide-react";
import axios from "axios";
// const rentalListings = [
//   {
//     id: 1,
//     title: "Downtown Apartment",
//     address: "123 Main St, Apt 4B, New York",
//     price: 2500,
//     bedrooms: 2,
//     bathrooms: 1,
//     sqft: 850,
//     securityDeposit: 3000,
//     description: "Modern apartment in the heart of downtown with great amenities and easy access to public transportation.",
//     featured: true,
//   },
//   {
//     id: 2,
//     title: "Suburban House",
//     address: "456 Oak Lane, Austin",
//     price: 3200,
//     bedrooms: 3,
//     bathrooms: 2.5,
//     sqft: 1800,
//     securityDeposit: 3000,
//     description: "Spacious family home in a quiet neighborhood with a large backyard and modern appliances.",
//     featured: false,
//   },
//   {
//     id: 3,
//     title: "Luxury Condo",
//     address: "789 Skyline Ave, Unit 12, Miami",
//     price: 4000,
//     bedrooms: 2,
//     bathrooms: 2,
//     sqft: 1200,
//     securityDeposit: 3000,
//     description: "High-end condo with ocean views, pool access, and 24/7 security in a premium building.",
//     featured: true,
//   },
//   {
//     id: 4,
//     title: "Cozy Studio",
//     address: "101 College Blvd, Boston",
//     price: 1800,
//     bedrooms: 0,
//     bathrooms: 1,
//     sqft: 550,
//     securityDeposit: 3000,
//     description: "Perfect studio for students or young professionals, fully furnished with utilities included.",
//     featured: false,
//   },
//   {
//     id: 5,
//     title: "Waterfront Townhouse",
//     address: "222 Harbor View, Seattle",
//     price: 3800,
//     bedrooms: 3,
//     bathrooms: 2,
//     sqft: 1600,
//     securityDeposit: 3000,
//     description: "Beautiful townhouse with stunning water views, private deck, and modern finishes throughout.",
//     featured: false,
//   },
//   {
//     id: 6,
//     title: "Garden Apartment",
//     address: "333 Green St, Lower Level, Chicago",
//     price: 1950,
//     bedrooms: 1,
//     bathrooms: 1,
//     sqft: 750,
//     securityDeposit: 3000,
//     description: "Charming garden-level apartment with private entrance and access to shared backyard space.",
//     featured: false,
//   },
// ];




function Listings() {
  const [properties , setProperties] = useState([]);
  // rentalListings = useState({});

axios.get("http://localhost:5000/api/properties")
.then((response) => {
  setProperties(response.data)
})
.catch((error) => { console.error("There was an error!", error); })


  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const filteredListings = properties.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-2">Available Rental Properties</h1>
      <p className="text-gray-600 mb-6">Find your perfect rental home from our curated listings</p>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by location, property name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Button
            variant={viewMode === "grid" ? "solid" : "outline"}
            className="mr-2"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "solid" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="new">New Listings</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ListingCard({ listing }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/listing/${listing.id}`, { state: { listing } });
  };

  return (
    <Card className="overflow-hidden relative border rounded-lg shadow-md">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={`https://gateway.pinata.cloud/ipfs/QmQoNQCDxzE8BNSiC8GJDpz93Z3CQW7Q2njmK9159fsk6v`}  // Keep the src URL blank as per the requirement
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <CardContent className="p-4 bg-black text-white">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg font-semibold">{listing.title}</CardTitle>
          <p className="text-primary font-bold">${listing.price}</p>
        </div>
        <p className="text-gray-400 text-sm mb-4">{listing.address}</p>

        {/* Details Section */}
        <div className="flex justify-between text-sm mb-2">
          <div className="flex items-center space-x-1">
            <span>🛏️</span>
            <span>{listing.bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🛁</span>
            <span>{listing.bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📅</span>
            <span>Available {listing.availableDate || "N/A"}</span>
          </div>
        </div>

        {/* Security Deposit */}
        <p className="text-gray-400 text-sm mb-4">
          Security Deposit: ${listing.securityDeposit || "N/A"}
        </p>

        {/* View Details Button */}
        <Button size="sm" className="bg-primary text-white w-full" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default Listings;
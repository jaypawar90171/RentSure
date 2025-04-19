import React, { useState } from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import {  PropertyCard } from "../components/property-card";
import { Button } from "../components/ui/button";
import { WalletConnect } from "../components/wallet-connect";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

const PropertiesPage = () => {
  const allProperties = [
    {
      id: "c1",
      title: "Downtown Apartment",
      address: "123 Main St, Apt 4B, New York, NY",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      monthlyRent: 1250,
      status: "active",
      parties: {
        landlord: "ABC Properties",
        tenant: "John Smith",
      },
    },
    {
      id: "c2",
      title: "Suburban House",
      address: "456 Oak Lane, Chicago, IL",
      startDate: "2024-03-15",
      endDate: "2025-03-14",
      monthlyRent: 1800,
      status: "active",
      parties: {
        landlord: "ABC Properties",
        tenant: "Maria Johnson",
      },
    },
    {
      id: "c3",
      title: "Luxury Condo",
      address: "789 Park Ave, San Francisco, CA",
      startDate: "2024-05-01",
      endDate: "2025-04-30",
      monthlyRent: 2200,
      status: "pending",
      parties: {
        landlord: "ABC Properties",
      },
    },
    {
      id: "c4",
      title: "Studio Apartment",
      address: "101 Pine St, Seattle, WA",
      startDate: "2023-11-01",
      endDate: "2024-10-31",
      monthlyRent: 1100,
      status: "active",
      parties: {
        landlord: "ABC Properties",
        tenant: "David Wilson",
      },
    },
    {
      id: "c5",
      title: "Beach House",
      address: "555 Ocean Dr, Miami, FL",
      startDate: "2023-12-15",
      endDate: "2024-12-14",
      monthlyRent: 3000,
      status: "draft",
      parties: {
        landlord: "ABC Properties",
      },
    },
    {
      id: "c6",
      title: "Mountain Cabin",
      address: "777 Pine View, Denver, CO",
      startDate: "2024-06-01",
      endDate: "2025-05-31",
      monthlyRent: 1600,
      status: "expired",
      parties: {
        landlord: "ABC Properties",
        tenant: "Sarah Miller",
      },
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProperties = allProperties.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
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
                  placeholder="Search contracts by title or address..."
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any contracts yet"}
              </p>
              <Link to="/create-contract">
                <Button className="bg-rentsure-600 hover:bg-rentsure-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Contract
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
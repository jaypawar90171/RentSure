import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const ListingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const listing = location.state?.listing;

  if (!listing) {
    return <p>Listing not found.</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        &larr; Back to Listings
      </Button>
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-400 mb-4">{listing.address}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Section */}
        <div className="lg:col-span-2 bg-gray-200 h-64">
          <img
            src="" // Keep the src URL blank as per the requirement
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lease Information */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Lease Information</h2>
          <p className="mb-2">
            <span className="font-semibold">Monthly Rent:</span> ${listing.price}/month
          </p>
          <p className="mb-2">
            <span className="font-semibold">Security Deposit:</span> ${listing.securityDeposit}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Lease Term:</span> 6/1/2023 to 5/31/2024
          </p>
          <Button className="w-full mb-2 bg-primary text-white">Apply Now</Button>
          <Button className="w-full bg-gray-700 text-white">Contact Landlord</Button>
        </div>
      </div>

      {/* Property Details */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="font-semibold">Bedrooms</p>
            <p>{listing.bedrooms}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="font-semibold">Bathrooms</p>
            <p>{listing.bathrooms}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="font-semibold">Available From</p>
            <p>6/1/2023</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <p className="bg-gray-800 p-4 rounded-lg">{listing.description}</p>
      </div>
    </div>
  );
};

export default ListingDetails;
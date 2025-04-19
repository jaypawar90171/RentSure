import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { WalletConnect } from "../components/wallet-connect";
import { ArrowLeft, Calendar, Check, CheckCircle2, Clock, DollarSign, FileCheck, FileText, History, Home, Users } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { toast } from "../components/ui/sonner";

const PropertyDetail = () => {
  const { id } = useParams();
  const [isSigning, setIsSigning] = useState(false);

  const mockContracts = {
    c1: {
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
    c3: {
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
  };

  const contract = mockContracts[id || ""] || mockContracts.c1;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  const handleSignContract = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      toast.success("Contract signed successfully!");
    }, 2000);
  };

  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    pending: "bg-yellow-200 text-yellow-800",
    active: "bg-green-200 text-green-800",
    expired: "bg-red-200 text-red-800",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-6">
            <Link to="/contracts">
              <Button variant="ghost" className="mr-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contracts
              </Button>
            </Link>
            <WalletConnect />
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
                <div className="flex items-center mt-1">
                  <Home className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{contract.address}</span>
                </div>
              </div>
              <Badge className={statusColors[contract.status]}>
                {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    <Calendar className="h-4 w-4 text-rentsure-600 inline mr-2" />
                    Lease Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">
                    {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    <DollarSign className="h-4 w-4 text-rentsure-600 inline mr-2" />
                    Monthly Rent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">{formatCurrency(contract.monthlyRent)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    <Users className="h-4 w-4 text-rentsure-600 inline mr-2" />
                    Parties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-500">Landlord:</span>{" "}
                      <span className="font-medium">{contract.parties.landlord}</span>
                    </div>
                    {contract.parties.tenant && (
                      <div>
                        <span className="text-gray-500">Tenant:</span>{" "}
                        <span className="font-medium">{contract.parties.tenant}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {contract.status === "pending" && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Contract Awaiting Signature</h3>
                    <p className="text-sm text-yellow-700">This contract needs to be signed by all parties to become active.</p>
                  </div>
                </div>
                <Button
                  className="bg-rentsure-600 hover:bg-rentsure-700"
                  onClick={handleSignContract}
                  disabled={isSigning}
                >
                  {isSigning ? (
                    <>Signing...</>
                  ) : (
                    <>
                      <FileCheck className="mr-2 h-4 w-4" />
                      Sign Contract
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Contract Details
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Transaction History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lease Agreement</CardTitle>
                  <CardDescription>Complete terms and conditions of the rental agreement</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <h3>1. Parties</h3>
                  <p>
                    This Residential Lease Agreement ("Agreement") is made between {contract.parties.landlord} ("Landlord")
                    {contract.parties.tenant ? ` and ${contract.parties.tenant} ("Tenant")` : ""}.
                  </p>

                  <h3>2. Property</h3>
                  <p>
                    Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the residential property
                    located at: {contract.address} ("Premises").
                  </p>

                  <h3>3. Term</h3>
                  <p>
                    The lease term will begin on {formatDate(contract.startDate)} and end on {formatDate(contract.endDate)}
                    ("Lease Term").
                  </p>

                  <h3>4. Rent</h3>
                  <p>
                    Tenant agrees to pay {formatCurrency(contract.monthlyRent)} per month as rent, due on the 1st day of each
                    month during the Lease Term.
                  </p>

                  <h3>5. Security Deposit</h3>
                  <p>
                    Tenant will pay a security deposit of {formatCurrency(contract.monthlyRent)} to be held during the
                    Lease Term.
                  </p>

                  <h3>6. Utilities</h3>
                  <p>
                    Tenant is responsible for paying all utilities and services for the Premises.
                  </p>

                  <h3>7. Maintenance and Repairs</h3>
                  <p>
                    Tenant is responsible for routine maintenance. Landlord is responsible for major repairs.
                  </p>

                  <h3>8. Smart Contract Integration</h3>
                  <p>
                    This lease agreement is backed by blockchain technology, providing security and transparency for
                    both parties. All transactions and amendments are recorded on the blockchain.
                  </p>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Contract ID:</span>
                        <code className="text-xs bg-gray-100 p-1 rounded">{contract.id}</code>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Blockchain Address:</span>
                        <code className="text-xs bg-gray-100 p-1 rounded">0x7c8f0671dD917789F9C0272D02f20c2b7AcD4F1F</code>
                      </div>
                    </div>
                    {contract.status === "active" && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span>Verified on Blockchain</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Transaction History</CardTitle>
                  <CardDescription>A record of all activities on this contract</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-gray-200 ml-3 pl-6 py-2">
                    <div className="mb-8">
                      <div className="absolute -left-3 mt-1.5">
                        <div className="h-6 w-6 rounded-full bg-rentsure-100 flex items-center justify-center">
                          <FileText className="h-3 w-3 text-rentsure-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold">Contract Created</h3>
                      <time className="text-xs text-gray-500">April 15, 2024 at 10:24 AM</time>
                      <p className="mt-1 text-gray-600">Contract was created by ABC Properties</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Tx: <code className="bg-gray-100 p-1 rounded">0x59b1e0b6d97455865971cd8c5798ab98c9b928fae5a94b295ec0e377c2ab7896</code>
                      </div>
                    </div>

                    {contract.status === "active" || contract.status === "expired" ? (
                      <div className="mb-8">
                        <div className="absolute -left-3 mt-1.5">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold">Contract Signed</h3>
                        <time className="text-xs text-gray-500">April 16, 2024 at 3:45 PM</time>
                        <p className="mt-1 text-gray-600">All parties have signed the contract</p>
                        <div className="mt-2 text-xs text-gray-500">
                          Tx: <code className="bg-gray-100 p-1 rounded">0x31d7e8bf04654317492d9498c9adb6a0b3e96c4e0934f542b620b74ca368375c</code>
                        </div>
                      </div>
                    ) : null}

                    {contract.status === "active" || contract.status === "expired" ? (
                      <div className="mb-8">
                        <div className="absolute -left-3 mt-1.5">
                          <div className="h-6 w-6 rounded-full bg-rentsure-100 flex items-center justify-center">
                            <DollarSign className="h-3 w-3 text-rentsure-600" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold">Security Deposit Received</h3>
                        <time className="text-xs text-gray-500">April 20, 2024 at 9:12 AM</time>
                        <p className="mt-1 text-gray-600">{formatCurrency(contract.monthlyRent)} security deposit paid</p>
                        <div className="mt-2 text-xs text-gray-500">
                          Tx: <code className="bg-gray-100 p-1 rounded">0x87f2b0681d40c013f19fcc3f18f6ea1c6f772ee721d0b346c0d6cdf822e3b1ec</code>
                        </div>
                      </div>
                    ) : null}

                    {contract.status === "pending" && (
                      <div className="text-center py-6">
                        <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Waiting for all parties to sign the contract</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
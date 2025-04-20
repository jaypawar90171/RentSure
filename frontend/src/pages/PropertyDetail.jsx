"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  History,
  Home,
  Users,
} from "lucide-react"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import GooglePayButton from "@google-pay/button-react"
import axios from "axios"
import MapComponent from "../components/ui/MapComponent"
import PageTransition from "./PageTransition"

const PropertyDetail = () => {
  const { id } = useParams()
  const [isSigning, setIsSigning] = useState(false)
  const [googlePayButton, setGooglePayButton] = useState(false)
  const { state } = useLocation()
  const [property, setProperty] = useState(null)

  useEffect(() => {
    const fetchProperty = async () => {
      console.log("Fetching data for property ID:", id)

      axios
        .get(`http://localhost:5000/api/properties/${id}`)
        .then((response) => {
          console.log("Fetched property:", response.data)
          setProperty(response.data)
        })
        .catch((error) => {
          console.error("Error fetching property:", error)
        })
    }

    if (!state?.property) {
      fetchProperty()
    } else {
      setProperty(state.property)
    }
  }, [id, state])

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-700">Loading property details...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the information.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const handleSignContract = () => {
    setGooglePayButton(true)
  }

  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    pending: "bg-yellow-200 text-yellow-800",
    active: "bg-green-200 text-green-800",
    expired: "bg-red-200 text-red-800",
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            {/* Back button */}
            <div className="flex items-center mb-6">
              <Link to="/properties">
                <Button variant="ghost" className="mr-2 hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Contracts
                </Button>
              </Link>
            </div>

            {/* Property details card */}
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>
                  <div className="flex items-center">
                    <Home className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      {property.address.street}, {property.address.city}, {property.address.state},{" "}
                      {property.address.zipcode}
                    </span>
                  </div>
                </div>

                <Badge className={`${statusColors[property.isAvailable ? "active" : "draft"]} mt-2 md:mt-0 self-start`}>
                  {property.isAvailable ? "Available" : "Not Available"}
                </Badge>
              </div>

              {/* Image and Map section - stacked layout to preserve map size */}
              <div className="mb-8">
                {/* Property Image */}
                <div className="mb-6">
                  <div className="font-medium text-sm text-gray-500 mb-2">Property Image</div>
                  <div className="rounded-lg overflow-hidden border bg-gray-100 h-[300px]">
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${property.image}`}
                      alt={property.name || "Property Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Map with original size */}
                <div>
                  <div className="font-medium text-sm text-gray-500 mb-2">Location</div>
                  <div className="overflow-hidden rounded-lg border relative">
                    {/* This wrapper maintains the map's original size while containing overflow */}
                    <div className="overflow-x-auto">
                      <div style={{ width: "100%", height: "500px" }}>
                        <MapComponent latitude={property.location.latitude} longitude={property.location.longitude} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      Lease Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-medium">
                      {formatDate(property.startDate)} - {formatDate(property.endDate)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                      Monthly Rent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-medium">{formatCurrency(property.rentAmount)}</div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                      <Users className="h-4 w-4 text-purple-600 mr-2" />
                      Parties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-gray-500">Landlord:</span>{" "}
                        <span className="font-medium ml-1">{property.landlord.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contract signing section */}
              {property.isAvailable === true && (
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start md:items-center">
                    <Clock className="h-6 w-6 text-yellow-600 mr-4 flex-shrink-0 mt-1 md:mt-0" />
                    <div>
                      <h3 className="font-medium text-yellow-800 text-lg">Contract Awaiting Signature</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        This contract needs to be signed by all parties to become active.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!googlePayButton ? (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
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
                    ) : (
                      <div className="w-full sm:w-64">
                        <GooglePayButton
                          environment="TEST"
                          buttonSizeMode="fill"
                          buttonColor="black"
                          buttonType="pay"
                          buttonLocale="en"
                          paymentRequest={{
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: [
                              {
                                type: "CARD",
                                parameters: {
                                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                                  allowedCardNetworks: ["MASTERCARD", "VISA"],
                                },
                                tokenizationSpecification: {
                                  type: "PAYMENT_GATEWAY",
                                  parameters: {
                                    gateway: "example",
                                    gatewayMerchantId: "exampleGatewayMerchantId",
                                  },
                                },
                              },
                            ],
                            merchantInfo: {
                              merchantId: "BCR2DN7T5CCLJ3QZ",
                              merchantName: "Dream Developers",
                            },
                            transactionInfo: {
                              totalPriceStatus: "FINAL",
                              totalPriceLabel: "Total",
                              totalPrice: String(property.depositAmount),
                              currencyCode: "INR",
                              countryCode: "IN",
                            },
                          }}
                          onLoadPaymentData={(paymentRequest) => {
                            console.log("load payment data", paymentRequest)
                            const userId = JSON.parse(localStorage.getItem("userId"))
                            const requestBody = {
                              propertyId: property._id,
                              amount: String(property.depositAmount),
                              tenantId: userId,
                              status: "paid",
                            }

                            axios
                              .post("http://localhost:5000/api/payDeposit", requestBody)
                              .then((response) => {
                                axios
                                  .post("http://localhost:5000/api/payment", {
                                    propertyId: property._id,
                                    amount: property.depositAmount,
                                    tenantId: userId,
                                  })
                                  .then((res) => {
                                    console.log("Successfully saved to Blockchain", res.data)
                                  })
                                  .catch((err) => {
                                    console.error("Error saving to Blockchain", err)
                                  })

                                const rentDetail = {
                                  propertyId: property._id,
                                  tenantId: userId,
                                  landlordId: "abc",
                                }

                                axios
                                  .post("http://localhost:5000/api/rentOut", rentDetail)
                                  .then((res) => {
                                    console.log("Rented Out Successful with security deposit", res.data)
                                  })
                                  .catch((err) => {
                                    console.error("Error in renting out", err)
                                  })

                                console.log("Order processed successfully", response.data)
                              })
                              .catch((error) => {
                                console.error("Error processing order", error)
                              })
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs section */}
            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="mb-6 bg-white border shadow-sm p-1 rounded-lg">
                <TabsTrigger value="details" className="data-[state=active]:bg-gray-100 rounded-md">
                  <FileText className="h-4 w-4 mr-2" />
                  Contract Details
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-gray-100 rounded-md">
                  <History className="h-4 w-4 mr-2" />
                  Transaction History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle>Lease Agreement</CardTitle>
                    <CardDescription>Complete terms and conditions of the rental agreement</CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none p-6">
                    <h3 className="text-lg font-semibold text-gray-800">1. Parties</h3>
                    <p className="text-gray-700">
                      This Residential Lease Agreement ("Agreement") is made between {property.landlord.name}{" "}
                      ("Landlord").
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">2. Property</h3>
                    <p className="text-gray-700">
                      Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the residential property
                      located at: {property.address.street}, {property.address.city}, {property.address.state},{" "}
                      {property.address.zipcode} ("Premises").
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">3. Term</h3>
                    <p className="text-gray-700">
                      The lease term will begin on {formatDate(property.startDate)} and end on{" "}
                      {formatDate(property.endDate)}
                      ("Lease Term").
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">4. Rent</h3>
                    <p className="text-gray-700">
                      Tenant agrees to pay {formatCurrency(property.rentAmount)} per month as rent, due on the 1st day
                      of each month during the Lease Term.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">5. Security Deposit</h3>
                    <p className="text-gray-700">
                      Tenant will pay a security deposit of {formatCurrency(property.rentAmount)} to be held during the
                      Lease Term.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">6. Utilities</h3>
                    <p className="text-gray-700">
                      Tenant is responsible for paying all utilities and services for the Premises.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">7. Maintenance and Repairs</h3>
                    <p className="text-gray-700">
                      Tenant is responsible for routine maintenance. Landlord is responsible for major repairs.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mt-6">8. Smart Contract Integration</h3>
                    <p className="text-gray-700">
                      This lease agreement is backed by blockchain technology, providing security and transparency for
                      both parties. All transactions and amendments are recorded on the blockchain.
                    </p>

                    <Separator className="my-6" />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">Property ID:</span>
                          <code className="text-xs bg-gray-100 p-1 rounded">{property._id}</code>
                        </div>
                      </div>
                      {property.isAvailable === false && (
                        <div className="flex items-center text-green-600 mt-4 sm:mt-0">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          <span>Verified on Blockchain</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle>Contract Transaction History</CardTitle>
                    <CardDescription>A record of all activities on this contract</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative border-l-2 border-gray-200 ml-3 pl-8 py-2">
                      <div className="mb-10">
                        <div className="absolute -left-3 mt-1.5">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                            <FileText className="h-3 w-3 text-blue-600" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Contract Created</h3>
                        <time className="text-xs text-gray-500 block mt-1">April 15, 2024 at 10:24 AM</time>
                        <p className="mt-2 text-gray-600">Contract was created by ABC Properties</p>
                        <div className="mt-3 text-xs bg-gray-50 p-2 rounded border">
                          <span className="text-gray-500">Tx:</span>{" "}
                          <code className="bg-gray-100 p-1 rounded text-gray-700">
                            0x59b1e0b6d97455865971cd8c5798ab98c9b928fae5a94b295ec0e377c2ab7896
                          </code>
                        </div>
                      </div>

                      {property.isAvailable === true || property.isAvailable === false ? (
                        <div className="mb-10">
                          <div className="absolute -left-3 mt-1.5">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Contract Signed</h3>
                          <time className="text-xs text-gray-500 block mt-1">April 16, 2024 at 3:45 PM</time>
                          <p className="mt-2 text-gray-600">All parties have signed the contract</p>
                          <div className="mt-3 text-xs bg-gray-50 p-2 rounded border">
                            <span className="text-gray-500">Tx:</span>{" "}
                            <code className="bg-gray-100 p-1 rounded text-gray-700">
                              0x31d7e8bf04654317492d9498c9adb6a0b3e96c4e0934f542b620b74ca368375c
                            </code>
                          </div>
                        </div>
                      ) : null}

                      {property.isAvailable === true || property.isAvailable === false ? (
                        <div className="mb-10">
                          <div className="absolute -left-3 mt-1.5">
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                              <DollarSign className="h-3 w-3 text-green-600" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Security Deposit Received</h3>
                          <time className="text-xs text-gray-500 block mt-1">April 20, 2024 at 9:12 AM</time>
                          <p className="mt-2 text-gray-600">
                            {formatCurrency(property.rentAmount)} security deposit paid
                          </p>
                          <div className="mt-3 text-xs bg-gray-50 p-2 rounded border">
                            <span className="text-gray-500">Tx:</span>{" "}
                            <code className="bg-gray-100 p-1 rounded text-gray-700">
                              0x87f2b0681d40c013f19fcc3f18f6ea1c6f772ee721d0b346c0d6cdf822e3b1ec
                            </code>
                          </div>
                        </div>
                      ) : null}

                      {property.isAvailable === true && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
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
    </PageTransition>
  )
}

export default PropertyDetail

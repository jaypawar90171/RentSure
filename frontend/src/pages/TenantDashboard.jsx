"use client"

import React, { useEffect, useState } from "react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { PropertyCard } from "../components/property-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { TabsContent, Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import {
  ArrowRight,
  Clock,
  DollarSign,
  MessageSquare,
  Wrench,
  Home,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react"
import GooglePayButton from "@google-pay/button-react"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import PageTransition from "./PageTransition"
const TenantDashboard = () => {
  const [property, setProperty] = React.useState({})
  const [dueDates, setDueDates] = useState([])
  const [timeRemaining, setTimeRemaining] = useState("")
  const [transactions, setTransactions] = useState([])
  const [activeTab, setActiveTab] = useState("payments")
  const [maintenanceFormOpen, setMaintenanceFormOpen] = useState(false)
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: "",
    category: "",
    description: "",
    urgency: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    console.log("Fetching properties...")
    const fetchProperty = async () => {
      try {
        await axios
          .post("http://localhost:5000/api/getPropertyByTenantId", {
            tenantId: JSON.parse(localStorage.getItem("userId")),
          })
          .then((response) => {
            setProperty(response.data)
            // console.log("Fetched property:", response.data._id)
             fetchTransactions(response.data._id)
            console.log(response.data[0])
          })
          .catch((error) => console.error("Error", error))

        // Calculate due dates
        const calculatedDueDates = calculateDueDates(property.startDate, property.endDate)
        setDueDates(calculatedDueDates)

        // Calculate time remaining for the next due date
        const remainingTime = calculateTimeRemaining(calculatedDueDates)
        setTimeRemaining(remainingTime)
      } catch (error) {
        console.error("There was an error fetching the properties!", error)
      }
    }

    const fetchTransactions = async (propertyId) => {

      console.log("Fetching transactions... ", propertyId)
      try { 
        const response = await axios.get(   `http://localhost:5000/api/transactions/${propertyId}/${JSON.parse(localStorage.getItem("userId"))}`);
        setTransactions(response.data) }
      catch (error) {
        console.error("Error fetching transactions:", error) }
     
      }
    fetchProperty()
    
    
  }, [])

  const calculateDueDates = (startDate, endDate) => {
    const dueDates = []
    const currentDate = new Date(startDate)
    currentDate.setDate(1) // Set to the 1st of the month
    const end = new Date(endDate)

    while (currentDate <= end) {
      dueDates.push(new Date(currentDate))
      currentDate.setMonth(currentDate.getMonth() + 1) // Move to the next month
    }

    return dueDates
  }

  // Function to calculate time remaining for the next due date
  const calculateTimeRemaining = (dueDates) => {
    const today = new Date()
    const nextDueDate = dueDates.find((date) => date >= today)

    if (nextDueDate) {
      const timeDiff = nextDueDate - today
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) // Convert milliseconds to days
      return `${daysRemaining} days`
    }

    return "No upcoming due dates"
  }

  // Calculate progress percentage for time remaining
  const calculateProgressPercentage = () => {
    if (!dueDates || dueDates.length === 0) return 0

    const today = new Date()
    const nextDueDate = dueDates.find((date) => date >= today)

    if (!nextDueDate) return 100

    const previousDueDate = new Date(nextDueDate)
    previousDueDate.setMonth(previousDueDate.getMonth() - 1)

    const totalDays = (nextDueDate - previousDueDate) / (1000 * 60 * 60 * 24)
    const daysElapsed = (today - previousDueDate) / (1000 * 60 * 60 * 24)

    return Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100))
  }

  const handlePayment = (paymentRequest) => {
    console.log("load payment data", paymentRequest)

    // Prepare the request body
    const userId = JSON.parse(localStorage.getItem("userId"))
    const requestBody = {
      propertyId: property._id,
      amount: String(property.rentAmount),
      tenantId: userId,
      status: "paid",
    }

    // Send the payment data to the server
    axios
      .post("http://localhost:5000/api/payRent", requestBody)
      .then((response) => {
        axios
          .post("http://localhost:5000/api/payment", {
            propertyId: property._id,
            amount: property.rentAmount,
            tenantId: userId,
          })
          .then((res) => {
            console.log(" Successfully saved to Blockchain", res.data)
          })
          .catch((err) => {
            console.error("Error saving to Blockchain", err)
          })
        console.log("Order processed successfully", response.data)
      })
      .catch((error) => {
        console.error("Error processing order", error)
      })
  }

  const handleMaintenanceFormChange = (field, value) => {
    setMaintenanceForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const submitMaintenanceRequest = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Here you would normally send the data to your API
       axios.post("http://localhost:5000/api/maintenance", {
        ...maintenanceForm,
        propertyId: property._id,
        tenantId: JSON.parse(localStorage.getItem("userId")),
        
      }).then((res) => {
        console.log("Maintenance request submitted successfully", res.data)
      }).catch((err) => {
        console.error("Error submitting maintenance request", err)
      })


      console.log("Maintenance request submitted:", maintenanceForm)
      setSubmitSuccess(true)

      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setMaintenanceForm({
          title: "",
          category: "",
          description: "",
          urgency: "medium",
        })
        setSubmitSuccess(false)
        setMaintenanceFormOpen(false)
      }, 2000)
    } catch (error) {
      console.error("Error submitting maintenance request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow py-8 pt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your lease and payments</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Current Lease Card */}
            <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-indigo-900">Current Lease</CardTitle>
                    <CardDescription>Your active property lease details</CardDescription>
                  </div>
                  <Home className="h-6 w-6 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <PropertyCard key={property._id} property={property} />
                
              </CardContent>
            </Card>

            {/* Upcoming Rent Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-indigo-900">Upcoming Rent</CardTitle>
                    <CardDescription>Your next payment details</CardDescription>
                  </div>
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* {dueDates && dueDates.length > 0 ? ( */}
                    <>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <div className="text-sm text-gray-500">Next Due Date</div>
                            <div className="font-medium text-lg">{dueDates[0]?.toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Amount</div>
                            <div className="font-medium text-lg text-indigo-700">${property.rentAmount}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Time Remaining</span>
                            <span className="text-indigo-700 font-medium">{timeRemaining}</span>
                          </div>
                          <Progress
                            value={calculateProgressPercentage()}
                            className="h-2 bg-gray-200"
                            indicatorClassName="bg-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="w-full">
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
                              totalPrice: String(property.rentAmount),
                              currencyCode: "INR",
                              countryCode: "IN",
                            },
                          }}
                          onLoadPaymentData={handlePayment}
                        />
                      </div>
                    </>
                  {/* // ) : (
                  //   <div className="text-center py-6">
                  //     <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  //     <p className="text-gray-600">No upcoming due dates</p>
                  //   </div>
                  // )} */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Card className="shadow-sm mb-8">
            <Tabs defaultValue="payments" value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="border-b pb-2">
                <TabsList className="grid grid-cols-3 gap-4">
                  <TabsTrigger
                    value="payments"
                    className={`flex items-center justify-center py-2.5 ${activeTab === "payments" ? "bg-indigo-100 text-indigo-700" : ""}`}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment History
                  </TabsTrigger>
                  <TabsTrigger
                    value="maintenance"
                    className={`flex items-center justify-center py-2.5 ${activeTab === "maintenance" ? "bg-indigo-100 text-indigo-700" : ""}`}
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Maintenance
                  </TabsTrigger>
                  <TabsTrigger
                    value="messages"
                    className={`flex items-center justify-center py-2.5 ${activeTab === "messages" ? "bg-indigo-100 text-indigo-700" : ""}`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="p-0">
                <TabsContent value="payments" className="m-0">
                  <div className="overflow-x-auto">
                    <div className="rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white shadow-sm border border-gray-100 p-2">
                      <table className="w-full rounded-xl overflow-hidden">
                        <thead>
                          <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                            <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-600">Amount</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                              <tr key={transaction._id} className="border-b hover:bg-indigo-50/60 transition-colors">
                                <td className="py-4 px-6">{transaction.date}</td>
                                <td className="py-4 px-6 font-medium">${transaction.amount}</td>
                                <td className="py-4 px-6">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {transaction.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="py-8 text-center text-gray-500">
                                No payment records found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    >
                      View All History
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="maintenance" className="m-0">
                  {submitSuccess ? (
                    <div className="text-center py-16 px-6">
                      <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Request Submitted!</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Your maintenance request has been submitted successfully. We'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-16 px-6">
                      <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Maintenance Requests</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You haven't submitted any maintenance requests yet.
                      </p>
                      <Dialog open={maintenanceFormOpen} onOpenChange={setMaintenanceFormOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Wrench className="mr-2 h-4 w-4" />
                            New Request
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Submit Maintenance Request</DialogTitle>
                            <DialogDescription>
                              Fill out the form below to submit a maintenance request for your property.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={submitMaintenanceRequest} className="space-y-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="title" className="text-sm font-medium">
                                Issue Title
                              </Label>
                              <Input
                                id="title"
                                placeholder="e.g., Leaking Faucet"
                                value={maintenanceForm.title}
                                onChange={(e) => handleMaintenanceFormChange("title", e.target.value)}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="category" className="text-sm font-medium">
                                Category
                              </Label>
                              <Select
                                value={maintenanceForm.category}
                                onValueChange={(value) => handleMaintenanceFormChange("category", value)}
                                required
                              >
                                <SelectTrigger id="category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent
                                className="bg-white/80 backdrop-blur-lg shadow-xl rounded-lg border border-gray-200">
                                  <SelectItem value="plumbing">Plumbing</SelectItem>
                                  <SelectItem value="electrical">Electrical</SelectItem>
                                  <SelectItem value="appliance">Appliance</SelectItem>
                                  <SelectItem value="heating">Heating/Cooling</SelectItem>
                                  <SelectItem value="structural">Structural</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="urgency" className="text-sm font-medium">
                                Urgency Level
                              </Label>
                              <Select
                                value={maintenanceForm.urgency}
                                onValueChange={(value) => handleMaintenanceFormChange("urgency", value)}
                                required
                              >
                                <SelectTrigger id="urgency">
                                  <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/80 backdrop-blur-lg shadow-xl rounded-lg border border-gray-200">
                                  <SelectItem value="low">Low - Can wait</SelectItem>
                                  <SelectItem value="medium">Medium - Needs attention soon</SelectItem>
                                  <SelectItem value="high">High - Urgent issue</SelectItem>
                                  <SelectItem value="emergency">Emergency - Immediate attention needed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="description" className="text-sm font-medium">
                                Description
                              </Label>
                              <Textarea
                                id="description"
                                placeholder="Please describe the issue in detail..."
                                className="min-h-[120px]"
                                value={maintenanceForm.description}
                                onChange={(e) => handleMaintenanceFormChange("description", e.target.value)}
                                required
                              />
                            </div>
                            <DialogFooter className="pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setMaintenanceFormOpen(false)}
                                className="mr-2"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="mr-2">Submitting</span>
                                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                  </>
                                ) : (
                                  "Submit Request"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="messages" className="m-0">
                  <div className="text-center py-16 px-6">
                    <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Messages</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You don't have any messages with your landlord yet.
                    </p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      New Message
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
    </PageTransition>
  )
}

export default TenantDashboard;
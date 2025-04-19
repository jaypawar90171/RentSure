import React, { useEffect } from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { TenantStats } from "../components/dashboard-stats";
import { PropertyCard } from "../components/property-card";
import { WalletConnect } from "../components/wallet-connect";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { ArrowRight, Clock, DollarSign, FileText, MessageSquare, Wrench } from "lucide-react";
import GooglePayButton from '@google-pay/button-react';
import Listings from "./Listings";
import { Link } from "react-router-dom";
import axios from "axios";


const TenantDashboard = () => {
  // const property = {
  //   id: "t1",
  //   name: "Downtown Apartment",
  //   address: {street : "123 Main St, Apt 4B, New York, NY"},
  //   startDate: "2024-01-01",
  //   endDate: "2024-12-31",
  //   rentAmount: 1300,
  //   isAvailable: true,
  //   landlord: { name: "ABC Properties" },
  // };
//   const [properties, setProperties] = React.useState([]);
  const [property , setProperty] = React.useState({})
 useEffect(() => { 
     console.log("Fetching properties...");
     const fetchProperties = async () => {
       try {
         const response = await axios.get("http://localhost:5000/api/properties");
        //  setProperties(response.data);
        const data = {
          name: response.data[0].name,
          address: response.data[0].address,
          propertyType: response.data[0].propertyType,
          propertyArea: response.data[0].propertyArea,
          noOfRooms: response.data[0].noOfRooms,
          landlord: response.data[0].landlord,
          startDate: response.data[0].startDate,
          endDate: response.data[0].endDate,
          rentAmount: response.data[0].rentAmount,
          depositAmount: response.data[0].depositAmount,
          image: response.data[0].image,
          location : response.data[0].location,
        }
        console.log(data);
        // setProperty(data);
         console.log(response.data[0]);
         setProperty(response.data[0]);
       } catch (error) {
         console.error("There was an error fetching the properties!", error);
       }
     };
 
     fetchProperties();
   } , []);

  const payments = [
    { id: 1, date: "Apr 1, 2024", amount: "$1,250.00", status: "Paid" },
    { id: 2, date: "Mar 1, 2024", amount: "$1,250.00", status: "Paid" },
    { id: 3, date: "Feb 1, 2024", amount: "$1,250.00", status: "Paid" },
    { id: 4, date: "Jan 1, 2024", amount: "$1,250.00", status: "Paid" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your lease and payments</p>
            </div>
            <div className="mt-4 md:mt-0">
              
              
            </div>
          </div>

          <div className="mb-8">
            {/* <TenantStats property={property} /> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Lease</CardTitle>
                </CardHeader>
                <CardContent>
                  <PropertyCard key={property._id} property={property} />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Rent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500">Due Date</div>
                        <div className="font-medium">May 1, 2024</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Amount</div>
                        <div className="font-medium">$1,250.00</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Time Remaining</span>
                        <span>15 days</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>

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
                  type: 'CARD',
                  parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                  },
                  tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                      gateway: 'example',
                      gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                  },
                },
              ],
              merchantInfo: {
                merchantId: 'BCR2DN7T5CCLJ3QZ',
                merchantName: 'Dream Developers',
              },
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: property.rentAmount,
                currencyCode: 'INR',
                countryCode: 'IN',
              },
            }}
            onLoadPaymentData={paymentRequest => {
              console.log('load payment data', paymentRequest);

              // const amount = property.rentAmount;
              // Prepare the request body
              const userId = JSON.parse(localStorage.getItem('userId'));
              const requestBody = {
                propertyId: property.id,
                amount: String(property.rentAmount),
                tenantId: userId, 
                status: 'paid',
              };

              // Send the payment data to the server
              axios.post('http://localhost:5000/api/orders', requestBody)
              .then(response => {

                axios.post('http://localhost:5000/api/payments', {propertyId : property.id , amount : property.rentAmount , tenantId : userId} )
                .then(res => { console.log(' Successfully saved to Blockchain', res.data); })  
                .catch(err => { console.error('Error saving to Blockchain', err); });
                console.log('Order processed successfully', response.data);

              })
              .catch(error => { console.error('Error processing order', error);});

              // fetch(ordersEndpoint, {
              //   method: 'POST',
              //   headers: {
              //     'Content-Type': 'application/json',
              //   },
              //   body: JSON.stringify(requestBody),
              // })
              //   .then(response => {
              //     if (response.ok) {
              //       console.log('Order processed successfully');
              //       // navigate('/success', { state: { amount: demoProduct.price } }); // Pass the amount
              //     } else {
              //       console.error('Failed to process order');
              //     }
              //   })
              //   .catch(error => {
              //     console.error('Error processing order', error);
              //   });
            }}

            />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-6">
            <Tabs defaultValue="payments">
              <TabsList className="mb-4">
                <TabsTrigger value="payments">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Payment History
                </TabsTrigger>
                <TabsTrigger value="maintenance">
                  <Wrench className="h-4 w-4 mr-2" />
                  Maintenance
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="payments" className="bg-white p-4 rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{payment.date}</td>
                          <td className="py-3 px-4">{payment.amount}</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" className="text-rentsure-600 hover:text-rentsure-700">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" className="text-rentsure-600">
                    View All History
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="bg-white p-6 rounded-md border">
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Requests</h3>
                  <p className="text-gray-600 mb-4">You haven't submitted any maintenance requests yet.</p>
                  <Button className="bg-rentsure-600 hover:bg-rentsure-700">
                    <Wrench className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="messages" className="bg-white p-6 rounded-md border">
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages</h3>
                  <p className="text-gray-600 mb-4">You don't have any messages with your landlord yet.</p>
                  <Button className="bg-rentsure-600 hover:bg-rentsure-700">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Message
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantDashboard;
// import React, { useContext } from "react";
// import { Button } from "./ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import { Input } from "./ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   CalendarIcon,
//   Home,
//   DollarSign,
//   FileText,
//   MapPin,
//   User,
//   Clock,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { format } from "date-fns";
// import { Calendar } from "./ui/calendar";
// import { cn } from "../lib/utils";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import FormData from "form-data";
// import axios from "axios";
// import MapCom from "./ui/MapCom";
// import {MapLocationContext} from "../context/mapContext";


// const formSchema = z.object({
//   propertyName: z.string().min(3, {
//     message: "Property name must be at least 3 characters.",
//   }),
//   street: z.string().min(5, {
//     message: "Address must be at least 5 characters.",
//   }),
//   city: z.string().min(2, {
//     message: "City is required.",
//   }),
//   state: z.string().min(2, {
//     message: "State is required.",
//   }),
//   zipcode: z.string().min(5, {
//     message: "ZIP code is required.",
//   }),
//   propertyArea: z.string().min(1, { message: "Propert area is required." }),

//   startDate: z.date({
//     required_error: "Start date is required.",
//   }),
//   endDate: z.date({
//     required_error: "End date is required.",
//   }),
//   monthlyRent: z.string().min(1, {
//     message: "Monthly rent is required.",
//   }),
//   securityDeposit: z.string().min(1, {
//     message: "Security deposit is required.",
//   }),
//   noOfRooms: z.string().min(1, {
//     message: "Security deposit is required.",
//   }),
// });

// export function CreatePropertyForm() {
//   const navigate = useNavigate();
//   const [isCreating, setIsCreating] = useState(false);
//   const [file, setFile] = useState();
//   const [myipfsHash, setIPFSHASH] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   const [current, setCurrent] = useState("");
//   const [terms, setTerms] = useState([]);

//   const mapLocationContext = useContext(MapLocationContext);
//   const { location, setLocation } = mapLocationContext;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (current.trim()) {
//       setTerms([...terms, current.trim()]);
//       setCurrent("");
//     }
//   };

//   const removeTerm = (index) => {
//     setTerms(terms.filter((_, i) => i !== index));
//   };

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       propertyName: "",
//       street: "",
//       city: "",
//       state: "",
//       zipcode: "",
//       monthlyRent: "",
//       securityDeposit: "",
//       noOfRooms: "",
//       propertyArea: "", // Ensure this field has a default value
//       startDate: null, // For date fields, use null or a valid default date
//       endDate: null,
//     },
//   });

//   const handleFile = async (fileToHandle) => {
//     console.log("starting");

//     // initialize the form data
//     const formData = new FormData();
//     // append the file form data to
//     formData.append("file", fileToHandle);
//     // call the keys from .env
//     // const pinata_api_key = process.env.PINATA_API_KEY
//     const API_KEY = "20c50cb9f72f9844cdd7"
//     const API_SECRET = "996eebb7c188e46323c78ad75922d17d636350bf37c33e3fbff1bd350f3a9a37"
//     // the endpoint needed to upload the file
//     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//     const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhOGQ3NTMxNy0wMjQwLTQxNTMtYTZhZS0zYWQxNTc4Y2U0N2QiLCJlbWFpbCI6ImFwZzExMTMzMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjBjNTBjYjlmNzJmOTg0NGNkZDciLCJzY29wZWRLZXlTZWNyZXQiOiI5OTZlZWJiN2MxODhlNDYzMjNjNzhhZDc1OTIyZDE3ZDYzNjM1MGJmMzdjMzNlM2ZiZmYxYmQzNTBmM2E5YTM3IiwiZXhwIjoxNzYxMTQxMTk1fQ.9beZK2zfysefAZBKJFUqjB1AxRPAh87eNHJHDjwsGfc`
//     // console.log(import.meta.env.PINATA_API_KEY);
//     axios
//       .post(url, formData, {
//         maxContentLength: "Infinity",
//         headers: {
//           Authorization: `Bearer ${JWT}`,
//           "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
//           pinata_api_key: import.meta.env.API_KEY,
//           pinata_secret_api_key: import.meta.env.API_SECRET,
//         },
//       })
//       .then((response) => {
//         console.log(response.data);
//         const ipfsUrl = response.data.IpfsHash;
//         console.log("https://gateway.pinata.cloud/ipfs/" + ipfsUrl);
//         setIPFSHASH(ipfsUrl);
//       })
//       .catch((error) => {
//         console.error("There was an error!", error);
//       });
 
//   };

//   function onSubmit() {
//     console.log("Form submitted");
//     setIsCreating(true);

//     setTimeout(() => {
//       const userId = JSON.parse(localStorage.getItem("userId"));
//       const data = {
//         propertyName: form.getValues("propertyName"),
//         address: {
//           street: form.getValues("street"),
//           city: form.getValues("city"),
//           state: form.getValues("state"),
//           zipcode: form.getValues("zipcode"),
//         },
//         startDate: form.getValues("startDate"),
//         endDate: form.getValues("endDate"),
//         propertyType: "residential",
//         propertyArea: form.getValues("propertyArea"),
//         noOfRooms: form.getValues("noOfRooms"),
//         landlord: userId,
//         rentAmount: form.getValues("monthlyRent"),
//         depositAmount: form.getValues("securityDeposit"),
//         location : location,
//         image : myipfsHash,
//       };

//       console.log(location);
//       axios
//         .post("http://localhost:5000/api/properties", data)
//         .then((res) => {
//           console.log(res.data);


//           axios.post("http://localhost:5000/api/docs/create", data)
           
//             .then((result) => {
//               console.log("📄 Document created:", result.data.documentId);
//               toast.success("Contract created successfully!");
              
//               axios.post("http://localhost:5000/generate-hash", { documentId : result.data.documentId , propertyId : res.data._id})
//                 .then((response) => { console.log(response.data); 

//                   axios.post("http://localhost:5000/api/agreement" , {propertyId : res.data._id, documentHash : response.data.documentHash})
//                   .then((blockResponse) => { console.log(blockResponse.data); })
//                   .catch( (error) => {console.error("There was an error!", error); });
//                   navigate('/landlord'); // ✅ Go back to landlord dashboard  
//                 })
//                 .catch((error) => { console.error("There was an error!", error); });



//             })
//             .catch((err) => {
//               console.error("Error creating contract:", err);
//               toast.error("Failed to create document");
//             })
//             .finally(() => {
//               setIsCreating(false);
//             });

//         })
//         .catch((error) => {
//           console.error("There was an error!", error);
//         });
//       console.log(data);
//       setIsCreating(false);
//       toast.success("Contract created successfully!");
//       // navigate("/landlord");
//     }, 2000);

  
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-8">
//       <div>
//         <Card className="shadow-lg border-0 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50 border-b">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="bg-cyan-600 text-white p-2 rounded-full">
//                 <FileText className="h-5 w-5" />
//               </div>
//               <CardTitle className="text-2xl font-bold text-cyan-900">
//                 Create New Rental Property
//               </CardTitle>
//             </div>
//             <CardDescription className="text-cyan-700">
//               Enter the details to create a new rental property contract.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-6">
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-8"
//               >
//                 <div className="space-y-6">
//                   <div className="flex items-center gap-2 pb-2 border-b border-cyan-100">
//                     <Home className="h-5 w-5 text-cyan-600" />
//                     <h3 className="text-lg font-semibold text-cyan-900">
//                       Property Information
//                     </h3>
//                   </div>

//                   <FormField
//                     control={form.control}
//                     name="propertyName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-cyan-800 font-medium">
//                           Property Name
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="e.g. Downtown Apartment"
//                             className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage className="text-red-500" />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="street"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-cyan-800 font-medium">
//                           Street Address
//                         </FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 h-4 w-4" />
//                             <Input
//                               placeholder="123 Main St, Apt 4B"
//                               className="pl-10 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                               {...field}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage className="text-red-500" />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="city"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-cyan-800 font-medium">
//                             City
//                           </FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="City"
//                               className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="state"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-cyan-800 font-medium">
//                             State
//                           </FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="border-cyan-200 focus:ring-cyan-500">
//                                 <SelectValue placeholder="Select state" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//   {/* Indian States */}
//                         <SelectItem value="AP">Andhra Pradesh</SelectItem>
//                         <SelectItem value="AR">Arunachal Pradesh</SelectItem>
//                         <SelectItem value="AS">Assam</SelectItem>
//                         <SelectItem value="BR">Bihar</SelectItem>
//                         <SelectItem value="CT">Chhattisgarh</SelectItem>
//                         <SelectItem value="GA">Goa</SelectItem>
//                         <SelectItem value="GJ">Gujarat</SelectItem>
//                         <SelectItem value="HR">Haryana</SelectItem>
//                         <SelectItem value="HP">Himachal Pradesh</SelectItem>
//                         <SelectItem value="JH">Jharkhand</SelectItem>
//                         <SelectItem value="KA">Karnataka</SelectItem>
//                         <SelectItem value="KL">Kerala</SelectItem>
//                         <SelectItem value="MP">Madhya Pradesh</SelectItem>
//                         <SelectItem value="MH">Maharashtra</SelectItem>
//                         <SelectItem value="MN">Manipur</SelectItem>
//                         <SelectItem value="ML">Meghalaya</SelectItem>
//                         <SelectItem value="MZ">Mizoram</SelectItem>
//                         <SelectItem value="NL">Nagaland</SelectItem>
//                         <SelectItem value="OD">Odisha</SelectItem>
//                         <SelectItem value="PB">Punjab</SelectItem>
//                         <SelectItem value="RJ">Rajasthan</SelectItem>
//                         <SelectItem value="SK">Sikkim</SelectItem>
//                         <SelectItem value="TN">Tamil Nadu</SelectItem>
//                         <SelectItem value="TS">Telangana</SelectItem>
//                         <SelectItem value="TR">Tripura</SelectItem>
//                         <SelectItem value="UP">Uttar Pradesh</SelectItem>
//                         <SelectItem value="UK">Uttarakhand</SelectItem>
//                         <SelectItem value="WB">West Bengal</SelectItem>

//                         {/* Union Territories */}
//                         <SelectItem value="AN">Andaman and Nicobar Islands</SelectItem>
//                         <SelectItem value="CH">Chandigarh</SelectItem>
//                         <SelectItem value="DN">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
//                         <SelectItem value="DL">Delhi</SelectItem>
//                         <SelectItem value="JK">Jammu and Kashmir</SelectItem>
//                         <SelectItem value="LA">Ladakh</SelectItem>
//                         <SelectItem value="LD">Lakshadweep</SelectItem>
//                         <SelectItem value="PY">Puducherry</SelectItem>
//                         </SelectContent>

//                           </Select>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="zipcode"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-cyan-800 font-medium">
//                             ZIP Code
//                           </FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="ZIP"
//                               className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-6 pt-4 border-t border-cyan-100">
//                   <div className="flex items-center gap-2 pb-2">
//                     <Clock className="h-5 w-5 text-cyan-600" />
//                     <h3 className="text-lg font-semibold text-cyan-900">
//                       Lease Details
//                     </h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField
//                       control={form.control}
//                       name="startDate"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col">
//                           <FormLabel className="text-cyan-800 font-medium">
//                             Start Date
//                           </FormLabel>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <FormControl>
//                                 <Button
//                                   variant={"outline"}
//                                   className={cn(
//                                     "pl-3 text-left font-normal border-cyan-200 hover:bg-cyan-50 hover:text-cyan-900",
//                                     !field.value && "text-muted-foreground"
//                                   )}
//                                 >
//                                   {field.value ? (
//                                     format(field.value, "PPP")
//                                   ) : (
//                                     <span>Select date</span>
//                                   )}
//                                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                 </Button>
//                               </FormControl>
//                             </PopoverTrigger>
//                             <PopoverContent
//                               className="w-auto p-0"
//                               align="start"
//                             >
//                               <div className="relative">
//                                 <Calendar
//                                   mode="single"
//                                   selected={field.value}
//                                   onSelect={field.onChange}
//                                   disabled={(date) => date < new Date()}
//                                   initialFocus
//                                   className="p-3 pointer-events-auto"
//                                 />
//                               </div>
//                             </PopoverContent>
//                           </Popover>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="endDate"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col">
//                           <FormLabel className="text-cyan-800 font-medium">
//                             End Date
//                           </FormLabel>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <FormControl>
//                                 <Button
//                                   variant={"outline"}
//                                   className={cn(
//                                     "pl-3 text-left font-normal border-cyan-200 hover:bg-cyan-50 hover:text-cyan-900",
//                                     !field.value && "text-muted-foreground"
//                                   )}
//                                 >
//                                   {field.value ? (
//                                     format(field.value, "PPP")
//                                   ) : (
//                                     <span>Select date</span>
//                                   )}
//                                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                 </Button>
//                               </FormControl>
//                             </PopoverTrigger>
//                             <PopoverContent
//                               className="w-auto p-0"
//                               align="start"
//                             >
//                               <Calendar
//                                 mode="single"
//                                 selected={field.value}
//                                 onSelect={field.onChange}
//                                 disabled={(date) => {
//                                   const startDate = form.getValues("startDate");
//                                   return date < (startDate || new Date());
//                                 }}
//                                 initialFocus
//                                 className={cn("p-3 pointer-events-auto")}
//                               />
//                             </PopoverContent>
//                           </Popover>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField
//                       control={form.control}
//                       name="propertyArea"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-cyan-800 font-medium">
//                             Property Area (Sq. Ft.)
//                           </FormLabel>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="0"
//                                 type="number"
//                                 min="0"
//                                 className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                                 {...field}
//                               />
//                               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                                 <span className="text-gray-500 sm:text-sm">
//                                   ft²
//                                 </span>
//                               </div>
//                             </div>
//                           </FormControl>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="noOfRooms"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-cyan-800 font-medium">
//                             No. of Rooms
//                           </FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="0"
//                               type="number"
//                               min="0"
//                               className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField
//                       control={form.control}
//                       name="monthlyRent"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-cyan-800 font-medium">
//                             Monthly Rent ($)
//                           </FormLabel>
//                           <FormControl>
//                             <div className="relative">
//                               <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 h-4 w-4" />
//                               <Input
//                                 placeholder="0"
//                                 type="number"
//                                 min="0"
//                                 className="pl-10 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                                 {...field}
//                               />
//                             </div>
//                           </FormControl>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="securityDeposit"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-cyan-800 font-medium">
//                             Security Deposit ($)
//                           </FormLabel>
//                           <FormControl>
//                             <div className="relative">
//                               <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 h-4 w-4" />
//                               <Input
//                                 placeholder="0"
//                                 type="number"
//                                 min="0"
//                                 className="pl-10 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                                 {...field}
//                               />
//                             </div>
//                           </FormControl>
//                           <FormMessage className="text-red-500" />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* Terms and Conditions Section */}
//                   <div className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-lg shadow-sm border border-cyan-100">
//                     <div className="flex items-center gap-2 mb-4">
//                       <FileText className="h-5 w-5 text-cyan-600" />
//                       <h3 className="text-lg font-semibold text-cyan-900">
//                         Terms & Conditions
//                       </h3>
//                     </div>

//                     <div className="mb-6">
//                       <div className="flex gap-4">
//                         <input
//                           type="text"
//                           value={current}
//                           onChange={(e) => setCurrent(e.target.value)}
//                           placeholder="Enter Terms and Conditions"
//                           className="flex-1 px-4 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                         />

//                         <button
//                           type="button"
//                           onClick={handleSubmit}
//                           disabled={!current.trim()}
//                           className={`px-6 py-2 rounded-lg font-medium ${
//                             current.trim()
//                               ? "bg-cyan-600 text-white hover:bg-cyan-700"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           } transition-colors flex items-center gap-2 shadow-sm`}
//                         >
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 4v16m8-8H4"
//                             />
//                           </svg>
//                           Add Term
//                         </button>
//                       </div>
//                     </div>

//                     {terms.length > 0 && (
//                       <div className="mt-6">
//                         <h3 className="text-md font-semibold mb-4 text-cyan-800">
//                           Added Terms & Conditions
//                         </h3>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {terms.map((term, index) => (
//                             <div
//                               key={index}
//                               className="relative group bg-white p-3 rounded-lg border border-cyan-100 shadow-sm hover:shadow-md transition-shadow"
//                             >
//                               <button
//                                 type="button"
//                                 onClick={() => removeTerm(index)}
//                                 className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
//                               >
//                                 <svg
//                                   className="w-5 h-5"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M6 18L18 6M6 6l12 12"
//                                   />
//                                 </svg>
//                               </button>

//                               <p className="pr-6 text-gray-700 text-sm">
//                                 {term}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <CardFooter className="px-0 pt-6 border-t border-cyan-100 flex justify-end gap-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800"
//                     onClick={() => navigate("/landlord")}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md"
//                     disabled={isCreating}
//                   >
//                     {isCreating ? (
//                       <div className="flex items-center gap-2">
//                         <svg
//                           className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Creating...
//                       </div>
//                     ) : (
//                       "Create Contract"
//                     )}
//                   </Button>
//                 </CardFooter>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="space-y-8">
//         <Card className="shadow-lg border-0 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50 border-b">
//             <div className="flex items-center gap-3">
//               <div className="bg-cyan-600 text-white p-2 rounded-full">
//                 <User className="h-5 w-5" />
//               </div>
//               <CardTitle className="text-xl font-bold text-cyan-900">
//                 Property Documents
//               </CardTitle>
//             </div>
//             <CardDescription className="text-cyan-700">
//               Upload property-related documents and images
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="space-y-6">
//               <div className="bg-cyan-50 border border-dashed border-cyan-200 rounded-lg p-6 text-center">
//                 <input
//                   type="file"
//                   id="file-upload"
//                   className="hidden"
//                   onChange={(event) => setFile(event.target.files[0])}
//                 />
//                 <label
//                   htmlFor="file-upload"
//                   className="cursor-pointer flex flex-col items-center justify-center gap-2"
//                 >
//                   <div className="bg-white p-3 rounded-full">
//                     <svg
//                       className="w-8 h-8 text-cyan-500"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                       />
//                     </svg>
//                   </div>
//                   <div className="text-sm font-medium text-cyan-800">
//                     {file ? file.name : "Click to upload or drag and drop"}
//                   </div>
//                   <p className="text-xs text-cyan-600">
//                     PNG, JPG, PDF up to 10MB
//                   </p>
//                 </label>
//               </div>

//               <Button
//                 onClick={() => handleFile(file)}
//                 disabled={isUploading || !file}
//                 className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-md"
//               >
//                 {isUploading ? (
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Uploading...
//                   </div>
//                 ) : (
//                   "Upload to IPFS"
//                 )}
//               </Button>

//               {myipfsHash && (
//                 <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <svg
//                       className="w-5 h-5 text-green-500"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                     <h4 className="font-medium text-green-800">
//                       File Uploaded Successfully
//                     </h4>
//                   </div>
//                   <a
//                     href={`https://gateway.pinata.cloud/ipfs/${myipfsHash}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-2 mt-2 p-3 bg-white border border-cyan-200 rounded-lg text-cyan-700 hover:bg-cyan-50 transition-colors"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                       />
//                     </svg>
//                     View Uploaded Document
//                   </a>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg border-0 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50 border-b">
//             <div className="flex items-center gap-3">
//               <div className="bg-cyan-600 text-white p-2 rounded-full">
//                 <MapPin className="h-5 w-5" />
//               </div>
//               <CardTitle className="text-xl font-bold text-cyan-900">
//                 Property Location
//               </CardTitle>
//             </div>
//             <CardDescription className="text-cyan-700">
//               View the property location on the map
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="bg-gray-100 rounded-lg h-100 flex items-center justify-center">
//               <MapCom />
//               <div className="text-center text-gray-500">
//                 <MapPin className="h-10 w-10 mx-auto mb-2 text-cyan-500" />
//                 <p>Map will be displayed here</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



  
  
import React, { useContext } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Home,
  DollarSign,
  FileText,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { cn } from "../lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import FormData from "form-data";
import axios from "axios";
import MapCom from "./ui/MapCom";
import {MapLocationContext} from "../context/mapContext";


const formSchema = z.object({
  propertyName: z.string().min(3, {
    message: "Property name must be at least 3 characters.",
  }),
  street: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zipcode: z.string().min(5, {
    message: "ZIP code is required.",
  }),
  propertyArea: z.string().min(1, { message: "Propert area is required." }),

  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  monthlyRent: z.string().min(1, {
    message: "Monthly rent is required.",
  }),
  securityDeposit: z.string().min(1, {
    message: "Security deposit is required.",
  }),
  noOfRooms: z.string().min(1, {
    message: "Security deposit is required.",
  }),
});

export function CreatePropertyForm() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [file, setFile] = useState();
  const [myipfsHash, setIPFSHASH] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [current, setCurrent] = useState("");
  const [terms, setTerms] = useState([]);

  const mapLocationContext = useContext(MapLocationContext);
  const { location, setLocation } = mapLocationContext;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (current.trim()) {
      setTerms([...terms, current.trim()]);
      setCurrent("");
    }
  };

  const removeTerm = (index) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      monthlyRent: "",
      securityDeposit: "",
      noOfRooms: "",
      propertyArea: "", // Ensure this field has a default value
      startDate: null, // For date fields, use null or a valid default date
      endDate: null,
    },
  });

  const handleFile = async (fileToHandle) => {
    console.log("starting");

    // initialize the form data
    const formData = new FormData();
    // append the file form data to
    formData.append("file", fileToHandle);
    // call the keys from .env
    // const pinata_api_key = process.env.PINATA_API_KEY
    const API_KEY = "20c50cb9f72f9844cdd7"
    const API_SECRET = "996eebb7c188e46323c78ad75922d17d636350bf37c33e3fbff1bd350f3a9a37"
    // the endpoint needed to upload the file
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhOGQ3NTMxNy0wMjQwLTQxNTMtYTZhZS0zYWQxNTc4Y2U0N2QiLCJlbWFpbCI6ImFwZzExMTMzMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjBjNTBjYjlmNzJmOTg0NGNkZDciLCJzY29wZWRLZXlTZWNyZXQiOiI5OTZlZWJiN2MxODhlNDYzMjNjNzhhZDc1OTIyZDE3ZDYzNjM1MGJmMzdjMzNlM2ZiZmYxYmQzNTBmM2E5YTM3IiwiZXhwIjoxNzYxMTQxMTk1fQ.9beZK2zfysefAZBKJFUqjB1AxRPAh87eNHJHDjwsGfc`
    // console.log(import.meta.env.PINATA_API_KEY);
    axios
      .post(url, formData, {
        maxContentLength: "Infinity",
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
          pinata_api_key: import.meta.env.API_KEY,
          pinata_secret_api_key: import.meta.env.API_SECRET,
        },
      })
      .then((response) => {
        console.log(response.data);
        const ipfsUrl = response.data.IpfsHash;
        console.log("https://gateway.pinata.cloud/ipfs/" + ipfsUrl);
        setIPFSHASH(ipfsUrl);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
 
  };

  function onSubmit() {
    console.log("Form submitted");
    setIsCreating(true);

    setTimeout(() => {
      const userId = JSON.parse(localStorage.getItem("userId"));
      const data = {
        propertyName: form.getValues("propertyName"),
        address: {
          street: form.getValues("street"),
          city: form.getValues("city"),
          state: form.getValues("state"),
          zipcode: form.getValues("zipcode"),
        },
        startDate: form.getValues("startDate"),
        endDate: form.getValues("endDate"),
        propertyType: "residential",
        propertyArea: form.getValues("propertyArea"),
        noOfRooms: form.getValues("noOfRooms"),
        landlord: userId,
        rentAmount: form.getValues("monthlyRent"),
        depositAmount: form.getValues("securityDeposit"),
        location : location,
        image : myipfsHash,
      };

      console.log(location);
      axios
        .post("http://localhost:5000/api/properties", data)
        .then((res) => {
          console.log(res.data);


          axios.post("http://localhost:5000/api/docs/create", data)
           
            .then((result) => {
              console.log("📄 Document created:", result.data.documentId);
              toast.success("Contract created successfully!");

              axios.post("http://localhost:5000/generate-hash", { documentId : result.data.documentId , propertyId : res.data._id})
                .then((response) => { console.log(response.data); 

                  axios.post("http://localhost:5000/api/agreement" , {propertyId : res.data._id, documentHash : response.data.documentHash})
                  .then((blockResponse) => { console.log(blockResponse.data); })
                  .catch( (error) => {console.error("There was an error!", error); });
                  navigate('/landlord'); // ✅ Go back to landlord dashboard  
                })
                .catch((error) => { console.error("There was an error!", error); });



            })
            .catch((err) => {
              console.error("Error creating contract:", err);
              toast.error("Failed to create document");
            })
            .finally(() => {
              setIsCreating(false);
            });

        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
      console.log(data);
      setIsCreating(false);
      toast.success("Contract created successfully!");
      // navigate("/landlord");
    }, 2000);

  
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-8">
      <div>
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 text-white p-2 rounded-full">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-indigo-900">
                Create New Rental Property
              </CardTitle>
            </div>
            <CardDescription className="text-indigo-700">
              Enter the details to create a new rental property contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-indigo-100">
                    <Home className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-indigo-900">
                      Property Information
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="propertyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-800 font-medium">
                          Property Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Downtown Apartment"
                            className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-800 font-medium">
                          Street Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 h-4 w-4" />
                            <Input
                              placeholder="123 Main St, Apt 4B"
                              className="pl-10 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-indigo-800 font-medium">
                            City
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City"
                              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-indigo-800 font-medium">
                            State
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-indigo-200 focus:ring-indigo-500">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
  {/* Indian States */}
                        <SelectItem value="AP">Andhra Pradesh</SelectItem>
                        <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                        <SelectItem value="AS">Assam</SelectItem>
                        <SelectItem value="BR">Bihar</SelectItem>
                        <SelectItem value="CT">Chhattisgarh</SelectItem>
                        <SelectItem value="GA">Goa</SelectItem>
                        <SelectItem value="GJ">Gujarat</SelectItem>
                        <SelectItem value="HR">Haryana</SelectItem>
                        <SelectItem value="HP">Himachal Pradesh</SelectItem>
                        <SelectItem value="JH">Jharkhand</SelectItem>
                        <SelectItem value="KA">Karnataka</SelectItem>
                        <SelectItem value="KL">Kerala</SelectItem>
                        <SelectItem value="MP">Madhya Pradesh</SelectItem>
                        <SelectItem value="MH">Maharashtra</SelectItem>
                        <SelectItem value="MN">Manipur</SelectItem>
                        <SelectItem value="ML">Meghalaya</SelectItem>
                        <SelectItem value="MZ">Mizoram</SelectItem>
                        <SelectItem value="NL">Nagaland</SelectItem>
                        <SelectItem value="OD">Odisha</SelectItem>
                        <SelectItem value="PB">Punjab</SelectItem>
                        <SelectItem value="RJ">Rajasthan</SelectItem>
                        <SelectItem value="SK">Sikkim</SelectItem>
                        <SelectItem value="TN">Tamil Nadu</SelectItem>
                        <SelectItem value="TS">Telangana</SelectItem>
                        <SelectItem value="TR">Tripura</SelectItem>
                        <SelectItem value="UP">Uttar Pradesh</SelectItem>
                        <SelectItem value="UK">Uttarakhand</SelectItem>
                        <SelectItem value="WB">West Bengal</SelectItem>

                        {/* Union Territories */}
                        <SelectItem value="AN">Andaman and Nicobar Islands</SelectItem>
                        <SelectItem value="CH">Chandigarh</SelectItem>
                        <SelectItem value="DN">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                        <SelectItem value="DL">Delhi</SelectItem>
                        <SelectItem value="JK">Jammu and Kashmir</SelectItem>
                        <SelectItem value="LA">Ladakh</SelectItem>
                        <SelectItem value="LD">Lakshadweep</SelectItem>
                        <SelectItem value="PY">Puducherry</SelectItem>
                        </SelectContent>

                          </Select>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-indigo-800 font-medium">
                            ZIP Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ZIP"
                              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-indigo-100">
                  <div className="flex items-center gap-2 pb-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-indigo-900">
                      Lease Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-indigo-800 font-medium">
                            Start Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal border-indigo-200 hover:bg-indigo-50 hover:text-indigo-900",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <div className="relative">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-indigo-800 font-medium">
                            End Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal border-indigo-200 hover:bg-indigo-50 hover:text-indigo-900",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate = form.getValues("startDate");
                                  return date < (startDate || new Date());
                                }}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="propertyArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-indigo-800 font-medium">
                            Property Area (Sq. Ft.)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="0"
                                type="number"
                                min="0"
                                className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                {...field}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  ft²
                                </span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="noOfRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-indigo-800 font-medium">
                            No. of Rooms
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0"
                              type="number"
                              min="0"
                              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="monthlyRent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-indigo-800 font-medium">
                            Monthly Rent ($)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 h-4 w-4" />
                              <Input
                                placeholder="0"
                                type="number"
                                min="0"
                                className="pl-10 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="securityDeposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-indigo-800 font-medium">
                            Security Deposit ($)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 h-4 w-4" />
                              <Input
                                placeholder="0"
                                type="number"
                                min="0"
                                className="pl-10 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Terms and Conditions Section */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-100">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-indigo-900">
                        Terms & Conditions
                      </h3>
                    </div>

                    <div className="mb-6">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={current}
                          onChange={(e) => setCurrent(e.target.value)}
                          placeholder="Enter Terms and Conditions"
                          className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!current.trim()}
                          className={`px-6 py-2 rounded-lg font-medium ${
                            current.trim()
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          } transition-colors flex items-center gap-2 shadow-sm`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add Term
                        </button>
                      </div>
                    </div>

                    {terms.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-md font-semibold mb-4 text-indigo-800">
                          Added Terms & Conditions
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {terms.map((term, index) => (
                            <div
                              key={index}
                              className="relative group bg-white p-3 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <button
                                type="button"
                                onClick={() => removeTerm(index)}
                                className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>

                              <p className="pr-6 text-gray-700 text-sm">
                                {term}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <CardFooter className="px-0 pt-6 border-t border-indigo-100 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                    onClick={() => navigate("/landlord")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      "Create Contract"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-full">
                <User className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-indigo-900">
                Property Documents
              </CardTitle>
            </div>
            <CardDescription className="text-indigo-700">
              Upload property-related documents and images
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(event) => setFile(event.target.files[0])}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="bg-white p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="text-sm font-medium text-indigo-800">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </div>
                  <p className="text-xs text-indigo-600">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </label>
              </div>

              <Button
                onClick={() => handleFile(file)}
                disabled={isUploading || !file}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  "Upload to IPFS"
                )}
              </Button>

              {myipfsHash && (
                <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <h4 className="font-medium text-green-800">
                      File Uploaded Successfully
                    </h4>
                  </div>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${myipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-2 p-3 bg-white border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Uploaded Document
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-full">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-indigo-900">
                Property Location
              </CardTitle>
            </div>
            <CardDescription className="text-indigo-700">
              View the property location on the map
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-100 rounded-lg h-100 flex items-center justify-center">
              <MapCom />
              <div className="text-center text-gray-500">
                <MapPin className="h-10 w-10 mx-auto mb-2 text-indigo-500" />
                <p>Map will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
  
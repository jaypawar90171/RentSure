import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import { cn } from "../lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import FormData from "form-data";
import axios from "axios";

const formSchema = z.object({
  propertyName: z.string().min(3, {
    message: "Property name must be at least 3 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zip: z.string().min(5, {
    message: "ZIP code is required.",
  }),
  tenantEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
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
  description: z.string().optional(),
});

export function CreateContractForm() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [file, setFile] = useState();
  const [myipfsHash, setIPFSHASH] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      tenantEmail: "",
      monthlyRent: "",
      securityDeposit: "",
      description: "",
    },
  });

  const handleFile = async (fileToHandle) => {
    console.log("starting");

    // initialize the form data
    const formData = new FormData();

    // append the file form data to
    formData.append("file", fileToHandle);

    // call the keys from .env

    const API_KEY = "20c50cb9f72f9844cdd7";
    const API_SECRET =
      "996eebb7c188e46323c78ad75922d17d636350bf37c33e3fbff1bd350f3a9a37";

    // the endpoint needed to upload the file
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhOGQ3NTMxNy0wMjQwLTQxNTMtYTZhZS0zYWQxNTc4Y2U0N2QiLCJlbWFpbCI6ImFwZzExMTMzMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjBjNTBjYjlmNzJmOTg0NGNkZDciLCJzY29wZWRLZXlTZWNyZXQiOiI5OTZlZWJiN2MxODhlNDYzMjNjNzhhZDc1OTIyZDE3ZDYzNjM1MGJmMzdjMzNlM2ZiZmYxYmQzNTBmM2E5YTM3IiwiZXhwIjoxNzYxMTQxMTk1fQ.9beZK2zfysefAZBKJFUqjB1AxRPAh87eNHJHDjwsGfc`;
    const response = await axios.post(url, formData, {
      maxContentLength: "Infinity",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRET,
      },
    });

    console.log(response);

    // get the hash
    const ipfsUrl = response.data.IpfsHash;
    console.log("https://gateway.pinata.cloud/ipfs/" + ipfsUrl);
    setIPFSHASH(ipfsUrl);
  };

  function onSubmit(values) {
    setIsCreating(true);
    
    setTimeout(() => {
      const userId = JSON.parse(localStorage.getItem("userId"));
      const data = {
        name: "New Propert",
        address: {
          street: "line1",
          city: "kolhapiur",
          state: "maharastra",
          zip: "416004",
        },
        propertyType: "residential",
        propertyArea: 1000,
        noOfRooms: 4,
        landlord: userId,
      };
      
      // axios
      //   .post("http://localhost:5000/api/properties", data)
      //   .then((response) => {
      //     console.log(response.data);
      //   })
      //   .catch((error) => {
      //     console.error("There was an error!", error);
      //   });

      console.log(userId);
      setIsCreating(false);
      toast.success("Contract created successfully!");
      // navigate("/landlord");
    }, 2000);
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Rental Contract</CardTitle>
        <CardDescription>
          Enter the details below to create a new smart contract for your rental
          property.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Property Information</h3>

              <FormField
                control={form.control}
                name="propertyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Downtown Apartment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Apt 4B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel> 
                      <FormControl>
                        <Input placeholder="ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Lease Information</h3>

              <FormField
                control={form.control}
                name="tenantEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tenant@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The tenant will receive an invitation to sign the
                      contract.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
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
                        <PopoverContent className="w-auto p-0" align="start">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Area (Sq. Ft.)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. of Rooms</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="monthlyRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent ($)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit ($)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Terms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional terms or information about the property..."
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">File Upload</h3>
              <input
                type="file"
                onChange={(event) => setFile(event.target.files[0])}
              />
              <Button onClick={() => handleFile(file)} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Pin"}
              </Button>
              {myipfsHash && (
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${myipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Image
                </a>
              )}
            </div>

            <CardFooter className="px-0 pt-4 border-t flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate("/landlord")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-rentsure-600 hover:bg-rentsure-700"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Contract"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

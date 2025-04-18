import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {Button} from "../components/ui/button";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import { useNavigate } from "react-router-dom";

export default function RegisterTenant() {
  const Navigate = useNavigate();
  // const name = useStat('');
   const[formData, setFormData] = useState({    
    name: "",
    mobile: "",
    upiId: ""
  })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        }
    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission logic here
        console.log(formData)
        Navigate('/tenant')
    }


  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Landlord</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name:</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile:</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI Id:</Label>
              <Input
                id="upiId"
                name="upiId"
                type="text"
                value={formData.upiId}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded"
              />
            </div>
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="outline" 
                className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                SUBMIT
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 




 

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import SignatureCanvas from "react-signature-canvas"
import { PlusCircle, X, Save, RefreshCw, Download, Clock } from "lucide-react"

export default function RegisterLandlord() {
  const Navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    upiId: "",
  })
  const sigRef = useRef()
  const [isSigned, setIsSigned] = useState(false)
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState("")
  const [terms, setTerms] = useState([])
  const [activeSection, setActiveSection] = useState("registration") // 'registration', 'signature', 'terms'

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)

    const userInfo = JSON.parse(localStorage.getItem("user-info") );

    const data = {
      "email" : userInfo.email,
      "name" : formData.name,
      "phone" : formData.mobile, 
      "upiDetails" :  {
        "upiId" : formData.upiId,
        "name" : formData.name
      }
    }
    console.log(userInfo.email)
    axios.post("http://localhost:5000/api/tenants", data)
    .then((response) => {
      localStorage.setItem("userId", JSON.stringify(response.data._id))
      console.log(response.data);
      setActiveSection('signature')
      // Navigate('/tenant')
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
    // Navigate('/tenant')
}


  const removeTerm = (index) => {
    setTerms(terms.filter((_, i) => i !== index))
  }

  const saveHandler = async () => {
    if (!sigRef.current.isEmpty()) {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("user-info") );

    const data = {
      "email" : userInfo.email,
      "name" : formData.name,
      "phone" : formData.mobile, 
      "upiDetails" :  {
        "upiId" : formData.upiId,
        "name" : formData.name
      }
    }
    console.log(userInfo.email)
    axios.post("http://localhost:5000/api/tenants", data)
    .then((response) => {
      localStorage.setItem("userId", JSON.stringify(response.data._id))
      console.log(response.data);
      Navigate('/tenant')
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
      const userId = JSON.parse(localStorage.getItem("userId"));
      const signatureData = {  userId : userId, signatureImage : sigRef.current.toDataURL('image/png') };
        // const signatureData = sigRef.current.toDataURL('image/png');

        // Save to backend
        await axios.post('http://localhost:5000/api/signatures', signatureData)
        .then((response) => {
          console.log(response.data);
          setSignatures([response.data, ...signatures]);
          alert('Signature saved to database!'); })
          .catch((error) => { console.error("There was an error!", error); });
        // const response = await axios.post('http://localhost:5000/api/signatures', {
        //   signatureData,
        // });

        // Add to local state
        // setSignatures([response.data, ...signatures]);
        // alert('Signature saved to database!');
      } catch (error) {
        console.error('Save failed:', error.response?.data || error.message);
        alert('Error saving signature');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please provide a signature before saving.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/signatures/");
      // Ensure the response is an array
      setSignatures(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Error fetching signatures");
    } finally {
      setLoading(false);
    }
  };

  const clearHandler = () => {
    sigRef.current.clear()
    setIsSigned(false)
  }

  // const handleSubmit2 = (e) => {
  //   e.preventDefault()
  //   // ... existing submit logic ...
  //   setActiveSection("signature")
  // }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Card */}
        <div
          className={`transition-all duration-300 ${activeSection === "registration" ? "scale-100 opacity-100" : "scale-95 opacity-70"}`}
        >
          <Card className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-0">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-violet-600 pb-6 pt-8">
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex space-x-1">
                  {["registration", "signature", "terms"].map((section, index) => (
                    <div
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`w-2 h-2 rounded-full cursor-pointer ${activeSection === section ? "bg-white" : "bg-white/50"}`}
                    ></div>
                  ))}
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white text-center">Tenant Registration</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2"></span>
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2"></span>
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      pattern="[0-9]*"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiId" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600 mr-2"></span>
                    UPI ID
                  </Label>
                  <Input
                    id="upiId"
                    name="upiId"
                    type="text"
                    placeholder="yourname@upi"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    onClick={() => setActiveSection("signature")}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:translate-y-[-2px] shadow-lg hover:shadow-purple-500/20"
                  >
                    Continue to Signature
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Signature & Terms Section */}
        <div className="space-y-6">
          {/* Signature Manager */}
          <div
            className={`transition-all duration-300 ${activeSection === "signature" ? "scale-100 opacity-100" : "scale-95 opacity-70"}`}
          >
            <Card className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-0">
              <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 pb-6 pt-8">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex space-x-1">
                    {["registration", "signature", "terms"].map((section, index) => (
                      <div
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`w-2 h-2 rounded-full cursor-pointer ${activeSection === section ? "bg-white" : "bg-white/50"}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white text-center">Signature Manager</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Signature Canvas */}
                <div className="mb-6 border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="text-center text-gray-500 text-sm mb-2">
                    Sign below using your mouse or touch screen
                  </div>
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="#6d28d9"
                    canvasProps={{
                      width: 500,
                      height: 200,
                      className: "sigCanvas w-full rounded-md",
                      style: {
                        background: "white",
                        border: "1px solid #e5e7eb",
                      },
                    }}
                    backgroundColor="rgba(255,255,255,1)"
                    onEnd={() => setIsSigned(!sigRef.current.isEmpty())}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Button
                    onClick={saveHandler}
                    disabled={!isSigned || loading}
                    className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 ${
                      isSigned && !loading
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    } transition-all duration-200 shadow-md hover:shadow-lg`}
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Signature"}
                  </Button>

                  <Button
                    onClick={clearHandler}
                    className="px-6 py-2.5 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear
                  </Button>
                </div>

                {/* Fetch Signatures Button */}
                <div className="text-center mb-6">
                  <Button
                    onClick={fetchSignatures}
                    className="px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Load Saved Signatures
                      </>
                    )}
                  </Button>
                </div>

                {/* Display Stored Signatures */}
                {signatures.length > 0 && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-violet-600" />
                      Saved Signatures
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {signatures.map((sig, index) => (
                        <div
                          key={sig._id || index} // Use _id if available, otherwise fallback to index
                          className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div>
                            <img
                              src={sig.signatureData || "/placeholder.svg"} // Fallback to a placeholder image
                              alt="Saved signature"
                              className="mx-auto"
                              style={{ maxWidth: "100%", height: "80px", objectFit: "contain" }}
                            />
                          </div>
                          <p className="text-xs text-center mt-2 text-gray-500">
                            {sig.createdAt
                              ? new Date(sig.createdAt).toLocaleDateString()
                              : "Unknown Date"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={() => setActiveSection("registration")}
                    variant="outline"
                    className="px-5 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => Navigate("/tenant")}
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terms and Conditions */}
          {/* <div
            className={`transition-all duration-300 ${activeSection === "terms" ? "scale-100 opacity-100" : "scale-95 opacity-70"}`}
          >
            <Card className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 pb-6 pt-8">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex space-x-1">
                    {["registration", "signature", "terms"].map((section, index) => (
                      <div
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`w-2 h-2 rounded-full cursor-pointer ${activeSection === section ? "bg-white" : "bg-white/50"}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white text-center">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      type="text"
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      placeholder="Enter Terms and Conditions"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Button
                      type="submit"
                      disabled={!current.trim()}
                      className={`px-6 py-2.5 rounded-lg font-medium ${
                        current.trim()
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      } transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap`}
                    >
                      <PlusCircle className="w-5 h-5" />
                      Add Term
                    </Button>
                  </div>
                </form>

                {terms.length > 0 ? (
                  <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Terms & Conditions</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {terms.map((term, index) => (
                        <div
                          key={index} // Use index as the key for simple strings
                          className="relative group bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <button
                            type="button"
                            onClick={() => removeTerm(index)}
                            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Remove term"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <p className="pr-8 text-gray-700">{term}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100 text-center text-gray-500">
                    No terms added yet. Add your first term above.
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={() => setActiveSection("signature")}
                    variant="outline"
                    className="px-5 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                  >
                    Complete Registration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    // </div>
  )
}
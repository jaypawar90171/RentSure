
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import SignatureCanvas from "react-signature-canvas"
import { PlusCircle, X, Save, RefreshCw, Download, Clock } from "lucide-react"
// import { set } from "mongoose"
import { FiUser, FiPhone, FiCreditCard, FiSave, FiRefreshCw, FiUpload } from "react-icons/fi"
import PageTransition from "./PageTransition"

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
  const sigCanvas = useRef({})
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    setActiveSection("signature")
    // console.log(formData)

    // const userInfo = JSON.parse(localStorage.getItem("user-info") );

    // const data = {
    //   "email" : userInfo.email,
    //   "name" : formData.name,
    //   "phone" : formData.mobile, 
    //   "upiDetails" :  {
    //     "upiId" : formData.upiId,
    //     "name" : formData.name
    //   }
    // }
    // console.log(userInfo.email)
    // axios.post("http://localhost:5000/api/tenants", data)
    // .then((response) => {
    //   localStorage.setItem("userId", JSON.stringify(response.data._id))
    //   console.log(response.data);
    //   setActiveSection('signature')
    //   // Navigate('/tenant')
    // })
    // .catch((error) => {
    //   console.error("There was an error!", error);
    // });
    // Navigate('/tenant')
}



const handleClear = () => {
  sigCanvas.current.clear()
  setIsSigned(false)
}

const handleSaveSignature = async () => {
  if (sigCanvas.current.isEmpty()) {
    alert("Please provide a signature first")
    return
  }
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
  const signatureData = {  userId : userId, signatureImage : sigCanvas.current.toDataURL('image/png') };
    // const signatureData = sigRef.current.toDataURL('image/png');

    // Save to backend
    await axios.post('http://localhost:5000/api/signatures', signatureData)
    .then((response) => {
      console.log(response.data);
      setSignatures([response.data, ...signatures]);
      alert('Signature saved to database!'); })
      .catch((error) => { console.error("There was an error!", error); });
   
      console.log("Signature saved:", sigCanvas.current.toDataURL())
  setIsSigned(true)
  } catch (error) {
    console.error('Save failed:', error.response?.data || error.message);
    alert('Error saving signature');
  } finally {
    setLoading(false);
  }
  // Save signature logic would go here
  
}

const handleLoadSignatures = () => {
  // Load saved signatures logic would go here
  // console.log("Loading saved signatures")
  fetchSignatures()
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
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
    <PageTransition>
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 relative">
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="absolute top-4 right-4 flex space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
          </div>
          <h1 className="text-white text-center text-2xl font-bold mt-2">Registration</h1>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span className="text-purple-600 mr-1">•</span> Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span className="text-purple-600 mr-1">•</span> Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="123456789"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* UPI ID */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <span className="text-purple-600 mr-1">•</span> UPI ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="upiId"
                placeholder="yourname@upi"
                value={formData.upiId}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Signature Area */}
          <div className="mt-6">
            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <p className="text-center text-sm text-gray-500 mb-3">Sign below using your mouse or touch screen</p>
              <div className="border rounded-lg bg-white overflow-hidden">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    className: "w-full h-40",
                  }}
                  onEnd={() => setIsSigned(true)}
                />
              </div>

              <div className="flex mt-4 space-x-3">
                <button
                  onClick={handleSaveSignature}
                  className={`flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${!isSigned ? "opacity-90" : ""}`}
                >
                  <FiSave className="mr-2" />
                  Save Signature
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <FiRefreshCw className="mr-2" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Load Saved Signatures */}
          <div className="flex justify-center mt-6">
            <button
              onClick={Navigate('/tenant')}
              className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md"
            >
              <FiUpload className="mr-2" />
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  )
}
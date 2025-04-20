"use client"

import { useEffect } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { googleAuth } from "../api"
import { Button } from "../components/ui/button"
import axios from 'axios';
const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, redirect to home
    const data = localStorage.getItem("user-info")
    if (data) {
      navigate("/")
    }
  }, [navigate])

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"])
        const { email, name, image } = result.data.user
        const token = result.data.token

        // Save token and user info
        const obj = { email, name, image, token }
        localStorage.setItem("user-info", JSON.stringify(obj))
        localStorage.setItem("token", token)

        // Navigate to home after successful login

        axios.post("http://localhost:5000/api/haveAccount", { email : email })
        .then((response) => {
          console.log(response.data);
          if (response.data.haveAccount) {
            localStorage.setItem("userId", JSON.stringify(response.data.user[0].userId))
            if(response.data.user[0].role === "landlord") { 
              navigate("/landlord")
            }else{
              navigate("/tenant")
            }
            console.log("User ID:", response.data.user[0].role)
            console.log(response.data.user[0].userId)
          } else {
            navigate("/roleCard")
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
        // navigate("/roleCard")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => console.log("Login Failed:", error),
    flow: "auth-code",
  })

  // Automatically trigger Google login when component mounts
  useEffect(() => {
    googleLogin()
  }, [googleLogin])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">RentSure</h1>
          <p className="text-blue-100 text-sm">Secure property management</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to continue to your account</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center h-20 w-20 mx-auto bg-blue-50 rounded-full mb-4">
              <svg
                className="h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <div className="text-center mb-4">
              <p className="text-gray-600">Redirecting to Google login...</p>
            </div>

            <Button
              onClick={() => googleLogin()}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 shadow-sm flex items-center justify-center gap-3 transition-all duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Click here if not redirected
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure login
            </div>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Need help?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

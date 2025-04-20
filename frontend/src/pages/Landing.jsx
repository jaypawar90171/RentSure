
import  Navbar  from "../components/navbar"
import  HeroSection  from "../components/hero-section"
import  HowItWorks from "../components/how-it-works"
import  Testimonials  from "../components/testimonials"
import  Footer  from "../components/footer"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PageTransition from "./PageTransition"
const Landing = () => {
  const [userInfo, setUserInfo] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem("user-info")
    const userData = JSON.parse(data)
    setUserInfo(userData)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user-info")
    navigate("/login")
  }

  return (
    <PageTransition>

    
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
    </PageTransition>
  )
}

export default Landing
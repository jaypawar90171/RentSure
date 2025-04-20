"use client"

import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Star, Quote } from "lucide-react"
import { useState } from "react"

export default function Testimonials() {
  // For hover state tracking
  const [hoveredCard, setHoveredCard] = useState(null)

  const testimonials = [
    {
      quote:
        "As a landlord with multiple properties, RentSure has been a game-changer. I've reduced paperwork and tenant disputes significantly.",
      author: "Michael K.",
      role: "Landlord in Seattle",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50",
      icon: <Quote className="h-8 w-8 text-indigo-200" />,
    },
    {
      quote:
        "I love the transparency. I can see my payment history, maintenance requests, and my lease details all in one place.",
      author: "Jennifer T.",
      role: "Tenant in Chicago",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      icon: <Quote className="h-8 w-8 text-purple-200" />,
    },
    {
      quote:
        "The automated payments feature has eliminated late rent completely. My tenants appreciate the reminders and easy payment options.",
      author: "Robert L.",
      role: "Property Manager",
      gradient: "from-teal-500 to-emerald-500",
      bgGradient: "from-teal-50 to-emerald-50",
      icon: <Quote className="h-8 w-8 text-teal-200" />,
    },
  ]

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20 relative overflow-hidden">
      {/* Abstract shapes in background */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-indigo-100 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-100 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
            Client Stories
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Landlords and Tenants</h2>
          <p className="text-lg text-gray-600">
            Hear from our users who have simplified their rental process with RentSure.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-md rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="pt-8 pb-6 relative">
                {/* Decorative quote icon */}
                <div className="absolute top-4 right-4 opacity-70">{testimonial.icon}</div>

                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient}`}></div>

                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 5 ? "fill-current" : ""} transition-transform duration-300 ${
                        hoveredCard === index ? "scale-110" : ""
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.quote}</p>
              </CardContent>
              <CardFooter
                className={`border-t py-4 px-6 bg-gradient-to-r ${testimonial.bgGradient} text-gray-700 font-medium`}
              >
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View more testimonials button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300 group">
            View more testimonials
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
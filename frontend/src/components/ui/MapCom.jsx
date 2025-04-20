"use client"

import { useState, useCallback, useRef, useContext } from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import { MapLocationContext } from "../../context/mapContext" // Adjust the import path as necessary

const containerStyle = {
  width: "145%",
  height: "500px",
}

const defaultCenter = {
  lat: 16.742097,
  lng: 74.382243,
}

function MapComponent({ latitude, longitude }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDg1yoMJgRyxUztn9cjDj_Or_jz4lFpmjk", // Use environment variable
    libraries: ["places"], // Include the Places library
  })

  const [map, setMap] = useState(null)
  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude
      ? {
          lat: Number.parseFloat(latitude),
          lng: Number.parseFloat(longitude),
        }
      : defaultCenter,
  )
  const searchInputRef = useRef(null)
  const mapLocationContext = useContext(MapLocationContext)

  const { setLocation } = mapLocationContext || {} // Destructure setLocation from context safely

  const onLoad = useCallback((map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
    if (setLocation) {
      setLocation({ latitude: newPosition.lat, longitude: newPosition.lng })
    }
    setMarkerPosition(newPosition)
    console.log("Selected Location (by map click):", newPosition)
  }

  const handleSearch = () => {
    if (!searchInputRef.current) return

    const searchInput = searchInputRef.current.value.trim()
    if (!searchInput) {
      alert("Please enter a location to search.")
      return
    }

    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location
        const newPosition = {
          lat: location.lat(),
          lng: location.lng(),
        }
        if (setLocation) {
          setLocation({ latitude: newPosition.lat, longitude: newPosition.lng })
        }
        setMarkerPosition(newPosition)
        map.panTo(location)
        console.log("Selected Location (by search):", newPosition)
      } else {
        alert("Location not found! Please try again.")
      }
    })
  }

  return isLoaded ? (
    <div className="map-container">
      <div className="pb-4 flex items-center gap-2">
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search for a location"
          className="w-72 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
      <div className="mr-2">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={17}
          mapTypeId="satellite"
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
}

export default MapComponent

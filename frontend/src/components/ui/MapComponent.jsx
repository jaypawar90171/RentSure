import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function MapComponent({ latitude, longitude }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDg1yoMJgRyxUztn9cjDj_Or_jz4lFpmjk", // Replace with your API key
  });

  const center = {
    lat: latitude,
    lng: longitude,
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={17}
      mapTypeId="satellite"
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default MapComponent;
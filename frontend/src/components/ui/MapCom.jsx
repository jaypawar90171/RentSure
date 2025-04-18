import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '155%',
  height: '500px',
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

function MapCom() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDg1yoMJgRyxUztn9cjDj_Or_jz4lFpmjk', // Use environment variable
    libraries: ['places'], // Include the Places library
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const searchInputRef = useRef(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    console.log('Selected Location (by map click):', newPosition);
  };

  const handleSearch = () => {
    const searchInput = searchInputRef.current.value.trim();
    if (!searchInput) {
      alert('Please enter a location to search.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newPosition = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setMarkerPosition(newPosition);
        map.panTo(location);
        console.log('Selected Location (by search):', newPosition);
      } else {
        alert('Location not found! Please try again.');
      }
    });
  };

  return isLoaded ? (
    <div>
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
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default MapCom;


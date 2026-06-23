import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '400px'
};

const mapStyles = [
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#444444' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'on' }, { color: '#f1c40f' }]
  },
  { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f2f2f2' }] },
  { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'all', stylers: [{ saturation: -100 }, { lightness: 45 }] },
  { featureType: 'road.highway', elementType: 'all', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'all', stylers: [{ color: '#eb0254' }, { visibility: 'on' }] }
];

function GoogleMapComponents() {
  const [zoom, setZoom] = useState<number>(15); // Increased zoom level for better accuracy
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [address, setAddress] = useState<string>('');
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDbpm5vXbVRqlLB_d5BhInZ01MqhQtMQs4'
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          
          // Fetch address from Geocoding API
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDbpm5vXbVRqlLB_d5BhInZ01MqhQtMQs4`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                setAddress(data.results[0].formatted_address);
              }
            })
            .catch(error => console.error('Error fetching address:', error));
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (map && center.lat !== 0 && center.lng !== 0) {
      map.setCenter(center);
    }
  }, [map, center]);

  if (loadError) {
    console.error('Error loading Google Maps API:', loadError);
    return <div>Error loading Google Maps API. Please check the console for details.</div>;
  }

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: mapStyles
          }}
        >
          {center.lat !== 0 && center.lng !== 0 && (
            <Marker
              position={center}
              icon={{
                url: 'assets/images/marker.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
      {address && <p>Your current address is: {address}</p>}
    </div>
  );
}

export default GoogleMapComponents;

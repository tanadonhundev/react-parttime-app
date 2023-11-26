import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import { currentUser } from "../../../services/auth";
import { profileUser } from "../../../services/user";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function HomeEmployee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null); // Store the DirectionsRenderer instance

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBk7hWPDP_TF3J_FsnRaDC8JHOSElW9Ayk", // Replace with your Google Maps API key
    libraries,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        loadData(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        //console.log(res);
        setData(res.data);
        setLoading(false);
        // Add the user's location as a marker
        setMarkers([
          { lat: parseFloat(res.data.lat), lng: parseFloat(res.data.lng) },
        ]);
      })
      .catch((error) => console.log(error));
  };

  const handleMapClick = (e) => {
    setClickedLatLng({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });

    const directionsService = new window.google.maps.DirectionsService();

    const directionsRequest = {
      origin: { lat: data.lat, lng: data.lng }, // Origin is the user's current location
      destination: { lat: e.latLng.lat(), lng: e.latLng.lng() }, // Destination is the clicked location
      travelMode: "DRIVING", // You can change the travel mode as needed
    };

    directionsService.route(directionsRequest, (result, status) => {
      if (status === "OK") {
        // Create a DirectionsRenderer instance and set directions data
        const newDirectionsRenderer = new window.google.maps.DirectionsRenderer(
          {
            directions: result,
            map: null, // It's initially not attached to any map
          }
        );

        // Update the state to store the DirectionsRenderer instance
        setDirectionsRenderer(newDirectionsRenderer);
      } else {
        console.error("Error requesting directions:", status);
      }
    });
  };

  const center = {
    lat: parseFloat(data.lat),
    lng: parseFloat(data.lng),
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const openGoogleMaps = () => {
    if (clickedLatLng) {
      const { lat, lng } = clickedLatLng;
      const userLat = parseFloat(data.lat);
      const userLng = parseFloat(data.lng);
      const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${lat},${lng}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  /*return (
    <div>
      <Card>
        <CardContent>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={center}
            onClick={handleMapClick}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
              />
            ))}
          </GoogleMap>
        </CardContent>
        <Button onClick={openGoogleMaps}>เปิดแผนที่</Button>
      </Card>
    </div>
  );*/
}

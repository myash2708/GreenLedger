import React, { useEffect, useRef } from 'react';

export default function MapComponent() {
  const mapRef = useRef(null);

  useEffect(() => {
    let map, infoWindow, polygon;
    const polygonCoords = [];

    function initMap() {
      map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6,
      });
      infoWindow = new window.google.maps.InfoWindow();

      const locationButton = document.createElement('button');
      locationButton.textContent = 'Pan to Current Location';
      locationButton.classList.add('custom-map-control-button');
      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
        locationButton
      );
      locationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              infoWindow.setPosition(pos);
              infoWindow.setContent('Location found.');
              infoWindow.open(map);
              map.setCenter(pos);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          handleLocationError(false, infoWindow, map.getCenter());
        }
      });

      // Add click listener to map to add polygon points
      map.addListener('click', (event) => {
        addLatLng(event.latLng);
      });
    }

    function addLatLng(latLng) {
      polygonCoords.push(latLng);
      if (polygon) {
        polygon.setMap(null);
      }
      polygon = new window.google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      });
      polygon.setMap(map);
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? 'Error: The Geolocation service failed.'
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }

    window.initMap = initMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div ref={mapRef} id='map' style={{ height: '400px', width: '100%' }}></div>
  );
}

let map;
let markers = [];
let polygon;
const labelColors = {
  1: 'red', // You can assign specific colors for each label
  2: 'blue',
  3: 'green',
  4: 'orange',
  0: 'yellow',
};
var areaKm2 = 0.7;

async function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 11.069778690400332, lng: 77.0906048081035 },
    zoom: 18,
    mapTypeId: 'satellite',
  });

  map.addListener('click', function (event) {
    addMarker(event.latLng);
  });
}
function addMarker(location) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
  });
  markers.push(marker);
  console.log(markers);
}
function addMarkerWithLabel(lat, lng, label) {
  var marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    label: label.toString(),
    icon: getMarkerIcon(label),
  });
}
function getMarkerIcon(label) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: labelColors[label],
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 8,
  };
}

// Read data from JSON file and add markers

function lockArea() {
  if (markers.length < 3) {
    alert('You need at least 3 markers to create an area.');
    return;
  }

  if (polygon) {
    polygon.setMap(null);
  }

  // Create a polyline connecting the markers
  const polyLine = new google.maps.Polyline({
    path: markers.map((marker) => marker.getPosition()),
    strokeColor: '#0000FF', // Color of the polyline
    strokeOpacity: 0.8,
    strokeWeight: 2,
    map: map,
  });

  // Create a polygon filled with a color
  polygon = new google.maps.Polygon({
    paths: polyLine.getPath(), // Use getPath() directly
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    editable: true,
    draggable: true,
    map: map,
  });
  let latitudes = markers.map((marker) => marker.getPosition().lat());
  let longitudes = markers.map((marker) => marker.getPosition().lng());
  let minLat = Math.min(...latitudes);
  let maxLat = Math.max(...latitudes);
  let minLng = Math.min(...longitudes);
  let maxLng = Math.max(...longitudes);

  let latDiff = maxLat - minLat;
  let lngDiff = maxLng - minLng;

  // Convert latitude distance to kilometers (1 degree latitude ≈ 111 km)
  let latDistanceKm = latDiff * 111;

  // Convert longitude distance to kilometers
  // Approximate the distance using the average latitude
  let avgLat = (minLat + maxLat) / 2;
  let lngDistanceKm = lngDiff * 111 * Math.cos((avgLat * Math.PI) / 180);

  // Calculate area in square kilometers
  areaKm2 = latDistanceKm * lngDistanceKm;
  // Display bounding box coordinates
  alert(`Bounding box: (${minLat}, ${minLng}), (${maxLat}, ${maxLng})`);
  alert('Area: (sqKm)', areaKm2);
  const center = calculateCenter(markers);
  // Calculate the center of the bounding box
  let centerLat = (minLat + maxLat) / 2;
  let centerLng = (minLng + maxLng) / 2;

  // Define the URL for the static map with the bounding box center
  const apiKey = 'AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc';
  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=19&size=600x900&maptype=satellite&markers=color:blue%7Clabel:LT%7C${latitudes[0]},${longitudes[0]}&markers=color:green%7Clabel:LB%7C${latitudes[1]},${longitudes[1]}&markers=color:red%7Clabel:RT%7C${latitudes[2]},${longitudes[2]}&markers=color:blue%7RBlabel:X%7C${latitudes[3]},${longitudes[3]}&key=${apiKey}`;

  async function downloadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], 'map.png', { type: blob.type });
    return file;
  }
  console.log(url);
  async function sendImageToApi(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('https://trees.singhropar.tech/upload?image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    return data;
  }

  async function paramsAQI(lat, lon, area) {
    const response = await fetch('https://aqi.singhropar.tech/calculate_cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lon,
        area_size: 2,
      }),
    });

    const data = await response.json();
    console.log(data);
    return data;
  }

  downloadImage(url).then((file) => {
    console.log(file);
    document.getElementById('mu').src = URL.createObjectURL(file);
    sendImageToApi(file).then((data) => {
      // console.log(data.t)
      alert(JSON.stringify(data));
      document.getElementById('hello').innerHTML += '<h2>Estimates:</h2>';
      document.getElementById('hello').innerHTML +=
        'Dark Green %: ' + data.dark_green_percentage * 100 + '<br/>';
      document.getElementById('hello').innerHTML +=
        'Light Green %: ' + data.light_green_percentage * 100 + '<br/>';
      document.getElementById('hello').innerHTML +=
        'Total Green %: ' + data.total_green_percentage * 100;
      paramsAQI(centerLat, centerLng, areaKm2).then((data2) => {
        alert(JSON.stringify(data2));

        document.getElementById('hello').innerHTML +=
          '<h2>Credits Estimate:</h2>';
        document.getElementById('hello').innerHTML +=
          'Adjusted Area Cost: ' + data2.adjusted_area_cost + '<br/>';
        document.getElementById('hello').innerHTML +=
          'Original Credit Cost: ' + data2.original_credit_cost + '<br/>';
        document.getElementById('hello').innerHTML +=
          'Amount of Carbon Mono Oxide: ' + data2.pollutants.co + '<br/>';
        document.getElementById('hello').innerHTML +=
          'Amount of Ammonia: ' + data2.pollutants.nh3 + '<br/>';
        document.getElementById('hello').innerHTML +=
          'Amount of Nitrous Oxide: ' + data2.pollutants.no + '<br/>';
        document.getElementById('hello').innerHTML +=
          'Amount of Nitrogen Dioxide: ' + data2.pollutants.no2 + '<br/>';
        document.getElementById('hello').innerHTML +=
          'Amount of Ozone: ' + data2.pollutants.o3 + '<br/>';
        document.getElementById('hello').innerHTML +=
          'Amount of Sulphur Dioxide: ' + data2.pollutants.so2 + '<br/>';
        console.log(JSON.stringify(data2));
        document.getElementById('hello').innerHTML +=
          'Amount of Particulate Matter: ' +
          parseInt(data2.pollutants.pm10) +
          parseInt(data2.pollutants.pm2_5) +
          '<br/>';
        // document.getElementById('hello').innerHTML +=
        //   '<h2>Resultant AQI: </h2>';
        // document.getElementById('hello').innerHTML +=
        //   data2.pollutants.aqi + '<br/>';
      });
    });

    alert('Image downloaded successfully.');
  });
  setTimeout(() => {
    map.setOptions({ draggable: true });
  }, 500);
}

function calculateCenter(markers) {
  let latSum = 0;
  let lngSum = 0;
  const numMarkers = markers.length;

  markers.forEach((marker) => {
    latSum += marker.lat;
    lngSum += marker.lng;
  });

  const centerLat = latSum / numMarkers;
  const centerLng = lngSum / numMarkers;

  return { lat: centerLat, lng: centerLng };
}

function assignPoliceman() {
  const selectedPoliceman = document.getElementById('policeDropdown').value;

  if (!polygon) {
    alert('Lock an area before assigning a policeman.');
    return;
  }

  // Convert the assignment data to JSON string using json-stringify-safe
  const jsonString = JSON.stringify({
    polygon: polygon.toString(),
    assignedPoliceman: selectedPoliceman,
  });

  if (!jsonString) {
    alert('Error converting assignment data to JSON.');
    return;
  }

  // Create a Blob containing the JSON data
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'duties.json';

  // Append the link to the document and trigger the click event
  document.body.appendChild(link);
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);

  alert(
    `Assigned ${selectedPoliceman} to the locked area. Assignment details saved to duties.json.`
  );
}

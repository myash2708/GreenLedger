window.addEventListener('load', function() {
 
const stressLevelElement = document.getElementById('stressLevel');
const stressLevel = Math.random() * 100; // You can replace this with your logic to get the actual stress level

// Limit stress level to be between 0 and 100
const clampedStressLevel = parseInt(Math.min(Math.max(stressLevel, 0), 100));
// Remove existing classes
stressLevelElement.className = 'stress-level';

// Apply color-coded class based on stress level
if (clampedStressLevel < 25) {
    stressLevelElement.classList.add('low');
} else if (clampedStressLevel < 50) {
    stressLevelElement.classList.add('medium');
} else if (clampedStressLevel < 75) {
    stressLevelElement.classList.add('high');
} else {
    stressLevelElement.classList.add('extreme');
}

stressLevelElement.style.width = clampedStressLevel + '%';




}, false);



    // Initialize Firebase with your project configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCr6wNRSuEH3EcJ14bngzre0tE_YAVQNNo",
      authDomain: "rjpolice-9c55e.firebaseapp.com",
      databaseURL: "https://rjpolice-9c55e-default-rtdb.firebaseio.com",
      projectId: "rjpolice-9c55e",
      storageBucket: "rjpolice-9c55e.appspot.com",
      messagingSenderId: "747764281958",
      appId: "1:747764281958:web:98e8ab33a0c517cefaf3a7"
    };

    firebase.initializeApp(firebaseConfig);

    // Reference to your Firebase Realtime Database location
    var database = firebase.database();
    console.log(database);
    database.ref('users/123').once('value', function (snapshot) {
      var data = snapshot.val();
      console.log(data.latitude);
      console.log(data.longitude);
      updateMap(data.latitude, data.longitude);
    });
    database.ref('users/123').on('value', function (snapshot) {
      var data = snapshot.val();
      console.log(data.latitude);
      console.log(data.longitude);
      updateMap(data.latitude, data.longitude);
    });
    // Initialize Google Maps
    let map;
  
    function initMap() {
      const hostWithoutPort = window.location.hostname.split(':')[0];
      // const socket = new WebSocket('ws://' + hostWithoutPort + ':8080');

        var customMarkerIcon = {
          
            url: 'https://i.imgur.com/7kDXUcP.png', // Replace with the path to your custom PNG
            scaledSize: new google.maps.Size(30, 30), // Adjust the size of the marker icon
        };
        console.log(customMarkerIcon)
      map = new google.maps.Map(document.getElementById('map_container'), {
        center: { lat: 26.9124, lng: 75.7873 },
        zoom: 18
      });
      marker = new google.maps.Marker({ 
        map: map,
        icon:customMarkerIcon
      });
      marker.setPosition({ lat: 26.9124, lng: 75.7873 });
      console.log("Marker initialized with custom icon:", marker);

      // Listen for changes in the 'location' node in the database
   
    }

    // Function to update the map with new coordinates
    function updateMap(latitude, longitude) {
      const newLocation = new google.maps.LatLng(latitude, longitude);
      map.setCenter(newLocation);
      marker.setPosition(newLocation);
    }


// function initMap() {
//     // Initialize the map
//     var map = new google.maps.Map(document.getElementById('map_container'), {
//         center: {lat: 26.867420912127216, lng: 75.81905826931062},
//         zoom: 16
//     });
//     var customMarkerIcon = {
//         url: '../img/logo.png', // Replace with the path to your custom PNG
//         scaledSize: new google.maps.Size(40, 40), // Adjust the size of the marker icon
//     };
    
//     // Add custom markers with the custom icon
//     var marker = new google.maps.Marker({
//         position: {lat: 26.867420912127216, lng: 75.81905826931062},
//         map: map,
//         title: 'Marker Title',
//         icon: customMarkerIcon
//     });
    
//     // Add click event listener to the marker
//     marker.addListener('click', function() {
//         // Handle marker click event
//         alert('Marker clicked!');
//     });
// }
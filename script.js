let map;
let userMarker;
let drugMarkers = [];
let infoWindows = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // location request denied -> san francisco
    zoom: 12,
    gestureHandling: "greedy"
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        map.setCenter(userLocation);
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" //blue marker, your location
          }
        });
      },
      () => console.warn("Location request denied, using default."),
      { enableHighAccuracy: true }
    );
  } 
  else {
    console.warn("Geolocation not supported.");
  }
}

function showDrugLocations(drugName) {

  // Clear previous markers
  drugMarkers.forEach(marker => marker.setMap(null));
  drugMarkers = [];
  infoWindows = [];
  document.getElementById("info").innerHTML = `<h3>${drugName}</h3><p>Loading locations...</p>`;

  //Drugs
  switch(drugName) {
    case "Naloxone":
      searchNaloxoneLocations();
      break;
    case "Flumazenil":
      searchFlumazenilLocations();
      break;
    case "Methadone":
      searchMethadoneLocations();
      break;
    case "Buprenorphine":
      searchBuprenorphineLocations();
      break;
    default:
      document.getElementById("info").innerHTML = `<h3>${drugName}</h3><p>No information available for this drug.</p>`;
  }
}

// Nearby Naloxone locations
function searchNaloxoneLocations() {
  const request = {
    location: userMarker ? userMarker.getPosition() : map.getCenter(),
    radius: 10000, // 10 km
    keyword: "pharmacy, CVS, Walgreens, Walmart, Target", // hardcoded keywords
    type: "pharmacy"
  };
  
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        addMarker(place.geometry.location, place.name, place.vicinity);
      });

      // Information + how to use
      document.getElementById("info").innerHTML = `<h3>Naloxone</h3><p>Naloxone is an FDA approved medicine that can treat opioid / narcotic overdoses. <br>Brand names of naloxone include Narcan, Kloxxado, Nalone, etc. <br> <br>Use: <br>For nasal sprays, insert the nozzle into a nostril and press firmly. <br>For injectables, inject the naloxone into the thigh or upper arm. <br> <br>Note: Naloxone is safe and has no negative effects on someone who is not experiencing a narcotic overdose.  </p>`;
    } 
    else {
      document.getElementById("info").innerHTML = `<h3>Naloxone</h3><p>No locations found.</p>`;
    }
  });
}

// Nearby Flumazenil locations
function searchFlumazenilLocations() {
  const request = {
    location: userMarker ? userMarker.getPosition() : map.getCenter(),
    radius: 10000,
    keyword: "hospital, emergency room, ER",
    type: "hospital"
  };
  
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        addMarker(place.geometry.location, place.name, place.vicinity);
      });

      document.getElementById("info").innerHTML = `<h3>Flumazenil</h3><p>Flumazenil is used to reverse the effects of benzodiazepines (such as Valium, Xanax) overdose. <br>Brand names include Romazicon. <br> <br>Use: <br>Flumazenil is typically administered by healthcare professionals intravenously. <br> <br>Note: Flumazenil is generally only available in hospitals and emergency departments.</p>`;
    } 
    else {
      document.getElementById("info").innerHTML = `<h3>Flumazenil</h3><p>Unable to find locations. Please try again later.</p>`;
    }
  });
}

// Nearby Methadone locations
function searchMethadoneLocations() {
  const request = {
    location: userMarker ? userMarker.getPosition() : map.getCenter(),
    radius: 10000,
    keyword: "methadone clinic, opioid treatment", 
  };
  
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        addMarker(place.geometry.location, place.name, place.vicinity);
      });
      document.getElementById("info").innerHTML = `<h3>Methadone</h3><p>Methadone is a medication used to treat opioid use disorder and manage chronic pain. <br> <br>Use: <br>Methadone is dispensed daily at specialized clinics for opioid addiction treatment. <br> <br>Note: Methadone is a controlled substance that requires special certification for providers to dispense for addiction treatment.</p>`;
    } 
    else {
      document.getElementById("info").innerHTML = `<h3>Methadone</h3><p>Unable to find locations. Please try again later.</p>`;
    }
  });
}

//Nearby Buprenorphine locations
function searchBuprenorphineLocations() {
  const request = {
    location: userMarker ? userMarker.getPosition() : map.getCenter(),
    radius: 10000, 
    keyword: "buprenorphine, SAMHSA",
  };
  
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(place => {
        addMarker(place.geometry.location, place.name, place.vicinity);
      });
      document.getElementById("info").innerHTML = `<h3>Buprenorphine</h3><p>Buprenorphine (often sold as Suboxone) is used to treat opioid use disorder. <br>Brand names include Suboxone, Subutex, Zubsolv, and Sublocade. <br> <br>Use: <br>Typically administered as a sublingual film or tablet that dissolves under the tongue. <br> <br>Note: Buprenorphine can only be prescribed by healthcare providers with a special DEA waiver.</p>`;
    } 
    else {
      document.getElementById("info").innerHTML = `<h3>Buprenorphine</h3><p>Unable to find locations. Please try again later.</p>`;
    }
  });
}

// Adding red markers at found locations
function addMarker(position, title, address = "No address available") {
  let marker = new google.maps.Marker({
    position,
    map,
    title,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" 
    }
  });

  let infoWindow = new google.maps.InfoWindow({
    content: `<h3>${title}</h3><p>${address}</p>`
  });

  marker.addListener("click", () => {
    infoWindows.forEach(win => win.close());
    infoWindow.open(map, marker);
  });

  drugMarkers.push(marker);
  infoWindows.push(infoWindow);
}

// Show report form
function showReportForm() {
  document.getElementById("reportForm").style.display = "block";
}

// Close form
function closeReportForm() {
  document.getElementById("reportForm").style.display = "none";
}

// Handle form data
document.getElementById("missedLocationForm").addEventListener("submit", function (event) {
  event.preventDefault(); 

  const locationName = document.getElementById("locationName").value;
  const locationAddress = document.getElementById("locationAddress").value;
  const drug = document.getElementById("drug").value;

  // Store data
  fetch('http://localhost:3000/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ locationName, locationAddress, drug })
  })
  
  .then(response => response.json())
  .then(data => {
    console.log("Location reported:", data);
    alert('Thank you for the report');
  })
  .catch(error => {
    console.error("Error", error);
    alert('Failed');
  });

  closeReportForm();
});
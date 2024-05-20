// Array to keep track of all markers
var markers = [];
// Variable to track if the "Create Pin" button is active
var createPinActive = false;
// Variable to store the map instance
var mapInstance;

// Define custom icons
var icons = {
    default: L.icon({
        iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    red: L.icon({
        iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    blue: L.icon({
        iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    green: L.icon({
        iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    })
};

// Function to initialize the map
function initMap(latitude, longitude) {
    // Initialize the map and set its view to the user's location
    var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([latitude, longitude], 13);
    mapInstance = map;

    // Add a tile layer to the map without the default attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add a marker at the user's location
    var userMarker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup('You are here')
        .openPopup();

    // Add click event to the map to add a marker only if createPinActive is true
    map.on('click', function(e) {
        if (createPinActive) {
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;
            document.getElementById('pinDialogue').style.display = 'block'; // Show the custom dialogue box
            document.getElementById('pinLat').value = lat;
            document.getElementById('pinLng').value = lng;
        }
    });
}

// Function to add a marker with customizable information
function addMarker(map, lat, lng) {
    var popupContent = document.getElementById('pinContent').value;
    var dateTime = document.getElementById('pinDateTime').value;
    var duration = document.getElementById('pinDuration').value;
    var description = document.getElementById('pinDescription').value;
    var iconType = document.getElementById('pinIcon').value;
    
    // Combine information into a single string
    var combinedContent = popupContent + "<br>Date & Time: " + dateTime + "<br>Duration: " + duration + "<br>Description: " + description;
    
    if (popupContent) {
        var marker = L.marker([lat, lng], { icon: icons[iconType] }).addTo(map);
        marker.bindPopup(createPopupContent(combinedContent, marker, map)).openPopup();

        // Add marker to the array
        markers.push(marker);
    }
    
    // Clear input fields and hide the dialogue box
    clearDialogueFields();
    // Reset the Create Pin button state
    createPinActive = false;
    document.getElementById('createPinButton').classList.remove('active');
}

// Function to create the popup content with edit and remove buttons
function createPopupContent(content, marker, map) {
    var container = document.createElement('div');
    container.classList.add('popup-container');

    var info = document.createElement('p');
    info.classList.add('popup-content');
    info.innerHTML = content;

    var editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit');
    editButton.onclick = function() {
        var newContent = prompt('Edit information for this marker:', content);
        if (newContent) {
            content = newContent;
            info.innerHTML = newContent;
            marker.setPopupContent(createPopupContent(newContent, marker, map));
            marker.openPopup();
        }
    };

    var removeButton = document.createElement('button');
    removeButton.innerHTML = 'Remove';
    removeButton.classList.add('remove');
    removeButton.onclick = function() {
        map.removeLayer(marker);
    };

    container.appendChild(info);
    container.appendChild(editButton);
    container.appendChild(removeButton);

    return container;
}

// Function to clear input fields and hide the dialogue box
function clearDialogueFields() {
    document.getElementById('pinContent').value = '';
    document.getElementById('pinDateTime').value = '';
    document.getElementById('pinDuration').value = '';
    document.getElementById('pinDescription').value = '';
    document.getElementById('pinDialogue').style.display = 'none';
}

// Function to add a marker from the custom dialogue box
function addMarkerFromDialogue() {
    var latitude = parseFloat(document.getElementById('pinLat').value);
    var longitude = parseFloat(document.getElementById('pinLng').value);
    addMarker(mapInstance, latitude, longitude);
}

// Add event listener to the "Create Pin" button
document.getElementById('createPinButton').addEventListener('click', function() {
    createPinActive = !createPinActive;
    if (createPinActive) {
        this.classList.add('active');
    } else {
        this.classList.remove('active');
    }
});

// Add event listener to the "Submit" button in the dialogue box
document.getElementById('submitPinButton').addEventListener('click', function() {
    addMarkerFromDialogue();
});

// Add event listener to the "Cancel" button in the dialogue box
document.getElementById('cancelPinButton').addEventListener('click', function() {
    clearDialogueFields();
    // Reset the Create Pin button state
    createPinActive = false;
    document.getElementById('createPinButton').classList.remove('active');
});

// Check if the browser supports Geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Success callback: use the user's current position
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            initMap(latitude, longitude);
        },
        function(error) {
            // Error callback: handle errors (e.g., user denies permission)
            console.error('Error occurred while retrieving location:', error);
            // Fallback: initialize map with a default location (e.g., San Francisco)
            initMap(37.7749, -122.4194);
        }
    );
} else {
    // Browser doesn't support Geolocation, initialize map with a default location
    console.error('Geolocation is not supported by this browser.');
    initMap(37.7749, -122.4194);
}

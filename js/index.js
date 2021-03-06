const response_ip = document.getElementById("response-ip")
const response_location = document.getElementById("response-location")
const response_timezone = document.getElementById("response-timezone")
const response_isp = document.getElementById("response-isp")
const input = document.getElementById("input")
const button = document.getElementById("button")
let popup = 1;
let actualIP;
let latitudeAndLongitude = []
let mymap;
let marker;

//obtiene el IP y manda a manipular los datos
const getIP = (url) => {
  fetch(url)
  .then( response => {
    if (response.ok) {
      return response.json()
    } else {
      throw new Error(`${response.status} ${response.statusText}`)
    }
  })
  .then( response => manipulateData(response))
  .catch( error => alert(error))
}

const manipulateData = (response) => {
  response_ip.innerHTML = response.ip
  response_location.innerHTML = `${response.location.city}, ${response.location.region} ${response.location.postalCode}`
  response_timezone.innerHTML = `UTC ${response.location.timezone}`
  response_isp.innerHTML = response.isp
  latitudeAndLongitude = [response.location.lat, response.location.lng]

  if (!mymap) {
    mymap = L.map('map').setView(latitudeAndLongitude, 13);
    marker = L.marker(latitudeAndLongitude).addTo(mymap);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVhbGRpZWdvciIsImEiOiJja3N1c2g1N3gxaXFoMnZwb250MXp5c3Z6In0.M7oQ9XtdLRXGpWmpm7h6NA', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);
  } else {
    mymap.setView(latitudeAndLongitude, 13)
    marker = L.marker(latitudeAndLongitude).addTo(mymap);
  }
  marker.bindPopup("Tracking of IP #" + popup++)
}

//manda a realizar una busqueda
const search = () => {
  getIP("https://geo.ipify.org/api/v1?apiKey=at_psspGHJpI5KNLoymwem4BETIHQwv5&domain=" + input.value)
}
search() //ejecuta la busqueda la primera vez

input.addEventListener("keyup", (ev) => {
  if (ev.keyCode == 13) { //enter
    search()
  }
})
button.addEventListener("click", search)

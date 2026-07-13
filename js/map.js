function toggleMenu()
{
    let nav = document.getElementById("ss_navLinks")
    if (nav.style.display === "none")
    {
        nav.style.display = "block"
    }
    else
    {
        nav.style.display = "none"
    }
}

let map = null
let service = null
let infoWindow = null
let markers = []

function loadMap()
{
    const CONTENT = 0,
          LATITUDE = 1,
          LONGITUDE = 2,
          STADIUM = 3

    map = new google.maps.Map(document.getElementById("ss_map"), {
        mapId: "MY_MAP_ID",
        zoom: 4,
        center: new google.maps.LatLng(37.5, -95.0),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    })

    infoWindow = new google.maps.InfoWindow()
    service = new google.maps.places.PlacesService(map)

    fetch("stadiums.json")
    .then(response => response.json())
    .then(stadiums =>
    {
        let locations = stadiums.map(stadium =>
        {
            let matchesHtml = stadium.matches.map(match => `<li>${match}</li>`).join("")

            let stadiumContent = `<div id="ss_stadiumContent">
                                      <h2>${stadium.name}</h2>
                                      <p>${stadium.city}, ${stadium.country}</p>
                                      <img src="${stadium.image}" alt="${stadium.name}">
                                      <p>${stadium.description}</p>
                                      <p><strong>Capacity:</strong> ${stadium.capacity.toLocaleString()}</p>
                                      <p><strong>World Cup 2026 Fixtures:</strong></p>
                                      <ul>${matchesHtml}</ul>
                                  </div>`

            return [stadiumContent, stadium.latitude, stadium.longitude, stadium]
        })

        locations.forEach(location =>
        {
            let icon = document.createElement("img")
            icon.src = "images/stadiumMarker.png"
            icon.style.width = "32px"
            icon.style.height = "32px"

            let marker = new google.maps.marker.AdvancedMarkerElement({
                position: new google.maps.LatLng(location[LATITUDE], location[LONGITUDE]),
                map: map,
                content: icon
            })

            markers.push({marker, stadium: location[STADIUM]})

            google.maps.event.addListener(marker, "click", () =>
            {
                infoWindow.setContent(location[CONTENT])
                infoWindow.open(map, marker)

                service.findPlaceFromQuery({
                    query: location[STADIUM].query,
                    fields: ["place_id"]
                }, (results, status) =>
                {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0)
                    {
                        service.getDetails({
                            placeId: results[0].place_id,
                            fields: ["formatted_address", "rating", "photos"]
                        }, (placeDetails, detailStatus) =>
                        {
                            if (detailStatus === google.maps.places.PlacesServiceStatus.OK)
                            {
                                let stadium = location[STADIUM]
                                let matchesHtml = stadium.matches.map(match => `<li>${match}</li>`).join("")

                                let photoHtml = ""
                                if (placeDetails.photos && placeDetails.photos.length > 0)
                                {
                                    let photoUrl = placeDetails.photos[0].getUrl({maxWidth: 140})
                                    photoHtml = `<img src="${photoUrl}" alt="${stadium.name}">`
                                }

                                let combinedContent = `<div id="ss_stadiumContent">
                                                           <h2>${stadium.name}</h2>
                                                           <p>${placeDetails.formatted_address || stadium.city + ", " + stadium.country}</p>
                                                           ${photoHtml}
                                                           <p>${stadium.description}</p>
                                                           <p><strong>Capacity:</strong> ${stadium.capacity.toLocaleString()}</p>
                                                           ${placeDetails.rating ? `<p><strong>Google Rating:</strong> ${placeDetails.rating} / 5</p>` : ""}
                                                           <p><strong>World Cup 2026 Fixtures:</strong></p>
                                                           <ul>${matchesHtml}</ul>
                                                       </div>`

                                infoWindow.setContent(combinedContent)
                            }
                        })
                    }
                })
            })
        })
    })
}

function filterMarkers()
{
    let country = document.getElementById("ss_filterCountry").value
    let stage = document.getElementById("ss_filterStage").value

    markers.forEach(entry =>
    {
        let countryMatch = (country === "all" || entry.stadium.country === country)
        let stageMatch = (stage === "all" || entry.stadium.matches.some(match => match.includes(stage)))

        entry.marker.map = (countryMatch && stageMatch) ? map : null
    })
}

let stadiums = []

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

function getMarkerPosition(stadium)
{
    const MIN_LONGITUDE = -130,
          MAX_LONGITUDE = -65,
          MIN_LATITUDE = 15,
          MAX_LATITUDE = 55

    return {
        left: ((stadium.longitude - MIN_LONGITUDE) / (MAX_LONGITUDE - MIN_LONGITUDE)) * 100,
        top: ((MAX_LATITUDE - stadium.latitude) / (MAX_LATITUDE - MIN_LATITUDE)) * 100
    }
}

function displayStadium(stadium)
{
    let matchesHtml = stadium.matches.map(match => `<li>${match}</li>`).join("")

    document.getElementById("ss_stadiumDetails").innerHTML = `<img src="${stadium.image}" alt="${stadium.name}">
                                                               <div>
                                                                   <h2>${stadium.name}</h2>
                                                                   <p><strong>Location:</strong> ${stadium.city}, ${stadium.country}</p>
                                                                   <p><strong>Capacity:</strong> ${stadium.capacity.toLocaleString()}</p>
                                                                   <p>${stadium.description}</p>
                                                                   <p><strong>World Cup 2026 Fixtures:</strong></p>
                                                                   <ul>${matchesHtml}</ul>
                                                               </div>`

    document.querySelectorAll(".ss_marker").forEach(marker => marker.classList.remove("ss_selectedMarker"))
    document.querySelector(`[data-stadium="${stadium.name}"]`).classList.add("ss_selectedMarker")
}

function createMarkers()
{
    let markerContainer = document.getElementById("ss_markers")

    stadiums.forEach(stadium =>
    {
        let position = getMarkerPosition(stadium)
        let marker = document.createElement("button")

        marker.className = "ss_marker"
        marker.dataset.stadium = stadium.name
        marker.style.left = `${position.left}%`
        marker.style.top = `${position.top}%`
        marker.title = `${stadium.name}, ${stadium.city}`
        marker.setAttribute("aria-label", `${stadium.name}, ${stadium.city}`)
        marker.innerHTML = `<span>${stadium.name}</span>`
        marker.onclick = () => displayStadium(stadium)

        markerContainer.appendChild(marker)
    })
}

function filterMarkers()
{
    let country = document.getElementById("ss_filterCountry").value
    let stage = document.getElementById("ss_filterStage").value

    stadiums.forEach(stadium =>
    {
        let countryMatch = (country === "all" || stadium.country === country)
        let stageMatch = (stage === "all" || stadium.matches.some(match => match.includes(stage)))
        let marker = document.querySelector(`[data-stadium="${stadium.name}"]`)

        marker.style.display = (countryMatch && stageMatch) ? "block" : "none"
    })
}

function loadMap()
{
    fetch("stadiums.json")
    .then(response => response.json())
    .then(data =>
    {
        stadiums = data
        createMarkers()
    })
    .catch(() =>
    {
        document.getElementById("ss_stadiumDetails").innerHTML = "<p>Stadium information could not be loaded.</p>"
    })
}

window.onload = () =>
{
    loadMap()
}

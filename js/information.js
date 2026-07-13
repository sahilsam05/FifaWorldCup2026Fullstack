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

function loadStadiums()
{
    fetch("stadiums.json")
    .then(response => response.json())
    .then(stadiums =>
    {
        let container = document.getElementById("ss_stadiumsContainer")

        stadiums.forEach(stadium =>
        {
            let matchesHtml = stadium.matches.map(match => `<li>${match}</li>`).join("")

            container.innerHTML += `<div class="ss_stadiumCard">
                                        <img src="${stadium.image}" alt="${stadium.name}">
                                        <h2>${stadium.name}</h2>
                                        <p><strong>Location:</strong> ${stadium.city}, ${stadium.country}</p>
                                        <p><strong>Capacity:</strong> ${stadium.capacity.toLocaleString()}</p>
                                        <p>${stadium.description}</p>
                                        <p><strong>World Cup 2026 Fixtures:</strong></p>
                                        <ul>${matchesHtml}</ul>
                                        <div class="ss_clearfix"></div>
                                    </div>`
        })
    })
}

window.onload = () =>
{
    loadStadiums()
}

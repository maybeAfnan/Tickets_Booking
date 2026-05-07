document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("ticketsContainer");
    const noTicketsMsg = document.getElementById("noTicketsMsg");

     const userEmail = sessionStorage.getItem("userEmail");
     if (!userEmail) {
         window.location.href = "/html/login.html";
         return;
     }

    //fetch bookings from backend
    fetch("/mytickets?email=" + encodeURIComponent(userEmail))
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Connection error");
        }
    })
    .then(function (result) {
        result = JSON.parse(JSON.stringify(result));
        if (result.status) {
            const bookings = result.bookings;

            if (bookings.length === 0) {
                noTicketsMsg.style.display = "block";
                return;
            }

            //loop through each booking
            bookings.forEach(function (booking) {

                //duplicate ticket card based on num_tickets
                for (let i = 0; i < booking.num_tickets; i++) {

                    const ticket = document.createElement("div");
                    ticket.classList.add("ticket");

                    ticket.innerHTML = `
                        <div class="ticketInfo">
                            <h2>${escapeHTML(booking.match_name)}</h2>
                            <p><span>Name: </span>${escapeHTML(booking.name)}</p>
                            <p><span>Category: </span>${escapeHTML(booking.category)}</p>
                            <p><span>Row: </span>${escapeHTML(booking.row)}</p>
                            <p><span>Date: </span>${escapeHTML(booking.match_date)}</p>
                            <p><span>Time: </span>${escapeHTML(booking.match_time)}</p>
                            <p><span>Meal: </span>${escapeHTML(booking.meal)}</p>
                        </div>
                    `;

                    container.appendChild(ticket);
                }
            });

        } else {
            noTicketsMsg.style.display = "block";
        }
    })
    .catch(function (error) {
        console.error("Error:", error);
        noTicketsMsg.textContent = "Could not load tickets. Please try again.";
        noTicketsMsg.style.display = "block";
    });

});

function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}
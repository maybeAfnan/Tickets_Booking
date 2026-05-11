document.addEventListener("DOMContentLoaded", function () {

    //redirect if not logged in
     const userEmail = sessionStorage.getItem("userEmail");
     if (!userEmail) {
         window.location.href = "/html/login.html";
        return;
    }
    //read match info
    const params = new URLSearchParams(window.location.search);
    const matchName = params.get("match") || "Match";
    const matchDate = params.get("date") || "";
    const matchTime = params.get("time") || "";

    document.getElementById("matchName").textContent = matchName;
    document.getElementById("matchDateTime").textContent = matchDate + ", " + matchTime;

    const categorySelect = document.getElementById("categorySelect");
    const ticketCards = document.querySelectorAll(".ticket-card");
    const confirmBtn = document.getElementById("confirmBtn");
    const msg = document.getElementById("msg");

    function filterCards() {
        const selected = categorySelect.value;

        ticketCards.forEach(function (card) {
            const cardCategory = card.getAttribute("data-category");

            if (selected === "All" || cardCategory === selected) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";

                const cb = card.querySelector(".ticket-checkbox");
                if (cb) cb.checked = false;
                card.classList.remove("selected-card");
            }
        });
    }

    categorySelect.addEventListener("change", filterCards);

    //checkbox select
    ticketCards.forEach(function (card) {
        const checkbox = card.querySelector(".ticket-checkbox");

        checkbox.addEventListener("change", function () {
            if (this.checked) {
                //uncheck all others
                ticketCards.forEach(function (otherCard) {
                    const otherCb = otherCard.querySelector(".ticket-checkbox");
                    if (otherCb && otherCb !== checkbox) {
                        otherCb.checked = false;
                        otherCard.classList.remove("selected-card");
                    }
                });
                card.classList.add("selected-card");
            } else {
                card.classList.remove("selected-card");
            }
        });
    });

    //validation

    //checks if field is not empty
    function isFilled(selector, messages, errorMsg) {
        const element = document.getElementsByName(selector)[0].value.trim();
        if (element.length < 1) {
            messages.push(errorMsg);
        }
        return messages;
    }

    //name validation
    function isName(selector, messages, errorMsg) {
        const element = document.getElementsByName(selector)[0].value.trim();
        if (element.length < 1) {
            return messages;
        }
        if (!element.match("^[A-Za-z ]{2,100}$")) {
            messages.push(errorMsg);
        }
        return messages;
    }

    //number of tickets validation
    function isTicketCount(selector, messages, errorMsg) {
        const element = document.getElementsByName(selector)[0].value.trim();
        if (element.length < 1) {
            return messages;
        }
        const num = parseInt(element);
        if (!element.match("^[0-9]+$") || isNaN(num) || num < 1 || num > 10) {
            messages.push(errorMsg);
        }
        return messages;
    }

    //meal radio validation
    function isMealSelected(whitelist, messages, errorMsg) {
        const checkedMeal = document.querySelector('input[name="meal"]:checked');
        if (!checkedMeal || !whitelist.includes(checkedMeal.value)) {
            messages.push(errorMsg);
        }
        return messages;
    }

    //ticket selection validation
    function isTicketSelected(messages, errorMsg) {
        const selected = document.querySelector(".ticket-checkbox:checked");
        if (!selected) {
            messages.push(errorMsg);
        }
        return messages;
    }

    //confirm button
    document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();
        let messages = [];

        messages = isFilled("userName", messages, "Name is missing");
        messages = isName("userName", messages, "Name must contain letters and spaces only (2-100 characters)");
        messages = isFilled("numTickets", messages, "Number of tickets is missing");
        messages = isTicketCount("numTickets", messages, "Number of tickets must be between 1 and 10");
        const mealWhitelist = ["Yes", "No"];
        messages = isMealSelected(mealWhitelist, messages, "Please select whether you want a meal (Yes or No)");
        messages = isTicketSelected(messages, "Please select a ticket from the list");

        if (messages.length > 0) {
            msg.innerHTML = "Issues found [" + messages.length + "]: " + messages.join(", ") + ".";
            msg.style.color = "red";
            msg.style.display = "block";
            return;
        }

        msg.innerHTML = "";
        msg.style.display = "none";

        const selectedCheckbox = document.querySelector(".ticket-checkbox:checked");
        const selectedCard = selectedCheckbox.closest(".ticket-card");
        const checkedMeal = document.querySelector('input[name="meal"]:checked');

        const bookingData = {
            email: userEmail,
            name: document.getElementsByName("userName")[0].value.trim(),
            meal: checkedMeal.value,
            numTickets: parseInt(document.getElementsByName("numTickets")[0].value),
            category: selectedCard.getAttribute("data-category"),
            row: selectedCard.getAttribute("data-row"),
            matchName: matchName,
            matchDate: matchDate,
            matchTime: matchTime
        };

        //send to backend
        fetch("/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        })
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
                //success
                window.location.href = "/html/MyTickets.html";
            } else {
                msg.innerHTML = result.err;
                msg.style.color = "red";
                msg.style.display = "block";
            }
        })
        .catch(function (error) {
            console.error("Error:", error);
            msg.innerHTML = "Could not connect to server";
            msg.style.color = "red";
            msg.style.display = "block";
        });

    });

});

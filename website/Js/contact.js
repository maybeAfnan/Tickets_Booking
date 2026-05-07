const form = document.getElementById("contactForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let messages = [];

    const firstName = document.getElementsByName("firstName")[0].value.trim();
    const lastName = document.getElementsByName("lastName")[0].value.trim();
    const email = document.getElementsByName("email")[0].value.trim();
    const mobile = document.getElementsByName("mobile")[0].value.trim();
    const gender = document.getElementsByName("gender")[0].value;
    const language = document.getElementsByName("language")[0].value;
    const message = document.getElementsByName("message")[0].value.trim();
    const dob = document.getElementsByName("dob")[0].value;

    //validation
    if (firstName.length < 2) {
        messages.push("First name must be at least 2 characters");
    }

    if (lastName.length < 2) {
        messages.push("Last name must be at least 2 characters");
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        messages.push("Email format is wrong");
    }

    if (!mobile.match(/^[0-9]{10}$/)) {
        messages.push("Phone must be 10 digits");
    }

    if (gender === "") {
        messages.push("Please select gender");
    }

    if (language === "") {
        messages.push("Please select language");
    }

    if (dob === "") {
        messages.push("Please select date of birth");
    }

    if (message.length <= 10) {
        messages.push("Message must be more than 10 characters");
    }

    
    if (messages.length > 0) {

        msg.className = "error";
        msg.innerHTML = messages.join("<br>");
    } else {
    //send to backend
    fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobile: mobile,
            gender: gender,
            language: language,
            message: message,
            dob: dob
        })
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        if (result.status) {
            msg.className = "success";
            msg.innerHTML = "Message sent successfully!";
        } else {
            msg.className = "error";
            msg.innerHTML = result.err;
        }
    })
    .catch(function(error) {
        msg.className = "error";
        msg.innerHTML = "Could not connect to server.";
    });
}
    });
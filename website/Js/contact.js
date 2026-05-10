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
    if (typeof firstName !== "string") {
    messages.push("First name must be a string");
    }

    if (typeof lastName !== "string") {
    messages.push("Last name must be a string");
    }

    if (firstName.length < 2) {
        messages.push("First name must be at least 2 characters");
    }

    if (lastName.length < 2) {
        messages.push("Last name must be at least 2 characters");
    }

    if (!firstName.match(/^[A-Za-z ]+$/)) {
    messages.push("First name must contain letters only");
    }

    if (!lastName.match(/^[A-Za-z ]+$/)) {
    messages.push("Last name must contain letters only");
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        messages.push("Email format is wrong");
    }

    if (email.length > 200) {
    messages.push("Email must be under 200 characters");
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

    if (!dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
    messages.push("Date of birth must be a valid date");
    }

    if (message.length <= 10) {
        messages.push("Message must be more than 10 characters");
    }
    if (message.length > 300) {
    messages.push("Message must be under 300 characters");
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

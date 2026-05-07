/* ========================= */
/* REGISTER VALIDATION */
/* ========================= */

const registerForm = document.querySelector("#registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(e){

        e.preventDefault();

        let messages = [];

        const email =
        document.getElementsByName("email")[0];

        const password =
        document.getElementsByName("password")[0];

        const confirmPassword =
        document.getElementsByName("confirmPassword")[0];

        const msg = document.querySelector("#msg");



        /* reset borders */
        email.style.border = "none";
        password.style.border = "none";
        confirmPassword.style.border = "none";




        /* EMAIL */

const emailPattern =
/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|stu\.kau\.edu\.sa)$/;

if(email.value.trim() === ""){

    messages.push("Email is required");

    email.style.border = "2px solid red";
}

else if(!emailPattern.test(email.value)){

    messages.push("Invalid email format");

    email.style.border = "2px solid red";
}


        /* PASSWORD */

        const pass = password.value;

        if(pass.includes(" ")){

            messages.push("Password cannot contain spaces");

            password.style.border = "2px solid red";
        }

        if(pass.length < 6){

            messages.push("Password must be at least 6 characters");

            password.style.border = "2px solid red";
        }

        if(!/[A-Z]/.test(pass)){

            messages.push("Password must contain uppercase letter");

            password.style.border = "2px solid red";
        }

        if(!/[0-9]/.test(pass)){

            messages.push("Password must contain number");

            password.style.border = "2px solid red";
        }

        if(!/[!@#$%^&*]/.test(pass)){

            messages.push("Password must contain special character");

            password.style.border = "2px solid red";
        }



        /* CONFIRM PASSWORD */

        if(pass !== confirmPassword.value){

            messages.push("Passwords do not match");

            confirmPassword.style.border = "2px solid red";
        }



        /* SHOW RESULT */

        if(messages.length > 0){

            msg.innerHTML = messages.join("<br>");

            msg.style.color = "red";
        }

        else {
    //send to backend
    fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value.trim(),
            password: password.value
        })
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        if (result.status) {
            msg.innerHTML = "Registration successful! You can now login.";
            msg.style.color = "lightgreen";
            //redirect to login after 2 seconds
            setTimeout(function() {
                window.location.href = "/html/login.html";
            }, 2000);
        } else {
            msg.innerHTML = result.err;
            msg.style.color = "red";
        }
    })
    .catch(function(error) {
        msg.innerHTML = "Could not connect to server.";
        msg.style.color = "red";
    });

        }

    });

}



/* ========================= */
/* LOGIN VALIDATION */
/* ========================= */

const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        let messages = [];

        const email =
        document.getElementsByName("email")[0];

        const password =
        document.getElementsByName("password")[0];

        const msg = document.querySelector("#msg");



        /* reset */
        email.style.border = "none";
        password.style.border = "none";



        /* EMAIL */

const emailPattern =
/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|stu\.kau\.edu\.sa)$/;

if(email.value.trim() === ""){

    messages.push("Email is required");

    email.style.border = "2px solid red";
}

else if(!emailPattern.test(email.value)){

    messages.push("Invalid email format");

    email.style.border = "2px solid red";
}

        /* PASSWORD */

        const pass = password.value;

        if(pass.includes(" ")){

            messages.push("Password cannot contain spaces");

            password.style.border = "2px solid red";
        }

        if(pass.length < 6){

            messages.push("Password must be at least 6 characters");

            password.style.border = "2px solid red";
        }

        if(!/[A-Z]/.test(pass)){

            messages.push("Password must contain uppercase letter");

            password.style.border = "2px solid red";
        }

        if(!/[0-9]/.test(pass)){

            messages.push("Password must contain number");

            password.style.border = "2px solid red";
        }

        if(!/[!@#$%^&*]/.test(pass)){

            messages.push("Password must contain special character");

            password.style.border = "2px solid red";
        }




        /* SHOW RESULT */

        if(messages.length > 0){

            msg.innerHTML = messages.join("<br>");

            msg.style.color = "red";
        }

        else {
    //send to backend
    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value.trim(),
            password: password.value
        })
    })
    .then(function(response) { return response.json(); })
    .then(function(result) {
        if (result.status) {
            sessionStorage.setItem("userEmail", result.email);
            window.location.href = "/html/index.html";
        } else {
            msg.innerHTML = result.err;
            msg.style.color = "red";
        }
    })
    .catch(function(error) {
        msg.innerHTML = "Could not connect to server.";
        msg.style.color = "red";
    });
}

    });

}

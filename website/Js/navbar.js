document.addEventListener("DOMContentLoaded", function () {

    const email = sessionStorage.getItem("userEmail");

    const loginBtn = document.querySelector(".login-btn") || document.querySelector("#loginBorder");
    const navRight = document.querySelector(".nav-right") || document.querySelector("#navMenu");

    if (email) {
        //user is logged in

        //hide login button
        if (loginBtn) {
            loginBtn.style.display = "none";
        }

        //create email display
        const emailSpan = document.createElement("span");
        emailSpan.textContent = email;
        emailSpan.classList.add("nav-email");
        emailSpan.style.color = "white"; 

        //create logout button
        const logoutBtn = document.createElement("a");
        logoutBtn.textContent = "Logout";
        logoutBtn.href = "#";
        logoutBtn.classList.add("logout-btn");
        logoutBtn.style.color = "white";
        logoutBtn.style.textDecoration = "none";

        logoutBtn.addEventListener("click", function () {
            sessionStorage.clear();
            window.location.href = "/html/index.html";
        });

        //add to navbar
        if (navRight) {
            navRight.appendChild(emailSpan);
            navRight.appendChild(logoutBtn);
        }

    }

});
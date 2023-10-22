(()=>{
    let navbarUserLoggedIn = document.getElementById("navbar-user-logged-in");
    let navbarUserNotLoggedIn = document.getElementById("navbar-user-not-logged-in");

    let userID = localStorage.getItem("userID");

    if (userID) {
        navbarUserLoggedIn.classList.remove("visually-hidden");
        navbarUserLoggedIn.style.cursor = "pointer";
        navbarUserNotLoggedIn.classList.add("visually-hidden");

        document.getElementById("navbar-user-click-to-profile").addEventListener("click", () => {
            window.location.href="/profile?id="+userID;
        });

        document.getElementById("navbar-button-logout").addEventListener("click", () => {
            localStorage.clear();
            window.location.href="/";
        });
        (async () => {
            let response = await fetch("/api/user/"+userID);
            let userData = await response.json();

            document.getElementById("navbar-user-name").innerText = userData.username;

        })();

    } else {
        navbarUserLoggedIn.classList.add("visually-hidden");
        navbarUserNotLoggedIn.classList.remove("visually-hidden");
    }

})();
document.getElementById("submitButton").addEventListener("click",  async() => {
    const formData = new URLSearchParams();

    formData.append("email", val("email"));
    formData.append("password", val("password"));

    let response = await fetch("/api/login", {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    if (response.status === 200) {
        let data = await response.json();
        localStorage.setItem("userID", data.id);
        window.location.href = "/profile/?id="+data.id;
    } else {
        alert(response.statusText);
    }
});

function val(elem) {
    return document.getElementById(elem).value;
}
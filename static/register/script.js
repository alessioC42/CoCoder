document.getElementById("submitButton").addEventListener("click",  async() => {
    const formData = new URLSearchParams();

    formData.append("username", val("username"));
    formData.append("password", val("password"));
    formData.append("first_name", val("firstName"));
    formData.append("second_name", val("secondName"));
    formData.append("gender", val("gender"));
    formData.append("about", val("aboutYou"));
    formData.append("interests", val("interests"));

    let response = await fetch("/api/user/create", {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    if (response.status === 200) {
        let data = await response.json();
        localStorage.setItem("userID", data.id);
        window.location.href = "/profile/"+data.id;
    } else {
        alert(response.statusText);
    }
});

function val(elem) {
    return document.getElementById(elem).value;
}
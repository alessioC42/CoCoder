const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get('id');

const translateKeysToTitle = {
    "id": null,
    "password":null,
    "username": "username",
    "first_name":"first name",
    "second_name":"second name",
    "gender":"gender",
    "about":null,
    "interests": null,
    "socials":null
};

function createUserInfoTable(userData) {
    const tbody = document.getElementById("userdata-table-body");

    let keys = Object.keys(userData);

    tbody.innerHTML = "";
    keys.forEach(key => {
        if (translateKeysToTitle[key]) {
            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            let td2 = document.createElement("td");

            tr.appendChild(td1);
            tr.appendChild(td2);

            td1.innerHTML = `<b>${translateKeysToTitle[key]}</b>`;
            td2.innerText = userData[key];

            tbody.appendChild(tr);
        }
    });

}


(async () => {
    let response = await fetch(`/api/user/${userID}`);
    let userData = await response.json();
    if (response.status === 200) {
        createUserInfoTable(userData);
        document.getElementById("title-username").innerText = userData.username;
        document.getElementById("user-about-me").innerText = userData.about;
        document.getElementById("user-interests").innerText = userData.interests;
    }
})();
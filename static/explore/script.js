const createLanguageSelect = document.getElementById("languages");

const createTopicSelect = document.getElementById("topics");


async function loadMultiselect() {
    let response = await fetch("/assets/programming_languages_and_topics.json");
    let { languages, topics } = await response.json();

    if (languages && topics) {
        createLanguageSelect.innerHTML = "";
        createTopicSelect.innerHTML = "";


        const createOption = (str) => {
            let option = document.createElement("option");
            option.value = str;
            option.innerText = str;
            return option;
        }

        languages.forEach(language => {
            createLanguageSelect.appendChild(createOption(language));
        });

        topics.forEach(topic => {
            createTopicSelect.appendChild(createOption(topic));
        });

        $("#languages").selectpicker();
        $("#topics").selectpicker();
    }

}
document.getElementById("create-tab-button").addEventListener("click", loadMultiselect);

document.getElementById("create-new-project-button").addEventListener("click", async () => {
    let userID = localStorage.getItem("userID");
    if (userID) {
        const formData = new URLSearchParams();

        formData.append("userID", localStorage.getItem("userID"));
        formData.append("title", val("title"));
        formData.append("about", val("about"));
        formData.append("languages", JSON.stringify(getValues("languages")));
        formData.append("topics", JSON.stringify(getValues("topics")));


        let response = await fetch("/api/projects/create", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (response.status === 200) {
            window.location.reload();
        } else {
            alert(response.statusText);
        }
    } else {
        window.location.href = "/register";
    }

});

function val(elem) {
    return document.getElementById(elem).value;
}

function getValues(elem) {
    return $(`#${elem}`).val();
}


let container = document.getElementById("card-container");

document.getElementById("button-search").addEventListener("click", async () => {
    let query = document.getElementById("input-search").value;
    await search(query)
});

async function search(query) {
    let response = await fetch("/api/explore/search?q="+encodeURIComponent(query));
    let projects = await response.json();

    if (projects.length === 0) {
        container.innerHTML = "Nothing Found. Try searching for something else!"
    } else {
        container.innerHTML = ""
    }

    for (const project of projects) {
        container.appendChild(await buildProjectCard(project.item.id));
    }
}

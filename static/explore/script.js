const exploreLanguageSelect = document.getElementById("search-filter-languages");
const createLanguageSelect = document.getElementById("languages");

const exploreTopicSelect = document.getElementById("search-filter-topics");
const createTopicSelect = document.getElementById("topics");


async function loadProgrammingLanguages() {
    let response = await fetch("/assets/programming_languages_and_topics.json");
    let { languages, topics } = await response.json();

    if (languages && topics) {
        exploreLanguageSelect.innerHTML = "";
        createLanguageSelect.innerHTML = "";
        exploreTopicSelect.innerHTML = "";
        createTopicSelect.innerHTML = "";


        const createOption = (str) => {
            let option = document.createElement("option");
            option.value = str;
            option.innerText = str;
            return option;
        }

        languages.forEach(language => {
            exploreLanguageSelect.appendChild(createOption(language));
            createLanguageSelect.appendChild(createOption(language));
        });

        topics.forEach(topic => {
            exploreTopicSelect.appendChild(createOption(topic));
            createTopicSelect.appendChild(createOption(topic));
        });

        $("#search-filter-languages").selectpicker();
        $("#languages").selectpicker();
        $("#search-filter-topics").selectpicker();
        $("#topics").selectpicker();
    }

}

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

loadProgrammingLanguages();

let container = document.getElementById("card-container");

(async () => {
    container.appendChild(
        await buildProjectCard(1)
    );
})()
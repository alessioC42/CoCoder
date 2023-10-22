async function buildProjectCard(id, projectData=undefined){
    if (!projectData) {
        let responseProjectData = await fetch('/api/projects/'+id);
        projectData = await responseProjectData.json();
    }

    let responseUserData = await fetch('/api/user/'+projectData.owner);
    let userData = await responseUserData.json();

    const cardRoot = document.createElement("div");
    cardRoot.classList.add("card");
    cardRoot.classList.add("mt-2")
    cardRoot.id = `card-project-${projectData.id}`;

    let languageBadgesHTML = "";
    let topicBadgesHTML = "";


    JSON.parse(projectData.languages).forEach(language => {
        languageBadgesHTML += randomBadge(language);
    });

    JSON.parse(projectData.topics).forEach(topic => {
        topicBadgesHTML += randomBadge(topic);
    });


    cardRoot.innerHTML = `
        <div class="card-body">
            <h3>${projectData.title}</h3>
            <div class="text-body">
                ${truncateString(projectData.about, 400)}
            </div>
            <div class="card-footer">
                <div>${languageBadgesHTML}</div>
                <div>${topicBadgesHTML}</div>
            </div>
            <div class="position-absolute top-0 end-0 m-1" style="cursor: pointer" >
            <div class="d-inline" onclick="window.location.href='/profile/?id=${userData.id}'">
                ${userData.username}
            </div>
            <div class="d-inline" onclick="window.location.href='mailto:${userData.email}'">
                ${messageSVG}
            </div>
            </div>
        </div>`

    return cardRoot;
}

const badgeStates = ["success", "danger", "warning", "info", "light", "dark"]
function randomBadge(str) {
    let color = badgeStates[badgeStates.length * Math.random() | 0];

    return `<span class="badge rounded-pill m-1 bg-${color}">${str}</span>`;
}

const messageSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16"><path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/></svg>`

function truncateString(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}
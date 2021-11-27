let rouletteList = [];

let currentpage = 0;

function addNewLevels() {
    currentpage++;
    fetch("https://gdbrowser.com/api/search/*?type=recent&page=" + currentpage).then(res => res.json()).then(data => {
        data.forEach(level => {
            challenges.push(level);
        });
    });
}

fetch("https://gdbrowser.com/api/search/*?type=recent").then(res => res.json()).then(data => {
    data.forEach(level => {
        rouletteList.push(level);
    });
});

let challenges = [];
let ended = false;

function start() {
    for (let i = 0; i < rouletteList.length; i++) {
        challenges.push(rouletteList[i]);
    }

    document.getElementById("start").style.cursor = "no-drop";
    document.getElementById("start").style.backgroundColor = "rgb(39, 35, 35)";
    document.getElementById("start").setAttribute("onclick", "");
    document.getElementById("stop").style.backgroundColor = "#ba0000";
    document.getElementById("stop").addEventListener("dblclick", () => {
        if (ended) return;
        document.getElementById("stop").style.backgroundColor = "rgb(39, 35, 35)";
        ended = true;
        endGame();
    });

    setTimeout(() => {
        addChallenge();
    }, 500);
}


/* continue game */

let id = 0;
let topPX = 100;

let skips = 0;
let attempts = 50;

function _submit(_id, _id_input, _challengeID, _id_skip) {
    try {
        const submit = document.getElementById("" + _id);
        const input = document.getElementById("" + _id_input);
        const challenge = document.getElementById("" + _challengeID);
        const skip = document.getElementById("" + _id_skip);

        let val = parseInt(input.value);
        if (!val) val = 1;

        if (challenges[0] == undefined) {
            addNewLevels();
        }

        submit.style.cssText = "display: none";
        input.style.cssText = "display: none";
        skip.style.cssText = "display: none";

        attempts -= val;
        attempts++;

        document.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].textContent = `${attempts} Attempts`;
        document.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].style.left = "42%";
        
        if (attempts <= 0) {
            attempts = 0;
            document.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].textContent = `${attempts} Attempts`;
            document.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].style.color = "red";
            endGame();
            return;
        }

        challenge.innerHTML += `
            <h3>${val} Attempts</h3>
        `

        addChallenge();
    } catch (error) {
        alert(error)
    }
}

function skip(id) {
    const challenge = document.getElementById(`challenge-${id}`);
    document.querySelector(`#challenge-${id}`).getElementsByTagName("input")[0].style.display = "none";
    document.querySelector(`#challenge-${id}`).getElementsByTagName("button")[0].style.display = "none";
    document.querySelector(`#challenge-${id}`).getElementsByTagName("button")[1].style.display = "none";
    attempts -= 4;

    challenge.innerHTML += `
        <h3>Skipped</h3>
    `
    skips++;
    document.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].textContent = `${attempts} Attempts`;
    document.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].style.left = "42%";

    addChallenge();

}

function endGame() {
    topPX += 60;

    document.querySelector(`#challenge-${id}`).getElementsByTagName("input")[0].style.display = "none";
    document.querySelector(`#challenge-${id}`).getElementsByTagName("button")[0].style.display = "none";
    document.querySelector(`#challenge-${id}`).getElementsByTagName("button")[1].style.display = "none";

    document.querySelector(`#challenge-${id}`).innerHTML += `
        <h3>Game Ended</h3>
    `

    document.querySelector(".game").innerHTML += `
        <div class="gameEnd" id="end">
            <h1>Game Ended!</h1>
            <h2>Levels Completed: ${id}</h2>
            <h2>Refresh the page to play again.</h2>
        </div>
    `

    document.querySelector(`#end`).animate([
        {
            "top": "-500px"
        },
        {
            "top": `${topPX}px`
        }
    ], 1000);

    setTimeout(() => {
        document.getElementById(`end`).style.top = `${topPX}px`
    }, 1000);
}

function addChallenge() {
    var num = $s().random(challenges.length - 1);
    const challenge = challenges[num];

    challenges.splice(num, 1);
    id += 1;

    topPX += 40;
    document.querySelector(".game").innerHTML += `
        <div class="challenge" id="challenge-${id}">
            <h1>${challenge["name"]}</h1>
            <h2>${challenge["id"]}</h2>

            <input type="number" id="input-${id}">
            <button id="submit-${id}" onclick='_submit("submit-${id}", "input-${id}", "challenge-${id}", "skip-${id}")'>Submit</button>
            <button class="skip" id="skip-${id}" onclick='skip("${id}")'>Skip</button>
        </div>
    `

    document.querySelector(`#challenge-${id}`).animate([
        {
            "top": "-500px"
        },
        {
            "top": `${topPX}px`
        }
    ], 1000);

    setTimeout(() => {
        document.getElementById(`challenge-${id}`).style.top = `${topPX}px`
    }, 1000);
}
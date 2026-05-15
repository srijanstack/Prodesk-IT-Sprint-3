const loader = document.getElementById("loader");
const userCard = document.getElementById("userCard");

const userInput = document.getElementById("userInput");
const searchBtn = document.getElementById("searchBtn");

const dataLoaded = document.getElementsByClassName("dataLoaded");
const enterUsr = document.getElementById("enterUsr");

const resultHeader = document.getElementById("resultHeader");
const repoContainer = document.getElementById("repoContainer");

const latestRepoHead = document.getElementById("latestRepoHead");
const battleModeBtn = document.getElementById("battleModeBtn");
const battleContainer = document.getElementById("battleMode");

const player1 = document.getElementById("player-1");
const player2 = document.getElementById("player-2");

const playerOneInput = document.getElementById("playerOneInput");
const playerTwoInput = document.getElementById("playerTwoInput");

const battleBtn = document.getElementById("battleBtn");


const loaderUI = `<div
          class="h-full w-full text-white flex items-center justify-center m-20 ml-0 "
        >
          <i class="fa-solid fa-circle-notch animate-spin text-[4rem]"></i>
        </div>`

battleBtn.addEventListener('click', () => {
  if (!playerOneInput.value || !playerTwoInput.value) {
    alert("Enter both player Username");
    return
  }
  battle(playerOneInput.value, playerTwoInput.value)
  playerOneInput.value = "";
  playerTwoInput.value = "";
})


async function battle(username1, username2) {
  player1.classList.remove("hidden");
  player2.classList.remove("hidden");
  player1.innerHTML = loaderUI;
  player2.innerHTML = loaderUI;

  try {
    const [user1, repos1, user2, repos2] = await Promise.all([
      fetchUser(username1),
      fetchRepos(username1),
      fetchUser(username2),
      fetchRepos(username2),
    ]);

    const playerOne = {
      user: user1,
      totalStars: calculateTotalStars(repos1),
    };

    const playerTwo = {
      user: user2,
      totalStars: calculateTotalStars(repos2),
    };

    renderBattleResults(playerOne, playerTwo);
  } catch (error) {
    const errorUI = renderError(error.message);

    player1.innerHTML = errorUI;
    player2.innerHTML = errorUI;
  }
}

function renderBattleResults(p1, p2) {
  player1.innerHTML = createCard(
    p1,
    p1.totalStars,
    p2.totalStars,
    "Player One"
  );

  player2.innerHTML = createCard(
    p2,
    p2.totalStars,
    p1.totalStars,
    "Player Two"
  );
}


function createCard(player, stars, opponentStars, label) {
  const isWinner = stars > opponentStars;
  const isTie = stars === opponentStars;

  let statusText = "Loser";
  let statusClass = "bg-red-500/20 text-red-400";

  if (isWinner) {
    statusText = "Winner";
    statusClass = "bg-green-500/20 text-green-400";
  }

  if (isTie) {
    statusText = "Tie";
    statusClass = "bg-gray-500/20 text-gray-300";
  }

  return `
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-bold text-white">${label}</h2>
      <span class="px-3 py-1 rounded-full ${statusClass} text-sm font-semibold">
        ${statusText}
      </span>
    </div>

    <div class="flex justify-center mb-4">
      <img
        src="${player.user.avatar_url}"
        alt="${player.user.login}"
        class="w-24 h-24 rounded-full border-4 border-slate-700 object-cover"
      />
    </div>

    <div class="text-center mb-5">
      <h3 class="text-2xl font-bold text-white">
        ${player.user.name || player.user.login}
      </h3>

      <a
        href="${player.user.html_url}"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-400 text-sm hover:underline"
      >
        @${player.user.login}
      </a>
    </div>

    <div class="bg-slate-900 rounded-xl p-4 text-center">
      <p class="text-slate-400 text-sm uppercase tracking-wide mb-1">
        Total Stars
      </p>

      <p class="text-3xl font-bold text-yellow-400">
        ⭐ ${stars.toLocaleString()}
      </p>
    </div>
  `;
}

async function fetchUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);

  if (!res.ok) {
    throw new Error(`User ${username} not found`);
  }

  return res.json();
}

async function fetchRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );


  if (!res.ok) {
    throw new Error(`Repos for ${username} not found`);
  }

  return res.json();
}

function calculateTotalStars(repos) {
  return repos.reduce((total, repo) => {
    return total + repo.stargazers_count;
  }, 0);
}

battleModeBtn.addEventListener('click', () => {
  battleContainer.classList.toggle("hidden")
})


searchBtn.addEventListener('click', () => {
  const user = userInput.value;
  if (!user) {
    alert("Enter the username");
    return
  }
  getUser(user)
})


function formatDate(isoDate) {
  const date = new Date(isoDate);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderProfile(data) {
  userCard.classList.add("flex");
  userCard.classList.remove("hidden");
  userCard.innerHTML = `
      <div class="flex justify-center md:justify-start">
        <img
          src="${data.avatar_url}"
          loading="lazy"
          alt="${data.login}"
          class="w-36 h-36 md:w-64 md:h-64 rounded-full object-cover border-4 border-slate-700"
        />
      </div>

      <div class="flex-1">
        
        <div class="flex flex-col md:items-start md:justify-center gap-2 mb-4">
   
            <h1 class="text-3xl font-bold text-white">
              ${data.name || data.login}
            </h1>
            <a
              href="${data.html_url}"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-400 hover:underline"
            >
              @${data.login}
            </a>
       

          <p class="text-sm text-slate-400">
            Joined ${formatDate(data.created_at)}
          </p>
        </div>
        <p class="text-slate-300 leading-relaxed mb-6">
          ${data.bio || "This profile has no bio."}
        </p>

        <div class="bg-slate-900 rounded-xl px-6 py-4 grid grid-cols-3 text-center mb-6">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-400">Repos</p>
            <p class="text-xl font-bold text-white">${data.public_repos}</p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide text-slate-400">Followers</p>
            <p class="text-xl font-bold text-white">${data.followers}</p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide text-slate-400">Following</p>
            <p class="text-xl font-bold text-white">${data.following}</p>
          </div>
        </div>
      </div>
  `;
}

function renderError(message) {

  const errorUI = `
    <div class="w-full text-center py-10">
      <i class="fa-solid fa-circle-exclamation text-red-500 text-5xl mb-4"></i>
      <h2 class="text-3xl font-semibold text-red-400 mb-2">
        ${message}
      </h2>
      <p class="text-gray-400">
        Please try another GitHub username.
      </p>
    </div>
  `;
  return errorUI;
}

async function getUser(username) {
  if (username) {
    resultHeader.classList.remove("hidden");
    resultHeader.innerText = ` Result for ${username}`;
    enterUsr.classList.add("hidden");
    latestRepoHead.innerHTML = `Latest repos for ${username}`
    latestRepoHead.classList.remove("hidden")
    renderRepos([]);
  };
  try {
    loader.classList.remove("hidden");
    userCard.classList.add("hidden");
    userCard.classList.remove("flex");
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("User Not Found");
      } else {
        throw new Error("Something Went Wrong");
      }
    }
    const data = await res.json();
    getUserRepos(username)
    renderProfile(data);
  } catch (error) {
    userCard.classList.add("flex");
    userCard.classList.remove("hidden");
    renderRepos([]);
    userCard.innerHTML = renderError(error.message);
  } finally {
    loader.classList.add("hidden");
  }
}

async function getUserRepos(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
    const data = await res.json();
    renderRepos(data)
  } catch {
    throw new Error("No repos found")
  }
}

function renderRepos(repos) {
  const languageColors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SCSS: "#c6538c",
    Sass: "#c6538c",
    Less: "#1d365d",

    Python: "#3572A5",
    Java: "#b07219",
    "C#": "#178600",
    C: "#555555",
    "C++": "#f34b7d",
    Rust: "#dea584",
    Go: "#00ADD8",
    Kotlin: "#A97BFF",
    Swift: "#F05138",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Perl: "#0298c3",
    Dart: "#00B4AB",
    Lua: "#000080",
    R: "#198CE7",
    MATLAB: "#e16737",

    Shell: "#89e051",
    Bash: "#89e051",
    PowerShell: "#012456",

    SQL: "#336791",
    PLpgSQL: "#336791",

    JSON: "#292929",
    YAML: "#cb171e",
    XML: "#0060ac",
    Markdown: "#083fa1",

    Vue: "#41b883",
    Svelte: "#ff3e00",

    Jupyter: "#DA5B0B",
    Dockerfile: "#384d54",
    Makefile: "#427819",
    CMake: "#DA3434",

    Haskell: "#5e5086",
    Elixir: "#6e4a7e",
    Erlang: "#B83998",
    Clojure: "#db5855",
    OCaml: "#ef7a08",
    "F#": "#b845fc",
    Fortran: "#4d41b1",
    COBOL: "#005ca5",

    Assembly: "#6E4C13",
    Solidity: "#AA6746",
    "Objective-C": "#438eff",
    "Objective-C++": "#6866fb",

    "TeX": "#3D6117",
    LaTeX: "#3D6117",

    Unknown: "#6b7280", // gray fallback
  };

  if (repos.length === 0) {
    repoContainer.innerHTML = `
      <p class="text-slate-400 col-span-full text-center">
        No public repositories found.
      </p>
    `;
    return;
  }

  repoContainer.innerHTML = repos.slice(0, 5)
    .map(
      (repo) => {
        const color = languageColors[repo.language] || languageColors.Unknown;
        return `<a href="${repo.html_url}"
            target="_blank"
            rel="noopener noreferrer"
            class="block bg-slate-800 hover:bg-slate-700 transition-colors duration-300 rounded-xl p-4 border border-slate-800 min-h-[180px]"
          >
            <h3 class="text-md font-semibold text-blue-400 mb-2 break-words">
               ${repo.name}
            </h3>

            <p class="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-4">
              ${repo.description || "No description available."}
            </p>

            <div class="flex flex-col gap-1 text-[11px] text-slate-500 mt-auto">
              <span><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
              <span><i class="fa-solid fa-code-branch"></i>  ${repo.forks_count}</span>
                <span class="flex items-center gap-1">
                <span
                class="w-3 h-3 rounded-full"
                style="background-color: ${color}"
                  ></span>
                ${repo.language || "Unknown"}
                 </span>
            </div>
          </a>`

      }
    ).join("")
}

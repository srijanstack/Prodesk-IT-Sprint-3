const loader = document.getElementById("loader");
const userCard = document.getElementById("userCard");

const userInput = document.getElementById("userInput");
const searchBtn = document.getElementById("searchBtn");

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
    userCard.innerHTML = `
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
}

async function getUser(username) {
    try {
        loader.classList.remove("hidden");
        userCard.innerHTML = "";
        const res = await fetch(`https://api.github.com/users/${username}`);

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("User Not Found");
            } else {
                throw new Error("Something Went Wrong");
            }
        }
        const data = await res.json();
        renderProfile(data);
    } catch (error) {
        renderError(error.message);
    } finally {
        loader.classList.add("hidden");
    }
}

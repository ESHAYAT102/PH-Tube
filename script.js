const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
};

const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
};

const removeActiveClass = () => {
  const activeBtn = document.getElementsByClassName("active");
  for (const btn of activeBtn) {
    btn.classList.remove("active");
  }
};

const fetchCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

const fetchVideos = (searchText = "") => {
  showLoader();
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      document.getElementById("btn-all").classList.add("active");
      displayVideos(data.videos);
    });
};

const fetchCategoryVideos = (id) => {
  showLoader();
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const clickedBtn = document.getElementById(`btn-${id}`);
      clickedBtn.classList.add("active");
      displayVideos(data.category);
    });
};

const fetchVideoDetails = (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => displayVideoDetails(data.video));
};

const displayVideoDetails = (video) => {
  document.getElementById("videoDetails").showModal();
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = /* html */ `
  <div class="card bg-base-100 image-full w-full">
    <figure>
      <img class="w-full h-44 object-cover" src="${video.thumbnail}" />
    </figure>
    <div class="card-body">
      <h2 class="card-title mb-10">${video.title}</h2>
      <p>${video.description}</p>
    </div>
  </div>
  `;
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");

  for (const category of categories) {
    const div = document.createElement("div");
    div.innerHTML = /* html */ `
          <button
            id="btn-${category.category_id}"
            onclick="fetchCategoryVideos(${category.category_id})"
            class="btn btn-sm hover:bg-[#ff1f3d] hover:text-white">${category.category}</button>
    `;
    categoryContainer.append(div);
  }
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");

  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.innerHTML = /* html */ `
          <div
            class="col-span-full py-20 flex flex-col gap-10 justify-center items-center text-center"
          >
            <img class="w-32" src="./assets/Icon.png" />
            <h2 class="text-2xl font-bold">
              Oops!! Sorry, There Is No Content Here.
            </h2>
          </div>
    `;
    hideLoader();
    return;
  }

  videos.forEach((video) => {
    const videoCard = document.createElement("div");

    videoCard.innerHTML = /* html */ `
    <div class="card bg-base-100">
      <figure class="relative">
        <img class="w-full h-44 object-cover" src=${
          video.thumbnail
        } alt="Thumbnail" />
        <span
          class="absolute bottom-2 right-2 text-white bg-slate-800 px-2 py-1 text-sm rounded-md"
          >3 hrs 56 mins ago</span
        >
      </figure>

      <div class="px-0 py-5 flex gap-3">
        <div class="profile">
          <div class="avatar">
            <div class="w-10 rounded-full">
              <img
                src=${video.authors[0].profile_picture}
              />
            </div>
          </div>
        </div>
        <div class="intro">
          <h2 class="text-lg font-semibold">${video.title}</h2>
          <p class="text-sm text-slate-500 flex items-center gap-1">
            ${video.authors[0].profile_name}
            ${
              video.authors[0].verified === true
                ? /* html */ `
                <img
                  class="w-5 h-5"
                  src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png"
                />`
                : ``
            }
          </p>
          <p class="text-sm text-slate-500">${video.others.views}</p>
        </div>
      </div>
      <button onclick="fetchVideoDetails('${
        video.video_id
      }')" class="btn btn-block">Description</button>
    </div>
    `;
    videoContainer.append(videoCard);
  });
  hideLoader();
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  const input = e.target.value;
  fetchVideos(input);
});

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.getElementById("search-input").focus();
  }
});

fetchCategories();
fetchVideos();

const maps = {
  yosemite: { title: "Yosemite Campgrounds", image: "../assets/images/yosemite-campgrounds.png", alt: "Map of Yosemite campgrounds", description: "This map shows Yosemite National Park campgrounds, roads, seasonal access, and major destinations such as Yosemite Valley and Tuolumne Meadows.", details: "The Yosemite map is useful for understanding where campgrounds sit in relation to park roads, valleys, rivers, and visitor destinations. Several locations and roads are marked as seasonal or subject to closure." },
  sequoia: { title: "Sequoia and Kings Canyon National Parks", image: "../assets/images/sequoia-kings-canyon.png", alt: "Map of Sequoia and Kings Canyon National Parks", description: "This map covers the connected Sequoia and Kings Canyon National Parks area, including trails, wilderness areas, roads, campgrounds, and visitor centers.", details: "The map shows the mountainous terrain and the relationship between Sequoia National Park, Kings Canyon National Park, and surrounding national forests. It includes detailed trail and facility information." },
  "death-valley": { title: "Death Valley National Park", image: "../assets/images/death-valley.png", alt: "Map of Death Valley National Park", description: "This map shows Death Valley's roads, mountain ranges, valleys, visitor centers, campgrounds, and other park facilities.", details: "Death Valley is a large park with long distances between locations. The map helps visitors identify the main roads, remote areas, services, and access points surrounding the valley system." }
};

function selectedMap() {
  return new URLSearchParams(window.location.search).get("map") || "yosemite";
}

function updateImageMap(key) {
  const coordinates = {
    yosemite: ["0,0,686,283", "0,283,686,566", "0,566,686,849"],
    sequoia: ["0,0,1351,683", "0,683,1351,1366", "0,1366,1351,2048"],
    "death-valley": ["0,0,1336,596", "0,596,1336,1191", "0,1191,1336,1787"]
  };
  document.querySelectorAll(".map-area").forEach((area, index) => {
    area.coords = coordinates[key][index];
  });
}

function renderMap(key) {
  const map = maps[key] || maps.yosemite;
  const image = document.querySelector("#map-image");

  if (image) {
    image.src = map.image;
    image.alt = map.alt;
    document.querySelector("#map-title").textContent = map.title;
    document.querySelector("#map-description").textContent = map.description;
    document.querySelector("#map-caption").textContent = `${map.title} map`;
    document.querySelector("#summary-title").textContent = map.title;
    document.querySelector("#summary-text").textContent = map.details;
    document.querySelector("#reference-link").href = `map-reference.html?map=${key}`;
    document.querySelectorAll(".map-switcher button").forEach((button) => {
      button.classList.toggle("active", button.dataset.map === key);
    });
    updateImageMap(key);
  }

  const referenceTitle = document.querySelector("#reference-title");
  if (referenceTitle) {
    referenceTitle.textContent = `${map.title} — Map Reference`;
    document.querySelector("#reference-intro").textContent = map.description;
    document.querySelector("#reference-details").textContent = map.details;
  }
}

renderMap(selectedMap());

document.querySelectorAll(".map-switcher button").forEach((button) => {
  button.addEventListener("click", () => {
    history.replaceState(null, "", `?map=${button.dataset.map}`);
    renderMap(button.dataset.map);
  });
});

document.querySelectorAll(".map-area").forEach((area) => {
  area.addEventListener("click", () => {
    document.querySelector("#summary-text").textContent = `You selected the ${area.dataset.region} region of this map. ${maps[selectedMap()].details}`;
  });
});

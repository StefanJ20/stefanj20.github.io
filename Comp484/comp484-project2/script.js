"use strict";

var pet_info = {
  name: "Hound",
  weight: 12,
  happiness: 70,
  energy: 65
};

var actionHistory = [];
var careCount = 0;
var storageKey = "gigapet-hound-v1";

var activities = {
  treat: {
    title: "Treat",
    comments: ["Thanks for the treat.", "That was good."]
  },
  play: {
    title: "Play",
    comments: ["That was fun.", "Let's play again."]
  },
  exercise: {
    title: "Exercise",
    comments: ["I'm tired after that walk.", "I need a short break."]
  },
  rest: {
    title: "Rest",
    comments: ["I feel rested.", "I'm ready to play again."]
  }
};

$(function () {
  loadGame();
  checkAndUpdatePetInfoInHtml();

  actionHistory.slice().reverse().forEach(addActivityEntry);
  filterActivity();

  $(".treat-button").on("click", clickedTreatButton);
  $(".play-button").on("click", clickedPlayButton);
  $(".exercise-button").on("click", clickedExerciseButton);
  $(".rest-button").on("click", clickedRestButton);
  $("#activity-filter").on("change", filterActivity);
  $("#reset-button").on("click", resetGame);
});

function clickedTreatButton() {
  pet_info.weight += 2;
  pet_info.happiness += 8;
  pet_info.energy += 4;
  finishAction("treat");
}

function clickedPlayButton() {
  pet_info.weight -= 1;
  pet_info.happiness += 12;
  pet_info.energy -= 12;
  finishAction("play");
}

function clickedExerciseButton() {
  pet_info.weight -= 2;
  pet_info.happiness -= 6;
  pet_info.energy -= 16;
  finishAction("exercise");
}

function clickedRestButton() {
  pet_info.happiness += 4;
  pet_info.energy += 24;
  finishAction("rest");
}

function finishAction(action) {
  var comments = activities[action].comments;

  var memory = {
    action: action,
    comment: comments[Math.floor(Math.random() * comments.length)],
    time: Date.now()
  };

  careCount += 1;
  checkAndUpdatePetInfoInHtml();
  $("#pet-comment").text(memory.comment);

  actionHistory.unshift(memory);
  actionHistory = actionHistory.slice(0, 8);

  addActivityEntry(memory);
  filterActivity();
  saveGame();
}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

function checkWeightAndHappinessBeforeUpdating() {
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }

  pet_info.happiness = Math.max(0, Math.min(100, pet_info.happiness));
  pet_info.energy = Math.max(0, Math.min(100, pet_info.energy));
}

function updatePetInfoInHtml() {
  $(".name").text(pet_info.name);
  $(".weight").text(pet_info.weight);
  $(".happiness").text(pet_info.happiness);
  $(".energy").text(pet_info.energy);
  $("#care-count").text(careCount);

  document.querySelector("#happiness-meter").value = pet_info.happiness;
  document.querySelector("#energy-meter").value = pet_info.energy;

  var status = "Normal";

  if (pet_info.energy < 25) {
    status = "Tired";
  } else if (pet_info.happiness < 30) {
    status = "Unhappy";
  } else if (pet_info.happiness >= 85) {
    status = "Happy";
  }

  $("#mood-label").text(status);
}

function addActivityEntry(memory) {
  var template = document.querySelector("#activity-template");

  // .clone() copies the template's list item and all of its children.
  // The original stays unchanged so it can be reused for the next activity.
  // With no arguments, event handlers and jQuery data are not copied.
  // The copied item has no IDs, so it will not duplicate an existing ID.
  // https://api.jquery.com/clone/
  var entry = $(template.content.firstElementChild).clone()[0];
  var time = new Date(memory.time);

  entry.dataset.action = memory.action;

  entry.querySelector(".activity-title").textContent =
    activities[memory.action].title;

  entry.querySelector(".activity-comment").textContent = memory.comment;
  entry.querySelector("time").dateTime = time.toISOString();

  entry.querySelector("time").textContent = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

  var log = document.querySelector("#activity-log");
  log.insertBefore(entry, log.firstChild);

  while (log.children.length > 8) {
    log.lastElementChild.remove();
  }
}

function filterActivity() {
  var selected = document.querySelector("#activity-filter").value;
  var entries = $("#activity-log .activity-entry");

  // .filter() returns the entries matching the selected activity.
  // Its callback runs for each entry, with `this` referring to that element.
  // Returning true includes the entry; false leaves it out of the result.
  // The method does not change the page itself. We hide all entries, then
  // unhide the matches. Other entries remain available for another filter.
  // https://api.jquery.com/filter/
  var matches = entries.filter(function () {
    return selected === "all" || this.dataset.action === selected;
  });

  entries.each(function () {
    this.hidden = true;
  });

  matches.each(function () {
    this.hidden = false;
  });

  var message = document.querySelector("#history-empty");
  message.hidden = matches.length > 0;

  message.textContent = actionHistory.length === 0
    ? "No activities yet."
    : "No matching activities in the last 8 entries.";
}

function saveGame() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      pet_info: pet_info,
      history: actionHistory,
      careCount: careCount
    }));

    $("#save-status").text("Progress saved.");
  } catch (error) {
    $("#save-status").text("Progress will not be saved in this browser.");
  }
}

function loadGame() {
  try {
    var saved = JSON.parse(localStorage.getItem(storageKey));

    if (!saved || !saved.pet_info) {
      return;
    }

    ["weight", "happiness", "energy"].forEach(function (key) {
      var value = saved.pet_info[key];

      if (Number.isFinite(value) && value >= 0) {
        pet_info[key] = Math.floor(value);
      }
    });

    if (Number.isSafeInteger(saved.careCount) && saved.careCount >= 0) {
      careCount = saved.careCount;
    }

    if (Array.isArray(saved.history)) {
      actionHistory = saved.history.filter(function (entry) {
        return entry &&
          Object.hasOwn(activities, entry.action) &&
          activities[entry.action].comments.includes(entry.comment) &&
          Number.isFinite(entry.time) &&
          entry.time >= 0 &&
          entry.time <= Date.now();
      }).slice(0, 8);
    }

    $("#save-status").text("Saved progress loaded.");
  } catch (error) {
    $("#save-status").text("No saved progress loaded.");
  }
}

function resetGame() {
  pet_info = {
    name: "Hound",
    weight: 12,
    happiness: 70,
    energy: 65
  };

  actionHistory = [];
  careCount = 0;

  document.querySelector("#activity-log").replaceChildren();
  document.querySelector("#activity-filter").value = "all";

  $("#pet-comment").text("Let's start again.");

  checkAndUpdatePetInfoInHtml();
  filterActivity();
  saveGame();
}
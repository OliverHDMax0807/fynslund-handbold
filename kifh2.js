"use strict";

/* =========================================================
   MOBILMENU
========================================================= */

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    });
  });
}


/* =========================================================
   HJEMMEKAMPE · ANTAL FASTLAGTE KAMPE
========================================================= */

const homeMatchCards = [
  ...document.querySelectorAll(".home-match-card")
];

const homeGamesCounter = document.querySelector(
  ".home-games-count strong"
);

function isPlannedMatch(matchCard) {
  return matchCard.dataset.status !== "upcoming";
}

function updateHomeGamesCount() {
  if (!homeGamesCounter) return;

  const plannedMatches =
    homeMatchCards.filter(isPlannedMatch).length;

  homeGamesCounter.textContent = plannedMatches;
}

updateHomeGamesCount();


/* =========================================================
   MÅNEDER SOM DROPDOWN / ACCORDION
========================================================= */

const monthDropdowns = [
  ...document.querySelectorAll(".month-dropdown")
];

function updateMonthDropdownLabels() {
  monthDropdowns.forEach((monthDropdown) => {
    const status = monthDropdown.querySelector(
      ".month-dropdown-status"
    );

    if (!status) return;

    status.textContent = monthDropdown.open ? "Luk" : "Åbn";
  });
}

function openMonthFromHash() {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);

  if (!target) return;

  const monthDropdown = target.closest(".month-dropdown");

  if (monthDropdown) {
    monthDropdown.open = true;
  }

  updateMonthDropdownLabels();
}

monthDropdowns.forEach((monthDropdown) => {
  monthDropdown.addEventListener("toggle", () => {
    if (monthDropdown.open) {
      monthDropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== monthDropdown) {
          otherDropdown.open = false;
        }
      });
    }

    updateMonthDropdownLabels();
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchorLink) => {
  anchorLink.addEventListener("click", () => {
    window.setTimeout(openMonthFromHash, 0);
  });
});

window.addEventListener("hashchange", openMonthFromHash);

updateMonthDropdownLabels();
openMonthFromHash();
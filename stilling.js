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
   STILLINGER
========================================================= */

const dataElement = document.querySelector("#standings-data");
const standingsList = document.querySelector("#standingsList");
const standingsCount = document.querySelector("#standingsCount");
const rowTemplate = document.querySelector("#standings-row-template");

function getPoints(team) {
  if (
    team.pointsOverride !== null &&
    team.pointsOverride !== undefined &&
    team.pointsOverride !== ""
  ) {
    return Number(team.pointsOverride);
  }

  return Number(team.wins) * 2 + Number(team.draws);
}

function getGoalDifference(team) {
  return Number(team.goalsFor) - Number(team.goalsAgainst);
}

function formatGoalDifference(difference) {
  if (difference > 0) {
    return `+${difference}`;
  }

  return String(difference);
}

function createHeader() {
  const header = document.createElement("div");

  header.className = "standings-header";
  header.innerHTML = `
    <div>#</div>
    <div>Hold</div>
    <div>K</div>
    <div>V</div>
    <div>U</div>
    <div>T</div>
    <div>Mål</div>
    <div>+/-</div>
    <div>P</div>
  `;

  return header;
}

function fillText(row, selector, value) {
  const cell = row.querySelector(selector);

  if (cell) {
    cell.textContent = value;
  }
}

function createRow(team) {
  const row =
    rowTemplate.content.firstElementChild.cloneNode(true);

  const difference = getGoalDifference(team);
  const points = getPoints(team);

  row.classList.toggle("is-fynslund", Boolean(team.highlight));

  fillText(row, '[data-cell="rank"]', team.rank);
  fillText(row, '[data-cell="team-name"]', team.name);
  fillText(row, '[data-cell="played"]', team.played);
  fillText(row, '[data-cell="wins"]', team.wins);
  fillText(row, '[data-cell="draws"]', team.draws);
  fillText(row, '[data-cell="losses"]', team.losses);
  fillText(
    row,
    '[data-cell="goals"]',
    `${team.goalsFor} - ${team.goalsAgainst}`
  );
  fillText(
    row,
    '[data-cell="difference"]',
    formatGoalDifference(difference)
  );
  fillText(row, '[data-cell="points"]', points);

  const logo = row.querySelector(".standings-team img");

  if (logo) {
    logo.src = team.logo || "intetlogo.png";
    logo.alt = `${team.name} logo`;
  }

  const differenceCell =
    row.querySelector('[data-cell="difference"]');

  if (differenceCell) {
    differenceCell.classList.toggle(
      "standings-diff-positive",
      difference > 0
    );

    differenceCell.classList.toggle(
      "standings-diff-negative",
      difference < 0
    );
  }

  return row;
}

function createBoard(competition) {
  const board = document.createElement("article");
  board.className = "standings-board";
  board.id = competition.id;

  const header = document.createElement("header");
  header.className = "standings-board-header";

  const titleGroup = document.createElement("div");

  const subtitle = document.createElement("span");
  subtitle.textContent = competition.subtitle || "Sæson";

  const title = document.createElement("h3");
  title.textContent = competition.title;

  const note = document.createElement("p");
  note.textContent = competition.note || "";

  titleGroup.append(subtitle, title);

  if (competition.note) {
    titleGroup.append(note);
  }

  const meta = document.createElement("div");
  meta.className = "standings-board-meta";

  meta.textContent =
    competition.teams.length === 1
      ? "1 hold"
      : `${competition.teams.length} hold`;

  header.append(titleGroup, meta);

  const scroll = document.createElement("div");
  scroll.className = "standings-table-scroll";

  const grid = document.createElement("div");
  grid.className = "standings-grid";

  grid.append(createHeader());

  const teams = [...competition.teams].sort(
    (a, b) => Number(a.rank) - Number(b.rank)
  );

  teams.forEach((team) => {
    grid.append(createRow(team));
  });

  scroll.append(grid);
  board.append(header, scroll);

  return board;
}

function createEmptyMessage() {
  const empty = document.createElement("div");

  empty.className = "standings-empty";
  empty.innerHTML = `
    <h3>Ingen stillinger endnu</h3>
    <p>Tilføj hold i datafeltet nederst i HTML-filen.</p>
  `;

  return empty;
}

function renderStandings() {
  if (!dataElement || !standingsList || !rowTemplate) {
    return;
  }

  let data;

  try {
    data = JSON.parse(dataElement.textContent);
  } catch (error) {
    standingsList.append(createEmptyMessage());
    console.error("Stillingsdata kunne ikke læses:", error);
    return;
  }

  const competitions = Array.isArray(data.competitions)
    ? data.competitions
    : [];

  standingsList.innerHTML = "";

  if (competitions.length === 0) {
    standingsList.append(createEmptyMessage());
    return;
  }

  let totalRows = 0;

  competitions.forEach((competition) => {
    const teams = Array.isArray(competition.teams)
      ? competition.teams
      : [];

    totalRows += teams.length;

    standingsList.append(
      createBoard({
        ...competition,
        teams
      })
    );
  });

  if (standingsCount) {
    standingsCount.textContent = totalRows;
  }
}

renderStandings();
//Example fetch using DnD5eAPI - place subclasses in ul

let list = document.querySelector("ul");
const creatureContainer = document.querySelector(".display-creature");
const savingThrowContainer = document.querySelector(".saving-throw-container");
const skillsContainer = document.querySelector(".skills-container");
const abilitiesContainer = document.querySelector(".abilities-container");
const actionsContainer = document.querySelector(".actions-container");
let searchContainer = document.querySelector(".search-creature");
let displayNotesContainer = document.querySelector(".display-notes");
const noteStrong = document.querySelector(".note-bold");
let savedNotesStyle = document.querySelector(".note-saved-message");
let removedDisplay = document.querySelector(".note-text");

const legendaryActionsContainer = document.querySelector(
  ".legendary-actions-container"
);
let textAreaContainer = document.querySelector(".notes-container");
const notesDisplay = document.querySelector(".notes-display");
let legendaryActionTitle = document.querySelector(".legendary-action-title");
let actionTitle = document.querySelector(".action-title");

let actionStyle = document.querySelector(".actions");
let legendaryActionStyle = document.querySelector(".legendary-actions");

actionStyle.classList.remove("actions");
legendaryActionStyle.classList.remove("legendary-actions");

let bestiaryAdded = document.querySelector(".bestiary-added");
let savedMonsters = [];

document.querySelector("button").addEventListener("click", getFetch);

function addToBestiary(monsterName, monsteralignment, monsterimage) {
  bestiaryAdded.innerText = "";

  let existingButton = document.querySelector(".store-monster-button");
  if (existingButton) {
    existingButton.remove();
  }

  const storeMonsterButton = document.createElement("button");
  storeMonsterButton.type = "button";
  storeMonsterButton.textContent = " Add To Bestiary";
  storeMonsterButton.classList.add("store-monster-button");
  // searchContainer.appendChild(storeMonsterButton);
  document.querySelector(".creature-name").appendChild(storeMonsterButton);

  storeMonsterButton.addEventListener("click", () => {
    if (!localStorage.getItem(`monster_${monsterName}`)) {
      localStorage.setItem(`monster_${monsterName}`, monsterName);
      localStorage.setItem(`alignment_${monsterName}`, monsteralignment);
      localStorage.setItem(`image_${monsterName}`, monsterimage);

      bestiaryAdded.classList.remove("alert-add-bestiary");
      bestiaryAdded.classList.add("confirm-add-bestiary");

      bestiaryAdded.innerText = `${monsterName} has been added to your bestiary`;
    } else {
      bestiaryAdded.classList.add("alert-add-bestiary");
      bestiaryAdded.classList.remove("confirm-add-bestiary");

      bestiaryAdded.innerText = `${monsterName} is already in the bestiary`;
    }
  });
}

loadSavedMonster();

function loadSavedMonster() {
  savedMonsters = [];

  for (const [key, value] of Object.entries(localStorage)) {
    //console.log(`${key}, ${value}`);

    if (key.startsWith("monster_")) {
      const monsterName = localStorage.getItem(key);
      savedMonsters.push(monsterName);
      const note =
        localStorage.getItem(monsterName) || "No notes for this monster";
      const alignment = localStorage.getItem(`alignment_${monsterName}`);
      console.log(alignment);
      const image = localStorage.getItem(`image_${monsterName}`);

      const container = document.createElement("div");
      container.classList = "monster-card";
      displayNotesContainer.appendChild(container);

      const displayMonsterName = document.createElement("h2");
      displayMonsterName.classList = "monster-name";
      displayMonsterName.innerText = monsterName;
      displayMonsterName.style.cursor = "pointer";
      container.appendChild(displayMonsterName);

      const displayMonsterImage = document.createElement("img");
      displayMonsterImage.classList = "monster-thumbnail";
      if (image) {
        displayMonsterImage.src = `https://www.dnd5eapi.co${image}`;
      } else {
        displayMonsterImage.src = ``;
      }
      container.appendChild(displayMonsterImage);

      const displayMonsterNotes = document.createElement("p");
      displayMonsterNotes.classList = "monster-note";
      displayMonsterNotes.innerText = note;
      container.appendChild(displayMonsterNotes);

      const removeMonster = document.createElement("a");
      removeMonster.classList = "monster-remove";
      removeMonster.innerText = "Remove";
      container.appendChild(removeMonster);

      // When clicking
      displayMonsterName.addEventListener("click", (e) => {
        const text = e.target.innerText;
        document.querySelector("input").value = text;
      });

      // When clicking remove button
      removeMonster.addEventListener("click", () => {
        localStorage.removeItem(key);
        localStorage.removeItem(monsterName);
        localStorage.removeItem(`alignment_${monsterName}`);
        localStorage.removeItem(`image_${monsterName}`);
        container.remove();

        let noteText = document.querySelector(".note-text");

        noteText.classList.add("note-text-remove");
        noteText.innerText = `The ${monsterName} has been removed from the bestiary`;
        console.log(localStorage.length);

        if (localStorage.length === 0) {
          bestiaryAdded.innerText = "";
          noteText.innerText = `The bestiary is empty`;
        }
      });

      if (alignment.includes("evil") || alignment.includes("non-good")) {
        container.style.borderColor = "red";
      } else if (alignment.includes("good")) {
        container.style.borderColor = "green";
      } else if (alignment.includes("neutral")) {
        container.style.borderColor = "gray";
      } else if (
        alignment.includes("any alignment") ||
        alignment.includes("unaligned")
      ) {
        container.style.border = "dashed  gray";
      }
    }
  }
  // Adds the remove all button
  if (!savedMonsters.length > 0) {
    // bestiaryAdded.innerText = `Monsters In Bestiary: ${savedMonsters.join(", ")}`;
    bestiaryAdded.innerText =
      "Either search for a monster to add to your index or Add the monsters with your notes to the index";
  } else {
    const removeAll = document.createElement("button");
    removeAll.classList.add("remove-all");
    removeAll.textContent = "Reset Bestiary";
    bestiaryAdded.appendChild(removeAll);
    removeAll.addEventListener("click", () => {
      localStorage.clear();
      bestiaryAdded.innerText = "";
      displayNotesContainer.innerText = "";
      document.querySelector(".note-text").classList.remove("note-text-reset");
      document.querySelector(".note-text").classList.add("note-text-reset");
      document.querySelector(".note-text").innerText = `Bestiary Reset`;
    });
  }
}

console.log(savedMonsters.length);

function getFetch() {
  const choice = document.querySelector("input").value;
  const choiceChange = choice.toLowerCase().replaceAll(" ", "-");
  const url = `https://www.dnd5eapi.co/api/monsters/${choiceChange}`;

  if (!isNaN(choiceChange)) {
    document.querySelector(".error").innerText = "Please Enter A Valid Monster";
    return;
  } else {
    document.querySelector(".error").innerText = "";
  }

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        document.querySelector(".error").innerText =
          "Please Enter A Valid Monster";
        throw new Error("Monster not found");
      }
      return res.json(); // parse response as JSON
    })
    .then((data) => {
      console.log(data);
      savingThrowContainer.innerText = ""; // Clear previous saving throws
      skillsContainer.innerText = ""; // Clear previous skills
      abilitiesContainer.innerText = "";
      actionsContainer.innerText = "";
      legendaryActionsContainer.innerText = "";
      displayNotesContainer.innerText = "";
      bestiaryAdded.classList.remove("alert-add-bestiary");
      bestiaryAdded.classList.remove("confirm-add-bestiary");
      savedNotesStyle.classList.remove("note-saved-message-saved");
      removedDisplay.classList.remove("note-text-remove");

      actionTitle.innerText = "";
      document.querySelector(".condition-immunity").innerText = "";
      document.querySelector(".damage-immunity").innerText = "";
      document.querySelector(".languages").innerText = "";
      document.querySelector(".damage").innerText = "";
      document.querySelector(".condition").innerText = "";
      document.querySelector(".note-text").innerText = "";

      notesDisplay.innerText = "";

      document.querySelector("h2").innerText = data.name;
      document.querySelector("h2").style.textDecoration = "underline";

      document
        .querySelector(".whole-container")
        .classList.add("container-style");

      addToBestiary(data.name, data.alignment, data.image);

      // Bestiary title, when clicked returns users reload and monsters in index
      document.querySelector(".home").style.cursor = "pointer";
      document.querySelector(".home").addEventListener("click", () => {
        location.reload();
      });

      // Notes

      createTextArea(data.name);

      if (data.subtype) {
        document.querySelector(
          ".creature-misc"
        ).innerText = `${data.size} ${data.type} (${data.subtype}) ${data.alignment}`;
      } else {
        document.querySelector(
          ".creature-misc"
        ).innerText = `${data.size} ${data.type}, ${data.alignment}`;
      }

      // Display Image, if no image display a question mark and say it hasn't been discovered by the beastiary
      if (data.image) {
        document.querySelector(".no-image").innerText = "";
        document.querySelector(
          "img"
        ).src = `https://www.dnd5eapi.co${data.image}`;
        document.querySelector("img").alt = `${data.name} image`;
        document.querySelector("img").classList.add("monster-image");
      } else {
        document.querySelector("img").src = "";
        document.querySelector("img").alt = "";
        // Insert a picture to display there is no entry
        document.querySelector(".no-image").innerText =
          "There is no picture of this creature in the bestiary";
      }

      // Monster specification
      document.querySelector(".armor-name").innerText = "Armor Class";
      document.querySelector(
        ".armor"
      ).innerText = ` ${data.armor_class[0].value} (${data.armor_class[0].type} armor)`;

      document.querySelector(".hitpoints-name").innerText = "Hit Points";
      document.querySelector(
        ".hit-points"
      ).innerText = ` ${data.hit_points} ${data.hit_points_roll}`;

      // Creates span element with monsters speed
      objectPropertyDom(data.speed, "Speed: ", ".speed", ".speed-name");

      // Monsters attributes
      document.querySelector(".stat-sheet").classList.add("border");
      document.querySelector(".str").innerText = `STR`;
      document.querySelector(".str-num").innerText = data.strength;

      document.querySelector(".dex").innerText = `DEX`;
      document.querySelector(".dex-num").innerText = data.dexterity;

      document.querySelector(".con").innerText = `CON`;
      document.querySelector(".con-num").innerText = data.constitution;

      document.querySelector(".int").innerText = `INT`;
      document.querySelector(".int-num").innerText = data.intelligence;

      document.querySelector(".wis").innerText = `WIS`;
      document.querySelector(".wis-num").innerText = data.wisdom;

      document.querySelector(".cha").innerText = `CHA`;
      document.querySelector(".cha-num").innerText = data.charisma;

      // Saving throws And Skil
      getSkills(data);

      // Immunities
      getObjectValue(
        data.damage_immunities,
        "Damage Immunities",
        ".damage-immunity"
      );

      conditionLoops(
        data.condition_immunities,
        "Condition Immunity",
        ".condition-immunity"
      );

      objectPropertyDom(data.senses, "Senses ", ".senses", ".senses-bold");

      // Languages
      document.querySelector(".languages-bold").innerText = "Language";
      document.querySelector(".languages").innerText = data.languages;

      // Challenge rating, exp and profeciency
      document.querySelector(".challenge-bold").innerText = "Challenge";
      document.querySelector(
        ".challenge"
      ).innerText = ` ${data.challenge_rating} (${data.xp} XP)`;
      document.querySelector(".proficiency-bold").innerText = "Proficiency";
      document.querySelector(
        ".proficiency"
      ).innerText = `+${data.proficiency_bonus}`;

      // Special Abilities Monster
      document.querySelector(".special-abilities").classList.add("border");
      apiToDom(
        data.special_abilities,
        "special-abilities-container",
        "ability-name",
        "ability.desc",
        abilitiesContainer
      );

      // Get Actions

      actionTitle.innerText = "Actions";
      apiToDom(
        data.actions,
        "actions-container",
        "action-name",
        "action-desc",
        actionsContainer
      );

      // Get Legendary Actions
      if (data.legendary_actions.length > 0) {
        legendaryActionTitle.innerText = "Legendary Actions";

        apiToDom(
          data.legendary_actions,
          "legendary-actions-container",
          "legendary-action-name",
          "legendary-action-desc",
          legendaryActionsContainer
        );
      } else {
        legendaryActionTitle.innerText = "";
        legendaryActionStyle.classList.remove("container-style");
      }
      //style for players notes here

      noteStrong.innerText = "Notes:";

      // Stop
    })

    .catch((err) => {
      console.log(`error ${err}`);
      document.querySelector(".error").innerText =
        "Please Enter A Valid Monster";
    });
}

const apiToDom = (data, divClass, nameClass, descClass, container) => {
  data.forEach((ability) => {
    // Create div to store all html elements of special abilities
    const div = document.createElement("div");
    div.classList = divClass;
    container.appendChild(div);
    // Create the span element and attach to the newly created div the span element for the ability name
    const spanName = document.createElement("span");
    spanName.classList = nameClass;
    spanName.classList.add("strong");
    spanName.innerText = `${ability.name}. `;
    div.appendChild(spanName);

    // Create the span element and attach to the newly created div the span element for the description
    const spanDesc = document.createElement("span");
    spanDesc.classList = descClass;
    spanDesc.innerText = ability.desc;
    div.appendChild(spanDesc);
  });
};

function getSkills(data) {
  // Saving Throws

  let noCommaSaving = [];
  let noCommaSkills = [];

  data.proficiencies.forEach((prof) => {
    const profAttribute = prof.proficiency.name;
    const attributeArray = profAttribute.split(" ");

    if (attributeArray.includes("Saving")) {
      noCommaSaving.push(` ${attributeArray[2]} +${prof.value}`);
    } else if (attributeArray.includes("Skill:")) {
      noCommaSkills.push(`${attributeArray[1]} +${prof.value}`);
    }
  });

  if (noCommaSaving.length > 0) {
    const savingThrowElement = document.createElement("span");
    savingThrowElement.classList = "saving-throws";
    savingThrowElement.innerText = "Saving Throws: ";
    savingThrowContainer.appendChild(savingThrowElement);

    const savingSpan = document.createElement("span");
    savingSpan.innerText = noCommaSaving.join(", ");
    savingThrowContainer.appendChild(savingSpan);
  }

  if (noCommaSkills.length > 0) {
    const skillsElement = document.createElement("span");
    skillsElement.classList = "skills";
    skillsElement.innerText = "Skills: ";
    skillsContainer.appendChild(skillsElement);

    const skillsSpan = document.createElement("span");
    skillsSpan.innerText = noCommaSkills.join(", ");
    skillsContainer.appendChild(skillsSpan);
  }
}

function conditionLoops(data, stringValue, htmlElement) {
  // Damage Immunities

  document.querySelector(`${htmlElement}`).innerText = "";

  let conditionImmunityArray = [];

  data.forEach((immunity) => {
    conditionImmunityArray.push(immunity.name);
  });

  if (conditionImmunityArray.length > 0) {
    document.querySelector(".condition").innerText = `${stringValue}`;
    document.querySelector(
      `${htmlElement}`
    ).innerText = ` ${conditionImmunityArray.join(", ")}`;
  }
}

function getObjectValue(data, stringValue, htmlElement) {
  // Damage Immunities
  const immunityArray = Object.values(data);

  if (immunityArray.length > 0) {
    document.querySelector(`.damage`).innerText = `${stringValue}`;
    document.querySelector(`${htmlElement}`).innerText = `${immunityArray.join(
      ", "
    )}`;
  }
}

function objectPropertyDom(data, stringValue, htmlElement, className) {
  let objectArr = [];

  const container = document.querySelector(htmlElement);

  for (const [key, value] of Object.entries(data)) {
    const formattedKey =
      key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");
    objectArr.push(`${formattedKey} ${value}`);
  }

  if (objectArr.length > 0) {
    document.querySelector(className).innerText = `${stringValue}`;
    container.innerText = ` ${objectArr.join(", ")} `;
  }
}
// Handles the note taking and saving to each specific monster allowing an edit aswell
function createTextArea(monster) {
  const theMonster = monster;
  // Create text area
  savedNotesStyle.innerText = "";
  textAreaContainer.innerText = "";

  const textArea = document.createElement("textarea");
  textArea.style.width = "600px";
  textArea.style.height = "200px";
  textArea.placeholder = `Enter your notes about ${monster} here`;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Save Note";

  const editButton = document.createElement("button");
  editButton.type = "Edit";
  editButton.style.display = "none";
  editButton.textContent = "Edit";

  textAreaContainer.appendChild(textArea);
  textAreaContainer.appendChild(button);
  textAreaContainer.appendChild(editButton);

  const savedNote = localStorage.getItem(`${monster}`);

  if (savedNote) {
    notesDisplay.innerText = savedNote;
    textArea.value = savedNote;
    textArea.disabled = true;
    button.disabled = true;
    editButton.style.display = "inline";
    button.style.display = "none";
  }

  button.addEventListener("click", saveValue);
  editButton.addEventListener("click", editNote);

  function editNote() {
    document.querySelector(".note-saved-message").innerText = "";
    textArea.disabled = false;
    button.disabled = false;
    button.textContent = "Save Note";
    button.style.display = "inline";
    editButton.style.display = "none";
    savedNotesStyle.classList.remove("note-saved-message-saved");
  }

  function saveValue() {
    const noteText = textArea.value;
    console.log(noteText);
    notesDisplay.innerText = noteText;

    if (!localStorage.getItem(`${theMonster}`)) {
      localStorage.setItem(`${theMonster}`, noteText);
      textArea.disabled = true;
      button.disabled = true;
      button.style.display = "none";
      savedNotesStyle.classList.add("note-saved-message-saved");
      savedNotesStyle.innerText = "The Note Has Been Saved";
      editButton.style.display = "inline";
    } else {
      localStorage.setItem(`${theMonster}`, noteText);
      textArea.disabled = true;
      button.disabled = true;
      button.style.display = "none";
      savedNotesStyle.classList.add("note-saved-message-saved");
      editButton.style.display = "inline";
      savedNotesStyle.innerText = "The Note Has Been Edited";
    }
  }
}

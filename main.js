// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

/*
document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
*/

// IMPORTS *********************
import * as db from "./database.js";
import "animate.css";
import "./app.css";
import moment from "moment";
moment().format();

// SELECT HTML ELEMENTS  ********************************
const cardContainer = document.querySelector(".cards ul");
const form = document.querySelector("form");
const inputName = form.querySelector("input[name = name]");
const inputPlace = form.querySelector("input[name = place]");
const inputProblem = form.querySelector("input[name = problem]");
const textareaDescription = form.querySelector("textarea[name = description]");
const textareaSolution = form.querySelector("textarea[name = solution]");
const saveButton = form.querySelector(".save");
const inputId = form.querySelector("input[name = delete]");
const deleteButton = form.querySelector(".delete");
const blockDelete = form.querySelector(".blockDelete");
const updateButton = form.querySelector(".update");

// const moment = require('moment');
// CREATE NEW CARDS, INSERT INTO DOM ********************

function createNewCard(
  container,
  id,
  time,
  name,
  place,
  problem,
  description,
  solution
) {
  let newCard = document.createElement("li");
  // vytvorim id pro kazdou novou kartu abych ji mohl pozdeji mazat nebo updatovat
  newCard.id = `card-${id}`;
  
  newCard.innerHTML = `
      <p> Id: ${id} | Time: ${time} | Name: ${name} | Station: ${place} | Problem: ${problem}</p>
            
      <p class='updateDescriptionButton'> <strong>Description: </strong> </p>
      <p contenteditable ='true' class='edit'>${description}</p>
      <p> <strong> Solution: </strong> </p>
      <p contenteditable ='true' class='editTwo'>${solution}</p>
      <button type="button" class="updateLocal">Save</button>
    `;

  newCard;
  
  container.prepend(newCard);
}

// SUBMIT DATA ********************************************

saveButton.addEventListener("click", async function (event) {
  // zabrani se automatickemu reloadu stranky
  event.preventDefault();
  // potrebujeme aby byly vyplneny vsecky policka
  if (
    !inputName.value ||
    !inputPlace.value ||
    !inputProblem.value ||
    !textareaDescription.value ||
    !textareaSolution.value
  ) {
    alert("Fill out all required data");
    return;
  }
  // insert new card into database
  db.insertCard(
    inputName.value,
    inputPlace.value,
    inputProblem.value,
    textareaDescription.value,
    textareaSolution.value
  ).then((data) => {
    //console.log(data[0].created_at = new Date(data[0].created_at).toLocaleTimeString("cz-CZ"));
    if (data) {
      createNewCard(
        cardContainer,
        data[0].id, 
        data[0].created_at = new Date(data[0].created_at).toLocaleTimeString("cz-CZ"),
        inputName.value,
        inputPlace.value,
        inputProblem.value,
        textareaDescription.value,
        textareaSolution.value
      );
      resetForm();
    }
    
  });
  
});

form.addEventListener("keyup", async function (event) {
  // zabrani se automatickemu reloadu stranky
  event.preventDefault();
  // kdyz klavesa neni enter, konec
  if (event.code !== "Enter") return;
  // potrebujeme aby byly vyplneny vsecky policka
  if (
    !inputName.value ||
    !inputPlace.value ||
    !inputProblem.value ||
    !textareaDescription.value ||
    !textareaSolution.value
  )
    return;
  // insert new card into database
  db.insertCard(
    inputName.value,
    inputPlace.value,
    inputProblem.value,
    textareaDescription.value,
    textareaSolution.value
  ).then((data) => {
    if (data) {
      createNewCard(
        cardContainer,
        data[0].id,
        data[0].created_at = new Date(data[0].created_at).toLocaleTimeString("cz-CZ"),
        inputName.value,
        inputPlace.value,
        inputProblem.value,
        textareaDescription.value,
        textareaSolution.value
      );
      resetForm();
    }
  });
});

// FETCH CARDS
function resetForm() {
  inputName.value = "";
  inputPlace.value = "";
  inputProblem.value = "";
  textareaDescription.value = "";
  textareaSolution.value = "";
  //kurzor zustane blikat v inputName
  inputName.focus();
}

// RESET inputId fromulare
function resetInputId() {
  inputId.value = "";
}

// DELETE REQUIRED BLOCK *******************************************
deleteButton.addEventListener("click", async function (event) {
  // zabrani se automatickemu reloadu stranky
  event.preventDefault();

  if (!inputId.value) return;

  db.deleteCards(inputId.value);
  const wer = document.querySelector("#card-" + inputId.value);

  wer.classList.add("animate__animated", "animate__zoomOut");
  setTimeout(() => {
    wer.parentNode.removeChild(wer);
  }, 900); // Remove after 900ms (matching the transition time)

  resetInputId();
});

// EDIT CARDS - update
updateButton.addEventListener("click", async function (event) {
  event.preventDefault();
  // Mark place to edit, get array description line
  let dataNew = document.querySelectorAll(".edit");
  dataNew.forEach((node) => {
    // get Value and parent ID
    const nodeValue = node.innerHTML;
    // transform data
    const nodeId = parseInt(node.parentNode.id.split("-")[1], 10);
    //  call function updateCards
    db.updateCards(nodeValue, nodeId);
  });

  // Edit solution line
  let dataNewTwo = document.querySelectorAll(".editTwo");
  dataNewTwo.forEach((node) => {
    // get Value and parent ID
    let nodeValue = node.innerHTML;
    // transform data
    let nodeId = parseInt(node.parentNode.id.split("-")[1], 10);
    //  call function updateCards
    db.updateCardsTwo(nodeValue, nodeId);
  });
});

// FETCH CARDS

db.fetchCards().then((cardsTwo) => {
  cardsTwo.sort((a, b) => a.id - b.id);

  cardsTwo.forEach((card) => {
    createNewCard(
      cardContainer,
      card.id,
      (card.created_at = new Date(card.created_at).toLocaleTimeString("cz-CZ")),
      card.name,
      card.place,
      card.problem,
      card.description,
      card.solution
    );
    
  }); 
});

// UPDATE INDIVIDUALNE

const seznamElementu = document.querySelector("#myEditableList");
// vyberu oblast kde budu klikat
seznamElementu.addEventListener("click", function (event) {
  event.preventDefault();
  const clickedElement = event.target;
// definuji co se stane kdyz kliknu pouze na danny objekt
  if (clickedElement.classList.contains("updateLocal")) {
    const parentElement = clickedElement.parentNode;
    const parentId = +parentElement.id.split("-")[1];
    const descriptionUpdate = parentElement.childNodes[5].innerHTML;
    const solutionUpdate = parentElement.childNodes[9].innerHTML;

    db.updateCardsLocal(descriptionUpdate, solutionUpdate, parentId);

  } 
});

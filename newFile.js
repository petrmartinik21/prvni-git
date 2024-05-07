import * as db from "./database.js";
import { deleteButton, inputId, resetInputId } from "./main.js";

// DELETE REQUIRED BLOCK *******************************************
deleteButton.addEventListener("click", async function (event) {
  // zabrani se automatickemu reloadu stranky
  event.preventDefault();

  if (!inputId.value) return;

  db.deleteCards(inputId.value);
  document
    .querySelector("#card-" + inputId.value)
    .classList.add("animate__animated", "animate__zoomOut")
    .remove();
  resetInputId();
});

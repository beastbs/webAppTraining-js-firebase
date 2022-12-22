import { Question } from "./question";
import { createModal, isValid } from "./utils";
import { authWithEmailAndPassword, getAuthForm } from "./auth";

import "./styles.css";

const form = document.getElementById("form");
const modalBtn = document.getElementById("modal-btn");
const input = form.querySelector("#question-input");
const submitBtn = form.querySelector("#submit");

window.addEventListener("load", Question.renderList);
modalBtn.addEventListener("click", openModal);
form.addEventListener("submit", submitFormHandler);
input.addEventListener("input", () => {
  submitBtn.disabled = !isValid(input.value);
});

function submitFormHandler(event) {
  event.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    };

    submitBtn.disabled = true;
    // Async req to server to save question
    Question.create(question).then(() => {
      input.value = "";
      input.className = "";
      submitBtn.disabled = false;
    });
  }
}

function openModal() {
  createModal("Авторизация", getAuthForm());
  document
    .getElementById("auth-form")
    .addEventListener("submit", authFormHandler, { once: true });
}

function authFormHandler(event) {
  event.preventDefault();

  const btn = event.target.querySelector("button");
  const email = event.target.querySelector("#email").value;
  const password = event.target.querySelector("#password").value;

  btn.disabled = true;
  authWithEmailAndPassword(email, password)
    // .then((token) => {
    //   // с token можем делать запрос на beckend для получения списка вопросов);
    //   return Question.fetch(token);
    // })
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => (btn.disabled = false));
}

function renderModalAfterAuth(content) {
  console.log(content);
}

"use strict";

//Element Selectors:

//== CONTAINERS ==
//Add new job
const newJob = document.querySelector(".form");
const newJobContainer = document.querySelector(".add-new-job-container");

//Task
const job = document.querySelector(".job");

//Buttons
const btnNew = document.querySelector(".btn-new-job");
const btnAdd = document.querySelector(".btn-add");
const btnBack = document.querySelector(".btn-back");
const btnEdit = document.querySelector(".btn-edit");
const btnDelete = document.querySelector(".btn-delete");
const btnChecked = document.querySelector(".btn-checked");

//Show new Job Container on-click btnNew
btnNew.addEventListener("click", function (e) {
  e.preventDefault();
  newJob.classList.remove("hidden");
  newJob.style.opacity = 1;
});

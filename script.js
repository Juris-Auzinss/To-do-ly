'use strict';

class Task {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(title, description, checked) {
    this.title = title;
    this.description = description;
    this.checked = checked;
  }
}

//====SELECTORS:====
const wrapper = document.querySelector('.wrapper');
//Input form
const btnNew = document.querySelector('.btn-new-job');
const form = document.querySelector('.form');
const formTitle = document.querySelector('.form-title-input');
const formDescription = document.querySelector('.form-descr-input');
//Todo List
const toDoListCont = document.querySelector('.tasks');
const job = document.querySelector('.job');
//Buttons
const btnAdd = document.querySelector('.btn-add');
const btnBack = document.querySelector('.btn-back');
const btnEdit = document.querySelector('.btn-edit');
const btnDelete = document.querySelector('.btn-delete');
const btnChecked = document.querySelector('.btn-checked');

class App {
  todoList = [];
  constructor() {
    //Get local storage
    this._getLocalStorage();
    //Attach event handlers
    btnNew.addEventListener('click', this._showForm.bind(this));
    form.addEventListener('submit', this._newTask.bind(this));
  }

  //APP METEHODS(functions):
  //Show Input Form
  _showForm(e) {
    form.classList.toggle('hidden');
    form.style.opacity = 1;
    btnNew.classList.toggle('disabled');
  }

  //Hide Input Form
  _hideForm(e) {
    if (!form.classList.contains('hidden')) form.classList.toggle('hidden');
    form.style.display = 'none';
    btnNew.classList.toggle('disabled');
    formTitle.value = formDescription.value = '';
  }

  //Load and Show all existing tasks
  //Get data from local Storage
  _getLocalStorage() {}

  //Add new Task
  _newTask(e) {
    e.preventDefault();
    //Get data from inputs:
    const title = formTitle.value;
    const description = formDescription.value;
    let task;
    //create a new Task from Task class:
    task = new Task(title, description, true);

    //Render task in the list:
    this._renderTask(task);

    // //Add just created task to #todoList array:
    this.todoList.push(task);

    // //Hide form:
    this._hideForm();

    // //Set local Storage to all tasks:
    this._setLocalStorage();
  }

  //Render task
  _renderTask(task) {
    let html = `
    <li class="job" data-id="${task.id}">
      <div class="left-panel">
        <button type="" class="btn btn-checked">
          ${task.checked ? '<i class="fas fa-check"></i>' : ''}
        </button>
      </div>
      <div class=${
        task.checked ? '"text-container checked"' : '"text-container"'
      }>
        <div class="title">
          <h2>${task.title}</h2>
        </div>`;
    task.description === ''
      ? (html += '')
      : (html += `
        <div class="description">
          <p>${task.description}</p>
        </div>`);
    html += `
        <div class="date-created">
          <p>Created: ${task.date}</p>
        </div>
      </div>
      <div class="buttons-panel">
        <button class="btn btn-edit"><i class="fas fa-pen"></i></button>
        <button class="btn btn-delete">
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </li>
    `;
    toDoListCont.insertAdjacentHTML('afterend', html);
  }

  _setLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.todoList));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('tasks'));

    if (!data) return;

    this.todoList = data;
    this.todoList.forEach(task => {
      this._renderTask(task);
    });
  }
}

const app = new App();

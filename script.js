'use strict';

class Task {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(title, description, checked) {
    this.title = title;
    this.description = description;
    this.checked = checked;

    this.published = this._formatTaskDate(this.date, navigator.language);
  }

  _formatTaskDate(date, locale) {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);
    // console.log(daysPassed);
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
      return new Intl.DateTimeFormat(locale).format(date);
    }
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
const textContainer = document.querySelector('.text-container');
const editForm = document.querySelector('.edit-form');

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
    // form.addEventListener('submit', this._newTask.bind(this));
    wrapper.addEventListener('click', this._btnClick.bind(this));
  }

  //APP METEHODS(functions):
  //Show Input Form
  _showForm(e) {
    e.preventDefault();
    form.classList.toggle('hidden');
    form.style.opacity = 1;
    btnNew.classList.toggle('disabled');
  }

  //Hide Input Form
  _hideForm() {
    e.preventDefault();
    if (!form.classList.contains('hidden')) {
      form.classList.add('hidden');
    }
    form.style.display = 'none';
    btnNew.classList.toggle('disabled');
    formTitle.value = formDescription.value = '';
  }

  _hideFormAgain() {
    form.classList.add('hidden');
    btnNew.classList.toggle('disabled');
    formTitle.value = formDescription.value = '';
  }

  //Add new Task
  _newTask(e) {
    e.preventDefault();
    //Get data from inputs:
    const title = formTitle.value;
    const description = formDescription.value;
    let task;
    //create a new Task from Task class:
    if (title.length > 0) {
      task = new Task(title, description, false);
    }
    //Render task in the list:
    this._renderTask(task);

    //Add just created task to #todoList array:
    this.todoList.push(task);

    //Set local Storage to all tasks:
    this._setLocalStorage();

    //Hide form:
    this._hideFormAgain();
  }

  //Button click delegation:
  _btnClick(e) {
    e.preventDefault();
    //FORM clicks
    if (e.target.classList.contains('btn-add')) {
      this._newTask(e);
    }
    if (e.target.classList.contains('btn-back')) {
      this._hideFormAgain();
    }
    //TASK FUNTIONS:
    //get parent element of the click
    let item = e.target.closest('.job');
    if (!item) return;
    let jobId = item.dataset.id;
    //Find the task index in toDolist Array.
    let index = this.todoList.findIndex(task => task.id === jobId);

    //CHECKED FUNCTIONALITY:
    if (e.target.classList.contains('btn-checked')) {
      //CHange state of checked in todoList
      if (!this.todoList[index].checked) {
        this.todoList[index].checked = true;
      } else {
        this.todoList[index].checked = false;
      }
      //toggle classes in DOM:
      let text = item.querySelector('.text-container');
      text.classList.toggle('checked');
      item.querySelector('.btn-checked').classList.toggle('checked');
      //save checked status to local Storage:
      this._setLocalStorage();
    }

    //EDIT TASK FUNCTIONALITY:
    let title = '';
    let description = '';
    if (e.target.classList.contains('btn-edit')) {
      //get title and description
      title = item.querySelector('h2').innerHTML;
      description = item.querySelector('p').innerHTML;
      // create new HTML code for replacing in job as a childreplace()?
      let editHtml = `
          <div class="form edit-form">
            <div class="edit-job-container">
              <div class="left-panel">
                <div class="left-panel">&nbsp;</div>
              </div>
              <div class="form-text-container">
                <div class="form-item">
                  <input
                    type="text"
                    name="title"
                    class="form-title-input"
                    value="${title}"
                  />
                </div>
                <div class="form-item">
                  <textarea
                    type="text"
                    name="description"
                    class="form-descr-input"
                  >${description}</textarea>
                </div>
              </div>
              <div class="buttons-panel">
                <button type="submit" class="btn btn-ok">
                  <i class="fas fa-check"></i>
                </button>
                <button type="reset" class="btn btn-back">
                  <i class="fas fa-undo-alt"></i>
                </button>
              </div>
            </div>
          </div>
      `;
      item.innerHTML = editHtml;
    }

    //Submit to toDolist if btn-ok is clicked.
    if (e.target.classList.contains('btn-ok')) {
      // Set newly input values to Title and Description:
      title = item.querySelector('input').value;
      description = item.querySelector('textarea').value;
      //Add changes to todoList array
      this.todoList[index].title = title;
      this.todoList[index].description = description;
      //Push chenges to Local Storage
      this._setLocalStorage();
      //Reload local Storage
      this._getLocalStorage();
      //Remove EDIT TASK DOM
      item.remove();
    }

    //DELET TASK FUNCTIONALITY:
    if (e.target.classList.contains('btn-delete')) {
      //Remove DOM
      item.remove();
      //Remove from todoList array
      this.todoList.splice([index], 1);
      //Remove from local Storage
      this._removeLocalStorage(index);
      //Reload local Storage
      this._getLocalStorage();
    }
  }

  //Render task
  _renderTask(task) {
    if (!task) return;
    let html = `
    <li class="job" data-id="${task.id}">
      <div class="left-panel">
        <button type="" class="btn btn-checked ${
          task.checked ? 'checked' : ''
        }">
          <i class="fas fa-check"></i>
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
          <p>Created: ${task.published}</p>
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

  //STORAGE FUNCTIONS:
  //--SET
  _setLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.todoList));
  }
  //-GET
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('tasks'));

    if (!data) return;
    //
    this.todoList = data;
    this.todoList.forEach(task => {
      this._renderTask(task);
    });
  }
  //-REMOVE
  _removeLocalStorage(index) {
    localStorage.removeItem('tasks', JSON.stringify(this.todoList[index]));
  }

  _renderTasks() {
    this.todoList.forEach(task => {
      this._renderTask(task);
    });
  }
}

const app = new App();

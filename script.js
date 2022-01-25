const form = document.querySelector('#todoForm');
const input = document.querySelector('#todoInput');
const output = document.querySelector('#output');

let todos = [];



const fetchTodos = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/?_limit=10')
  const data = await res.json()
  todos = data;

  listTodos();
}

fetchTodos();


const listTodos = () => {
  output.innerHTML = ''
  todos.forEach(todo => {
    output.appendChild(createTodoElement(todo))
  })
}

const createTodoElement = todo => {

  let card = document.createElement('div');
  card.classList.add('todo');
  if (todo.completed === true) {
    card.classList.add('checked')
  }
  let title = document.createElement('p');
  title.classList.add('todo-title');
  title.innerText = todo.title;
  title.id = todo.id;
  if (todo.completed === true) {
    title.classList.add('checked-title')
  }

  // let card2 = document.createElement('div');
  // card2.classList.add('todo2');
  // card2.classList.add('checked')

  let doneButton = document.createElement('button');
  doneButton.classList.add('btn', 'btn-done', 'btn-sm');
  doneButton.innerText = 'Done';
  
  let undoButton = document.createElement('button');
  undoButton.classList.add('btn', 'btn-undo', 'btn-sm');
  undoButton.innerText = 'Undo';
  undoButton.id = todo.id;
  

  let delButton = document.createElement('button');
  delButton.classList.add('btn', 'btn-danger', 'btn-sm');
  delButton.innerText = 'X';
  delButton.id = todo.title;
  if (todo.completed === true) {
    delButton.classList.add('checked-delButton')
  }
 

  
  card.appendChild(title);
  card.appendChild(doneButton);
  card.appendChild(undoButton);
  card.appendChild(delButton);
  
  
  
  delButton.addEventListener('click', () => removeTodo(todo.id, card, todo.completed));
  doneButton.addEventListener('click', () => addDone(todo.id));
  undoButton.addEventListener('click', () => undoDone(todo.id));
  return card;
}

function removeTodo(id, todo, completed) {
    if (completed === true) {

    todos = todos.filter(todo => todo.id !== id);
    todo.remove();
}
 
 //Delete från databasen behöver utföras, status som returneras från db ska kollas och en ifsats läggas till för kontroll
}

function addDone(id, todo) {  
 
    for (const obj of todos) {
      if (obj.id === id) {
        if (obj.completed === false) {
          obj.completed = true;
          changeColor(id);
        }
      }
    }
    listTodos();
}

function undoDone(id) { 
 
  for (const obj of todos) {
    if (obj.id === id) {
      if (obj.completed === true) {
        obj.completed = false;
        changeColorBack(id);
        listTodos();
      }
    }
  }
}

const createNewTodo = title => {
  fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      title,
      completed: false
    })
  })
  .then(res => res.json())  //lägg till kontroll av att 201 status har skickats tillbaka 
  .then(data => {
    data.id = Date.now();
    todos.unshift(data);
    console.log(todos);
    output.prepend(createTodoElement(data));
        
  })
}

function changeColor(id) {
  const element = document.getElementById(id);
  element.classList.add('checked');
  const element2 = document.getElementsByClassName('btn-danger')
  //element2.classList.add('checked');     
}

function changeColorBack(id) { //funkar inte för delButton
  const element = document.getElementById(id);
  element.classList.remove('checked');
  const element2 = document.getElementsByClassName('btn-danger')
  //element2.classList.remove('checked');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if(input.value !== '') {
    createNewTodo(input.value);
    input.value = '';
    input.focus()

  }
})
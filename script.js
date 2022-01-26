const form = document.querySelector('#todoForm');
const input = document.querySelector('#todoInput');
const output = document.querySelector('#output');
let todos = [];

const fetchTodos = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/?_limit=10')
  if (res.status !== 200) {
  console.log('Looks like there was a problem. Status Code: ' +
        res.status); }
      else {
      const data = await res.json()
      todos = data;

      listTodos();
      }
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

  let card2 = document.createElement('div');
  card2.classList.add('todo2');
  

  let doneButton = document.createElement('button');
  doneButton.classList.add('btn', 'btn-done');
  doneButton.innerText = 'Done';
  if (todo.completed === true) {
    doneButton.classList.add('checked-doneButton')
  }

  let undoButton = document.createElement('button');
  undoButton.classList.add('btn', 'btn-undo');
  undoButton.innerText = 'Undo';
  undoButton.id = todo.id;
  

  let delButton = document.createElement('button');
  delButton.classList.add('btn', 'btn-danger');
  delButton.innerText = 'X';
  delButton.id = todo.title;
  if (todo.completed === true) {
    delButton.classList.add('checked-delButton')
  }
 
  card.appendChild(title);
  card.appendChild(card2);
  card2.appendChild(doneButton);
  card2.appendChild(undoButton);
  card2.appendChild(delButton);
  
  delButton.addEventListener('click', () => removeTodo(todo.id, card, todo.completed));
  doneButton.addEventListener('click', () => addDone(todo.id));
  undoButton.addEventListener('click', () => undoDone(todo.id));
  return card;
}

const removeTodo = (id, todo, completed) => {
if (completed === true) {
  fetch('https://jsonplaceholder.typicode.com/todos/' +id, {
    method: 'DELETE',
  })
  .then(res => {
    statusCheck = res.status;
    if (res.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        res.status);
        return;
      } 
      todos = todos.filter(todo => todo.id !== id);
      todo.remove()
  })    
.catch(error => console.log(error))
}
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
  .then(res => {
    if (res.status !== 201) {
        throw new Error('Looks like there was a problem. Status Code: ' +
        res.status)
      }
      else {
        return res.json();
      }
  })    
  .then(data => {
    data.id = Date.now();
    todos.unshift(data);
    output.prepend(createTodoElement(data));
        
  })
.catch(error => console.log(error.message))
}

function changeColor(id) {
  const element = document.getElementById(id);
  element.classList.add('checked');
}

function changeColorBack(id) {
  const element = document.getElementById(id);
  element.classList.remove('checked');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if(input.value !== '') {
    createNewTodo(input.value);
    input.value = '';
    input.focus()
  }
  else {
    document.getElementById("todoInput").placeholder = "Input cannot be empty! Add todo...";
  }
})
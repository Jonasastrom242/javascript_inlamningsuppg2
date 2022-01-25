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

  let title = document.createElement('p');
  title.classList.add('todo-title');
  title.innerText = todo.title
  
  let doneButton = document.createElement('button');
  doneButton.classList.add('btn', 'btn-done', 'btn-sm');
  doneButton.innerText = 'Done';

  let delButton = document.createElement('button');
  delButton.classList.add('btn', 'btn-danger', 'btn-sm');
  delButton.innerText = 'X';

  
  card.appendChild(title);
  card.appendChild(doneButton);
  card.appendChild(delButton);
  
  delButton.addEventListener('click', () => removeTodo(todo.id, card, todo.completed));
  doneButton.addEventListener('click', () => addDone(todo.id));
  return card;
}

function removeTodo(id, todo, completed) {
  if (completed === true) {

  todos = todos.filter(todo => todo.id !== id);
  todo.remove();
}
 
 //Delete från databasen behöver utföras, status som returneras från db ska kollas och en ifsats läggas till för kontroll
}

function addDone(id, todo) {  //funkar men ändrar inte styling
  for (const obj of todos) {
    if (obj.id === id) {
      obj.completed = true;
  
      break;
    }
  }

  console.log(todos)
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


form.addEventListener('submit', e => {
  e.preventDefault();
  if(input.value !== '') {
    createNewTodo(input.value);
    input.value = '';
    input.focus()

  }
})
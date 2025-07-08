
document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.querySelector('.addTaskBtn');
    const addTodoSection = document.querySelector('.addtodo');
    const addTodobt = document.getElementById('addTodobt');
    const dateInput = document.getElementById('date');
    const taskInput = document.getElementById('task');
    const descriptionInput = document.getElementById('description');
    const todosContainer = document.querySelector('.todos');
    const filterButtons = document.createElement('div');
    filterButtons.classList.add('filter-buttons');
    todosContainer.before(filterButtons); 

    filterButtons.innerHTML = `
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
    `;

   
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancelAddEdit';
    cancelButton.textContent = 'Cancel';
    addTodobt.after(cancelButton); 

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentEditId = null; 
    let currentFilter = 'all'; 

 
    function renderTodos() {
        todosContainer.innerHTML = ''; 
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') {
                return !todo.completed;
            } else if (currentFilter === 'completed') {
                return todo.completed;
            }
            return true; 
        }).sort((a, b) => {
           
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA - dateB !== 0) {
                return dateA - dateB; 
            }

            
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;

            return a.title.localeCompare(b.title); 
        });

        if (filteredTodos.length === 0) {
            const noTasksMessage = document.createElement('div');
            noTasksMessage.classList.add('todocard'); 
            noTasksMessage.style.textAlign = 'center';
            noTasksMessage.style.padding = '20px';
            noTasksMessage.textContent = `No ${currentFilter === 'active' ? 'active' : currentFilter} tasks found.`;
            todosContainer.appendChild(noTasksMessage);
            return;
        }

        filteredTodos.forEach(todo => {
            const todoCard = document.createElement('div');
            todoCard.classList.add('todocard');
            if (todo.completed) {
                todoCard.classList.add('completed');
            }

            todoCard.innerHTML = `
                <h2>${todo.title}</h2>
                <p>Date: ${todo.date}</p>
                <p>${todo.description}</p>
                <div class="card-actions">
                    <button class="complete-btn" data-id="${todo.id}">${todo.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-btn" data-id="${todo.id}">Edit</button>
                    <button class="delete-btn" data-id="${todo.id}">Delete</button>
                </div>
            `;
            todosContainer.appendChild(todoCard);
        });
        attachEventListeners(); 
    }

   
    function attachEventListeners() {
        document.querySelectorAll('.complete-btn').forEach(button => {
            button.onclick = (e) => toggleComplete(e.target.dataset.id);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.onclick = (e) => editTodo(e.target.dataset.id);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (e) => deleteTodo(e.target.dataset.id);
        });
    }


    addTaskBtn.addEventListener('click', () => {
        addTodoSection.classList.remove('hide'); 
        addTodobt.textContent = 'Add Todo';
        currentEditId = null; 

        dateInput.value = '';
        taskInput.value = '';
        descriptionInput.value = '';
    });

  
    cancelButton.addEventListener('click', () => {
        addTodoSection.classList.add('hide');
        currentEditId = null; 
        dateInput.value = '';
        taskInput.value = '';
        descriptionInput.value = '';
        addTodobt.textContent = 'Add Todo'; 
    });

  
    addTodobt.addEventListener('click', () => {
        const date = dateInput.value;
        const title = taskInput.value.trim();
        const description = descriptionInput.value.trim();

        if (title && date) {
            if (currentEditId) {
                
                const todoIndex = todos.findIndex(todo => todo.id == currentEditId);
                if (todoIndex !== -1) {
                    todos[todoIndex] = {
                        ...todos[todoIndex], 
                        date,
                        title,
                        description
                    };
                }
                currentEditId = null; 
                addTodobt.textContent = 'Add Todo'; 
            } else {
                
                const newTodo = {
                    id: Date.now(),
                    date,
                    title,
                    description,
                    completed: false
                };
                todos.push(newTodo);
            }

            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();

            dateInput.value = '';
            taskInput.value = '';
            descriptionInput.value = '';
            addTodoSection.classList.add('hide'); 
        } else {
            
            showCustomMessage('Please enter a task title and date.');
        }
    });

    
    function toggleComplete(id) {
        const todo = todos.find(t => t.id == id);
        if (todo) {
            todo.completed = !todo.completed;
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        }
    }

    function editTodo(id) {
        const todoToEdit = todos.find(t => t.id == id);
        if (todoToEdit) {
           
            dateInput.value = todoToEdit.date;
            taskInput.value = todoToEdit.title;
            descriptionInput.value = todoToEdit.description;

            addTodoSection.classList.remove('hide'); 
            addTodobt.textContent = 'Save Changes'; 
            currentEditId = id; 
        }
    }

   
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id != id);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }


    filterButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
          
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos(); 
        }
    });

    
    function showCustomMessage(message) {
        const messageBox = document.createElement('div');
        messageBox.classList.add('custom-message-box');
        messageBox.innerHTML = `
            <p>${message}</p>
            <button class="close-message-box">OK</button>
        `;
        document.body.appendChild(messageBox);

        messageBox.querySelector('.close-message-box').addEventListener('click', () => {
            messageBox.remove();
        });

        
        setTimeout(() => {
            if (messageBox.parentNode) {
                messageBox.remove();
            }
        }, 3000);
    }


    renderTodos();
});

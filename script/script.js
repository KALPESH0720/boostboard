
document.addEventListener('DOMContentLoaded', () => {
    const seeAllButton = document.querySelector('.see-all');
    const scheduleContainer = document.querySelector('.schedule-container');

    const totalTasksElement = document.querySelector('.d3 h3');
    const completedTasksElement = document.querySelector('.d4 h3');

   
    const timelineGrid = document.querySelector('.timeline-grid');
    const dayColumns = timelineGrid ? timelineGrid.querySelectorAll('.day-column') : [];

    function loadUpcomingTasks() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingTasks = todos
            .filter(todo => {
                const todoDate = new Date(todo.date);
                todoDate.setHours(0, 0, 0, 0);
                return todoDate >= today && !todo.completed;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA - dateB !== 0) {
                    return dateA - dateB;
                }
                return a.title.localeCompare(b.title);
            })
            .slice(0, 3);

        const staticTasks = scheduleContainer.querySelectorAll('.task');
        staticTasks.forEach(task => task.remove());

        const seeAllActivityDiv = scheduleContainer.querySelector('.see-all');
        if (seeAllActivityDiv) {
            seeAllActivityDiv.remove();
        }

        if (upcomingTasks.length > 0) {
            upcomingTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.innerHTML = `
                    <div class="task-time">${task.date}</div>
                    <div class="task-desc">${task.title}</div>
                `;
                scheduleContainer.appendChild(taskElement);
            });
        } else {
            const noTasksMessage = document.createElement('div');
            noTasksMessage.classList.add('task');
            noTasksMessage.innerHTML = `<div class="task-desc">No upcoming tasks!</div>`;
            scheduleContainer.appendChild(noTasksMessage);
        }

        if (seeAllActivityDiv) {
            scheduleContainer.appendChild(seeAllActivityDiv);
        }
    }

    function updatePerformanceMetrics() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];

        const totalTasks = todos.length;
        const completedTasks = todos.filter(todo => todo.completed).length;

        if (totalTasksElement) {
            totalTasksElement.textContent = `${totalTasks} Tasks`;
        }
        if (completedTasksElement) {
            completedTasksElement.textContent = `${completedTasks} Tasks`;
        }
    }

    
    function populateTimelineSchedule() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

       
        dayColumns.forEach(column => {
            const existingEvents = column.querySelectorAll('.event');
            existingEvents.forEach(event => event.remove());
        });

      
        const dayNamesMap = {
            'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
        };
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        
        const tasksByDay = {};
        todos.filter(todo => !todo.completed).forEach(todo => {
            const todoDate = new Date(todo.date);
          
            const dayOfWeek = todoDate.getDay();
            const dayName = dayNames[dayOfWeek];

           
            const normalizedTodoDate = new Date(todoDate.getFullYear(), todoDate.getMonth(), todoDate.getDate());

            if (normalizedTodoDate >= today) {
                if (!tasksByDay[dayName]) {
                    tasksByDay[dayName] = [];
                }
                tasksByDay[dayName].push(todo);
            }
        });

        for (const day in tasksByDay) {
            tasksByDay[day].sort((a, b) => a.title.localeCompare(b.title));
        }

        
        dayColumns.forEach(column => {
            const dayNameDiv = column.querySelector('.day-name');
            if (dayNameDiv) {
                const day = dayNameDiv.textContent.trim();
                const tasksForDay = tasksByDay[day] || [];
                let currentTop = 0; 
                const eventHeight = 40; 
                const eventMargin = 5; 

                tasksForDay.forEach(task => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('event');
                    eventElement.style.top = `${currentTop}px`;
                    eventElement.style.height = `${eventHeight}px`;
                    eventElement.textContent = task.title; 
                    column.appendChild(eventElement);
                    currentTop += eventHeight + eventMargin; 
                });
            }
        });
    }


    loadUpcomingTasks();
    updatePerformanceMetrics();
    populateTimelineSchedule(); 

    if (seeAllButton) {
        seeAllButton.addEventListener('click', () => {
            window.location.href = 'todo.html';
        });
    }

    window.addEventListener('storage', (event) => {
        if (event.key === 'todos') {
            loadUpcomingTasks();
            updatePerformanceMetrics();
            populateTimelineSchedule(); 
        }
    });
});

const totalTask=document.getElementById('total-task');
const totalTaskComplete=document.getElementById('total-task-complete');

totalTask.innerHTML=todos.length;

let count =0;
todos.forEach((todo) => {
    if(todo.completed){
        count++;
    }
});
totalTaskComplete.innerHTML=count;


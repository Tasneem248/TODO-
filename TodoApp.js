class TodoApp {
    constructor() {
        this.taskList = document.getElementById("taskList");
        this.addTaskBtn = document.getElementById("addTaskBtn");
        this.newTaskInput = document.getElementById("newTask");
        
        this.addTaskBtn.addEventListener("click", () => this.addTask());
        this.taskList.addEventListener("click", (event) => this.handleTaskAction(event));

        this.loadTasks();
    }

    addTask() {
        const taskName = this.newTaskInput.value;
        if (taskName === "") return;

        fetch("https://localhost:7127/api/todo", {  // API Endpoint for adding a new task
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: taskName, completed: false })
        })
        .then(response => response.json())
        .then(task => {
            this.addTaskToList(task);
            this.newTaskInput.value = "";
        });
    }

    addTaskToList(task) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("list-group-item");
        if (task.completed) {
            taskItem.classList.add("list-group-item-success");
        }
        taskItem.dataset.id = task.id;
        taskItem.innerHTML = `
            ${task.name} <button class="btn btn-sm btn-danger float-right delete-btn">Sil</button>
            <button class="btn btn-sm btn-success float-right mr-2 complete-btn">${task.completed ? "Tamamlandı" : "Tamamla"}</button>
        `;
        this.taskList.appendChild(taskItem);
    }

    loadTasks() {
        fetch("https://localhost:7127/api/todo")  // API Endpoint for loading all tasks
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => this.addTaskToList(task));
            });
    }

    handleTaskAction(event) {
        if (event.target.classList.contains("delete-btn")) {
            this.deleteTask(event.target.parentElement.dataset.id, event.target.parentElement);
        }

        if (event.target.classList.contains("complete-btn")) {
            this.toggleTaskCompletion(event.target.parentElement.dataset.id, event.target);
        }
    }

    deleteTask(taskId, taskElement) {
        fetch(`https://localhost:7127/api/todo/${taskId}`, {  // API Endpoint for deleting a task
            method: "DELETE"
        }).then(() => {
            taskElement.remove();
        });
    }

    toggleTaskCompletion(taskId, buttonElement) {
        const isCompleted = buttonElement.innerText === "Tamamla";
        
        fetch(`https://localhost:7127/api/todo/${taskId}/${isCompleted ? "complete" : "incomplete"}`, {  // API Endpoint for completing/incompleting a task
            method: "PUT"
        }).then(() => {
            buttonElement.innerText = isCompleted ? "Tamamlandı" : "Tamamla";
            buttonElement.parentElement.classList.toggle("list-group-item-success");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TodoApp();
});

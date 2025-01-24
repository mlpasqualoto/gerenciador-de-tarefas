document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById("tasks");
    const completedTasksContainer = document.getElementById("completeTasks");
    const addTaskButton = document.getElementById("addTask");

    // Event delegation: escuta os eventos de mudança de checkbox
    document.addEventListener("change", (event) => {
        if (event.target.matches(".task input[type='checkbox']")) {
            const checkbox = event.target;
            const task = checkbox.closest(".task");

            if (checkbox.checked) {
                // Move para a seção de tarefas concluídas
                completedTasksContainer.appendChild(task);
            } else {
                // Move de volta para a seção de tarefas pendentes
                tasksContainer.appendChild(task);
            }
        }
    });

    function addTask() {
        const tasksBox = document.getElementById('tasks');

        const taskBox = document.createElement('div');
        taskBox.classList.add('task');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const inputTask = document.createElement('input');
        inputTask.classList.add('taskInput');
        inputTask.type = 'text';
        inputTask.placeholder = 'Nova tarefa';
        inputTask.autocomplete = 'none';

        taskBox.appendChild(checkbox);
        taskBox.appendChild(inputTask);
        tasksBox.appendChild(taskBox);

        tasksBox.prepend(taskBox);

        inputTask.focus();

        const okTaskBtn = document.createElement('button');
        okTaskBtn.textContent = 'OK';
        taskBox.appendChild(okTaskBtn);

        okTaskBtn.addEventListener('click', () => {
            inputTask.readOnly = true;
            inputTask.style.cursor = 'pointer';

            okTaskBtn.remove();
            removeTaskBtn.style.display = 'none';
        });

        inputTask.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                okTaskBtn.click();
            };
        });

        const removeTaskBtn = document.createElement('button');
        removeTaskBtn.classList.add('removeTaskBtn');
        removeTaskBtn.textContent = 'X';
        taskBox.appendChild(removeTaskBtn);

        removeTaskBtn.addEventListener('click', () => {
            taskBox.remove();
        });
    };

    const addTaskBtn = document.getElementById('addTask');

    addTaskBtn.addEventListener('click', () => {
        addTask();
    });
});

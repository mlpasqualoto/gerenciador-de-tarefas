document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll("#tasks .task input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        // Seleciona todos os checkboxes
        checkbox.addEventListener('change', () => {
            const task = event.target.closest('.task');
            const completedTasks = document.getElementById('completeTasks');

            if (checkbox.checked) {
                // Move para a caixa azul
                completedTasks.appendChild(task);
            } else {
                // Volta para a caixa cinza
                const tasks = document.getElementById('tasks');
                tasks.appendChild(task);
            }
        });
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

        const okTaskBtn = document.createElement('button');
        okTaskBtn.type = 'submit';
        okTaskBtn.textContent = 'OK';
        taskBox.appendChild(okTaskBtn);

        okTaskBtn.addEventListener('click', () => {
            inputTask.readOnly = true;

            okTaskBtn.remove();
        });
    }

    const addTaskButton = document.getElementById('addTask');

    addTaskButton.addEventListener('click', () => {
        addTask();
    });
});

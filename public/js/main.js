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
        okTaskBtn.classList.add('iconBtn');
        const okIcon = document.createElement('i');
        okIcon.classList.add('fa-solid', 'fa-check');
        okTaskBtn.appendChild(okIcon);
        taskBox.appendChild(okTaskBtn);

        okTaskBtn.addEventListener('click', () => {
            inputTask.readOnly = true;
            inputTask.style.cursor = 'pointer';
            taskBox.style.cursor = 'pointer';

            okTaskBtn.remove();
            removeTaskBtn.style.display = 'none';

            // Adiciona eventos para mostrar/esconder o botão após concluir a tarefa
            taskBox.addEventListener('mouseover', () => {
                removeTaskBtn.style.display = 'inline-block'; // Mostra o botão
            });

            taskBox.addEventListener('mouseout', () => {
                removeTaskBtn.style.display = 'none'; // Esconde o botão
            });
        });

        inputTask.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                okTaskBtn.click();
            };
        });

        const removeTaskBtn = document.createElement('button');
        removeTaskBtn.classList.add('iconBtn');
        removeTaskBtn.classList.add('removeTaskBtn');
        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fa-solid', 'fa-trash-can');
        removeTaskBtn.appendChild(removeIcon);
        taskBox.appendChild(removeTaskBtn);

        removeTaskBtn.addEventListener('click', () => {
            taskBox.remove();
        });
    };

    const addTaskBtn = document.getElementById('addTask');

    addTaskBtn.addEventListener('click', () => {
        addTask(); // função addTask deve retornar o texto do input da tarefa

        // em seguida, enviar texto para rota da api para salvar no banco de dados
    });
});

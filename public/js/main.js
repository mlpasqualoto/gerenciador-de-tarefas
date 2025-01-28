import reqApi from "../../src/controllers/controllers.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tasksContainer = document.getElementById("tasks");
    const completedTasksContainer = document.getElementById("completeTasks");
    const addTaskBtn = document.getElementById("addTask");
    const token = localStorage.getItem("token"); // Pega o token do localStorage armazenado no navegador

    // Carrega as tarefas do usuário
    try {
        const tasks = await reqApi.getTasks(token);

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskBox = document.createElement('div');
                taskBox.classList.add('task');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';

                const inputTask = document.createElement('input');
                inputTask.classList.add('taskInput');
                inputTask.type = 'text';
                inputTask.value = task.task;
                inputTask.readOnly = true;

                taskBox.appendChild(checkbox);
                taskBox.appendChild(inputTask);
                tasksContainer.appendChild(taskBox);
            });
        } else {
            console.log("Nenhuma tarefa encontrada.");
        }
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
    }

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

    function addRemoveTask() {
        // ** Cria a caixa da tarefa e os botões **

        // Parte I: Adiciona a caixa da tarefa
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

        // Parte II: Cria botão de ok para finalizar edição da tarefa
        const okTaskBtn = document.createElement('button');
        okTaskBtn.classList.add('iconBtn');
        const okIcon = document.createElement('i');
        okIcon.classList.add('fa-solid', 'fa-check');
        okTaskBtn.appendChild(okIcon);
        taskBox.appendChild(okTaskBtn);

        // Parte III: Cria botão de editar tarefa
        const editTaskBtn = document.createElement('button');
        editTaskBtn.classList.add('iconBtn');
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-solid', 'fa-pen');
        editTaskBtn.style.display = 'none';
        editTaskBtn.appendChild(editIcon);
        taskBox.appendChild(editTaskBtn);

        // Parte IV: Cria botão de excluir tarefa
        const removeTaskBtn = document.createElement('button');
        removeTaskBtn.classList.add('iconBtn');
        removeTaskBtn.classList.add('removeTaskBtn');
        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fa-solid', 'fa-trash-can');
        removeTaskBtn.appendChild(removeIcon);
        taskBox.appendChild(removeTaskBtn);

        // ** Eventos dos botões **

        // Adiciona a tarefa 
        okTaskBtn.addEventListener('click', async () => {
            inputTask.readOnly = true;
            inputTask.style.cursor = 'pointer';
            taskBox.style.cursor = 'pointer';

            okTaskBtn.style.display = 'none'; // Esconde o botão de ok
            removeTaskBtn.style.display = 'none'; // Esconde o botão de remover

            // Envia a tarefa para a API
            await reqApi.addTask(token, inputTask.value);

            // mostra o botão de excluir tarefa ao passar o mouse por cima da tarefa
            taskBox.addEventListener('mouseover', () => {
                removeTaskBtn.style.display = 'inline-block'; // Mostra o botão de remover
                editTaskBtn.style.display = 'inline-block'; // Mostra o botão de editar
            });

            // esconde o botão de excluir tarefa após tirar o mouse de cima da tarefa
            taskBox.addEventListener('mouseout', () => {
                removeTaskBtn.style.display = 'none'; // Esconde o botão de remover
                editTaskBtn.style.display = 'none'; // Esconde o botão de editar
            });
        });

        // Adiciona a tarefa ao pressionar a tecla Enter
        inputTask.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                okTaskBtn.click();
            };
        });

        // Remove a tarefa
        removeTaskBtn.addEventListener('click', async () => {
            const taskContent = inputTask.value; // Captura o conteúdo da tarefa

            // Envia a tarefa para a API
            await reqApi.deleteTasks(token, taskContent);

            taskBox.remove();
        });

        //Edita a tarefa
        editTaskBtn.addEventListener('click', () => {
            inputTask.readOnly = false;
            inputTask.style.cursor = 'text';
            taskBox.style.cursor = 'text';

            inputTask.focus()

            okTaskBtn.style.display = 'inline-block'; // Mostra o botão de ok
        });	
    };

    addTaskBtn.addEventListener('click', () => {
        addRemoveTask(); // função addTask deve retornar o texto do input da tarefa
        
        // em seguida, enviar texto para rota da api para salvar no banco de dados
    });
});

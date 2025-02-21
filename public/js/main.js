import reqApi from "../../src/controllers/controllers.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tasksContainer = document.getElementById("tasks");
    const completedTasksContainer = document.getElementById("completeTasks");
    const addTaskBtn = document.getElementById("addTask");
    const token = sessionStorage.getItem("token"); // Pega o token do localStorage armazenado no navegador
    const logoutBtn = document.getElementById("logoutBtn");
    const weekDayHeader = document.getElementById("weekDayHeader");
    const dateHeader = document.getElementById("dateHeader");
    const vsBtn = document.getElementById("vsModeBtn");
    const loading = document.getElementById("loading"); // Elemento de carregamento
    const iconBtn = document.getElementById("iconBtn");

    // Light/Dark mode (verifica qual tema está salvo no localStorage)
    iconBtn.classList.add("fa-regular");
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        iconBtn.classList.remove("fa-regular");
        iconBtn.classList.add("fa-solid");
    }

    // Light/Dark mode
    vsBtn.addEventListener('click', () => {
        iconBtn.classList.toggle("fa-regular");
        iconBtn.classList.toggle("fa-solid");

        if (iconBtn.classList.contains("fa-solid")) {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        loading.style.display = "flex"; // Exibe o carregamento
        loading.style.backgroundColor = document.body.classList.contains("light-mode") 
            ? "rgba(255, 255, 255, 0.9)" 
            : "rgba(0, 0, 0, 0.8)";
        
        sessionStorage.removeItem("token");

        // Redireciona para a página de login após 1 segundo
        setTimeout(() => {
            window.location.href = "login.html";
        }, 500); // Tempo de espera para exibir o carregamento
    });

    // Data atual
    const date = await reqApi.getDate();
    weekDayHeader.innerHTML = `${date.weekDay},`;
    dateHeader.innerHTML = `${date.day} de ${date.month} de ${date.year}`;

    // Carrega as tarefas do usuário
    try {
        tasksContainer.innerHTML = "<p>Carregando tarefas...</p>";
        const tasks = await reqApi.getTasks(token);

        if (tasks.length > 0) {
            tasksContainer.innerHTML = ""; // Limpa antes de renderizar
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

                // Cria botão de ok para finalizar edição da tarefa
                const editOkTaskBtn = document.createElement('button');
                editOkTaskBtn.classList.add('iconBtn');
                const okIcon = document.createElement('i');
                okIcon.classList.add('fa-solid', 'fa-check');
                okIcon.id = 'okIcon';
                editOkTaskBtn.appendChild(okIcon);
                taskBox.appendChild(editOkTaskBtn);
                editOkTaskBtn.style.display = 'none';

                // Cria botão de editar tarefa
                const editTaskBtn = document.createElement('button');
                editTaskBtn.classList.add('iconBtn');
                const editIcon = document.createElement('i');
                editIcon.classList.add('fa-solid', 'fa-pen');
                editIcon.id = 'editIcon';
                editTaskBtn.appendChild(editIcon);
                taskBox.appendChild(editTaskBtn);
                editTaskBtn.style.display = 'none';

                // Cria botão de excluir tarefa
                const removeTaskBtn = document.createElement('button');
                removeTaskBtn.classList.add('iconBtn');
                removeTaskBtn.classList.add('removeTaskBtn');
                const removeIcon = document.createElement('i');
                removeIcon.classList.add('fa-solid', 'fa-trash-can');
                removeIcon.id = 'removeIcon';
                removeTaskBtn.appendChild(removeIcon);
                taskBox.appendChild(removeTaskBtn);
                removeTaskBtn.style.display = 'none';

                // Cria botão de favoritar tarefa
                const favoriteTaskBtn = document.createElement('button');
                favoriteTaskBtn.classList.add('iconBtn');
                favoriteTaskBtn.classList.add('favoriteTaskBtn');
                const favoriteIcon = document.createElement('i');
                favoriteIcon.classList.add('fa-regular', 'fa-star');
                favoriteIcon.id = 'favoriteIcon';
                favoriteTaskBtn.appendChild(favoriteIcon);
                taskBox.appendChild(favoriteTaskBtn);
                favoriteTaskBtn.style.display = 'none';

                // mostra o botão de excluir tarefa ao passar o mouse por cima da tarefa
                taskBox.addEventListener('mouseover', () => {
                    if (!inputTask.readOnly) return; // Não mostrar se estiver no modo de edição
                    removeTaskBtn.style.display = 'inline-block'; // Mostra o botão de remover
                    editTaskBtn.style.display = 'inline-block'; // Mostra o botão de editar
                    if (favoriteIcon.classList.contains("fa-solid")) return; // Não mostrar se estiver favoritado
                    favoriteTaskBtn.style.display = 'inline-block'; // Mostra o botão de favoritar
                });

                // esconde o botão de excluir tarefa após tirar o mouse de cima da tarefa
                taskBox.addEventListener('mouseout', () => {
                    if (!inputTask.readOnly) return; // Não esconder se estiver no modo de edição
                    removeTaskBtn.style.display = 'none'; // Esconde o botão de remover
                    editTaskBtn.style.display = 'none'; // Esconde o botão de editar
                    if (favoriteIcon.classList.contains("fa-solid")) return; // Não esconder se estiver favoritado
                    favoriteTaskBtn.style.display = 'none'; // Esconde o botão de favoritar
                });

                // ** Eventos dos botões **

                // Remove a tarefa
                removeTaskBtn.addEventListener('click', async () => {
                    const taskContent = inputTask.value; // Captura o conteúdo da tarefa

                    // Envia a tarefa para a API
                    await reqApi.deleteTasks(token, taskContent);

                    taskBox.remove();
                });

                //Edita a tarefa
                editTaskBtn.addEventListener('click', () => {
                    const oldTaskContent = inputTask.value; // Captura o conteúdo da tarefa

                    inputTask.readOnly = false;
                    inputTask.style.cursor = 'text';
                    taskBox.style.cursor = 'text';

                    inputTask.focus()

                    removeTaskBtn.style.display = 'inline-block'; // Mostra o botão de remover
                    editTaskBtn.style.display = 'none'; // Esconde o botão de editar
                    editOkTaskBtn.style.display = 'inline-block'; // Mostra o botão de ok

                    // Quando o botão de ok for clicado, envia a tarefa editada para a API
                    editOkTaskBtn.addEventListener('click', async () => {
                        const newTaskContent = inputTask.value; // Captura o novo conteúdo da tarefa

                        try {
                            // Envia a tarefa editada para a API
                            await reqApi.editTasks(token, oldTaskContent, newTaskContent);

                            inputTask.readOnly = true; // Bloqueia a edição novamente
                            inputTask.style.cursor = 'pointer';
                            taskBox.style.cursor = 'pointer';

                            editTaskBtn.style.display = 'none'; // Esconde o botão de editar
                            removeTaskBtn.style.display = 'none'; // Esconde o botão de remover
                            editOkTaskBtn.style.display = 'none'; // Esconde o botão de ok
                        } catch (error) {
                            console.error("Erro ao editar a tarefa:", error);
                            alert("Erro ao editar a tarefa. Tente novamente.");
                        }
                    });

                    inputTask.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                            editOkTaskBtn.click();
                        }
                    });
                });

                // Favorita a tarefa
                favoriteTaskBtn.addEventListener("click", async (event) => {
                    event.preventDefault(); // Evita comportamento inesperado
                    
                    // Obtém o ícone dentro do botão corretamente
                    const icon = favoriteTaskBtn.querySelector("i");
                    if (!icon) return; // Se não houver ícone, não continua
                
                    // Alterna a classe do ícone
                    icon.classList.toggle("fa-regular");
                    icon.classList.toggle("fa-solid");
                
                    // Verifica se a tarefa foi favoritada
                    const isFavorited = icon.classList.contains("fa-solid");
                
                    // Envia a atualização para a API
                    await reqApi.favoriteTask(token, inputTask.value, isFavorited);
                
                    // Verifica se o evento foi acionado por um checkbox dentro de uma tarefa
                    if (event.target.matches(".task input[type='checkbox']")) {
                        const checkbox = event.target;
                
                        if (checkbox.checked) {
                            // Move para o topo da seção de tarefas concluídas
                            completedTasksContainer.prepend(taskBox);
                        } else {
                            // Move para o topo da seção de tarefas pendentes
                            tasksContainer.prepend(taskBox);
                        }
                    }
                });

                // Verifica se a tarefa está favoritada
                if (task.favorite) {
                    // Altera a cor do ícone
                    favoriteIcon.classList.toggle("fa-regular");
                    favoriteIcon.classList.toggle("fa-solid");

                    // Mostra o botão de favoritar caso esteja favoritado
                    favoriteTaskBtn.style.display = "inline-block"; // Exibe o botão
                } else {
                    favoriteTaskBtn.style.display = "none"; // Oculta o botão
                }

                // Verifica se a tarefa está concluída
                if (task.checked) {
                    // Move para a seção de tarefas concluídas
                    completedTasksContainer.appendChild(taskBox);
                    checkbox.checked = true;
                } else {
                    // Move de volta para a seção de tarefas pendentes
                    tasksContainer.appendChild(taskBox);
                }
            });
        } else {
            tasksContainer.innerHTML = ""; // Limpa antes de renderizar
            tasksContainer.innerHTML = "<p>Nenhuma tarefa encontrada...</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        tasksContainer.innerHTML = "<p>Erro ao carregar tarefas...</p>";
    }

    // Event delegation: escuta os eventos de mudança de checkbox
    document.addEventListener("change", async (event) => {
        if (event.target.matches(".task input[type='checkbox']")) {
            const checkbox = event.target;
            const task = checkbox.closest(".task");
            const favoriteTaskBtn = task.querySelector(".favoriteTaskBtn");

            if (checkbox.checked) {
                // Move para a seção de tarefas concluídas
                completedTasksContainer.appendChild(task);

                // Envia a tarefa como conclupida para a API
                await reqApi.checkedTask(token, task.querySelector(".taskInput").value, true);
            } else {
                // Move de volta para a seção de tarefas pendentes
                tasksContainer.appendChild(task);

                // Envia a tarefa como pendente para a API
                await reqApi.checkedTask(token, task.querySelector(".taskInput").value, false);
            }
        }
    });

    // Adiciona uma nova tarefa
    function addRemoveTask() {
        // ** Cria a caixa da tarefa e os botões **

        // Parte I: Adiciona a caixa da tarefa
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
        tasksContainer.appendChild(taskBox);

        tasksContainer.prepend(taskBox);

        inputTask.focus();

        // Parte II: Cria botão de ok para finalizar edição da tarefa
        const okTaskBtn = document.createElement('button');
        okTaskBtn.classList.add('iconBtn');
        const okIcon = document.createElement('i');
        okIcon.classList.add('fa-solid', 'fa-check');
        okIcon.id = 'okIcon';
        okTaskBtn.appendChild(okIcon);
        taskBox.appendChild(okTaskBtn);

        // Parte III: Cria botão de editar tarefa
        const editTaskBtn = document.createElement('button');
        editTaskBtn.classList.add('iconBtn');
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-solid', 'fa-pen');
        editIcon.id = 'editIcon';
        editTaskBtn.style.display = 'none';
        editTaskBtn.appendChild(editIcon);
        taskBox.appendChild(editTaskBtn);

        // Parte IV: Cria botão de excluir tarefa
        const removeTaskBtn = document.createElement('button');
        removeTaskBtn.classList.add('iconBtn');
        removeTaskBtn.classList.add('removeTaskBtn');
        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fa-solid', 'fa-trash-can');
        removeIcon.id = 'removeIcon';
        removeTaskBtn.appendChild(removeIcon);
        taskBox.appendChild(removeTaskBtn);

        // Parte V: Cria botão de favoritar tarefa
        const favoriteTaskBtn = document.createElement('button');
        favoriteTaskBtn.classList.add('iconBtn');
        favoriteTaskBtn.classList.add('favoriteTaskBtn');
        const favoriteIcon = document.createElement('i');
        favoriteIcon.classList.add('fa-regular', 'fa-star');
        favoriteIcon.id = 'favoriteIcon';
        favoriteTaskBtn.appendChild(favoriteIcon);
        taskBox.appendChild(favoriteTaskBtn);
        favoriteTaskBtn.style.display = 'none';

        // ** Eventos dos botões **

        // Adiciona a tarefa 
        okTaskBtn.addEventListener('click', async () => {
            inputTask.readOnly = true;
            inputTask.style.cursor = 'pointer';
            taskBox.style.cursor = 'pointer';

            okTaskBtn.remove() // Remove o botão de ok
            removeTaskBtn.style.display = 'none'; // Esconde o botão de remover

            // Envia a tarefa para a API
            await reqApi.addTask(token, inputTask.value);

            // mostra o botão de excluir tarefa ao passar o mouse por cima da tarefa
            taskBox.addEventListener('mouseover', () => {
                removeTaskBtn.style.display = 'inline-block'; // Mostra o botão de remover
                editTaskBtn.style.display = 'inline-block'; // Mostra o botão de editar
                if (favoriteIcon.classList.contains("fa-solid")) return;
                favoriteTaskBtn.style.display = 'inline-block'; // Mostra o botão de favoritar
            });

            // esconde o botão de excluir tarefa após tirar o mouse de cima da tarefa
            taskBox.addEventListener('mouseout', () => {
                removeTaskBtn.style.display = 'none'; // Esconde o botão de remover
                editTaskBtn.style.display = 'none'; // Esconde o botão de editar
                if (favoriteIcon.classList.contains("fa-solid")) return;
                favoriteTaskBtn.style.display = 'none'; // Esconde o botão de favoritar
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
            const oldTaskContent = inputTask.value; // Captura o conteúdo da tarefa

            inputTask.readOnly = false;
            inputTask.style.cursor = 'text';
            taskBox.style.cursor = 'text';

            inputTask.focus()

            const editOkTaskBtn = document.createElement('button');
            editOkTaskBtn.classList.add('iconBtn');
            const okIcon = document.createElement('i');
            okIcon.classList.add('fa-solid', 'fa-check');
            editOkTaskBtn.appendChild(okIcon);
            taskBox.appendChild(editOkTaskBtn);

            // Quando o botão de ok for clicado, envia a tarefa editada para a API
            editOkTaskBtn.addEventListener('click', async () => {
                const newTaskContent = inputTask.value; // Captura o novo conteúdo da tarefa

                try {
                    // Envia a tarefa editada para a API
                    await reqApi.editTasks(token, oldTaskContent, newTaskContent);

                    inputTask.readOnly = true; // Bloqueia a edição novamente
                    inputTask.style.cursor = 'pointer';
                    taskBox.style.cursor = 'pointer';

                    editOkTaskBtn.remove() // Remove o botão de ok
                } catch (error) {
                    console.error("Erro ao editar a tarefa:", error);
                    alert("Erro ao editar a tarefa. Tente novamente.");
                }
            });
        });	

        // Favorita a tarefa
        favoriteTaskBtn.addEventListener("click", async (event) => {
            event.preventDefault(); // Evita comportamento inesperado
            
            // Obtém o ícone dentro do botão corretamente
            const icon = favoriteTaskBtn.querySelector("i");
            if (!icon) return; // Se não houver ícone, não continua
        
            // Alterna a classe do ícone
            icon.classList.toggle("fa-regular");
            icon.classList.toggle("fa-solid");
        
            // Verifica se a tarefa foi favoritada
            const isFavorited = icon.classList.contains("fa-solid");
        
            // Envia a atualização para a API
            await reqApi.favoriteTask(token, inputTask.value, isFavorited);
        
            // Verifica se o evento foi acionado por um checkbox dentro de uma tarefa
            if (event.target.matches(".task input[type='checkbox']")) {
                const checkbox = event.target;
        
                if (checkbox.checked) {
                    // Move para o topo da seção de tarefas concluídas
                    completedTasksContainer.prepend(taskBox);
                } else {
                    // Move para o topo da seção de tarefas pendentes
                    tasksContainer.prepend(taskBox);
                }
            }
        });        
    };

    addTaskBtn.addEventListener('click', () => {
        addRemoveTask(); // função addTask deve retornar o texto do input da tarefa
    });
});

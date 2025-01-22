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
});

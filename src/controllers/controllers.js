const reqApi = {
    getDate: async () => {
        try {
            const response = await fetch ("http://localhost:5000/serverTime", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                console.log("Data obtida com sucesso:", data.message);
                return data.date;
            } else {
                console.error("Erro ao obter data:", data.error || data.message);
                return [];
            }
        } catch (error) {
            console.error("Erro ao buscar data:", error);
            return [];
        }
    },

    addTask: async (token, task) => {
        try {
            const response = await fetch("http://localhost:5000/tasks/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ task }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                console.log("Tarefa adicionada com sucesso:", data.message);
            } else {
                console.error("Erro ao adicionar tarefa:", data.error || data.message);
                return [];
            }
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
            return [];
        }
    },    

    getTasks: async (token) => {
        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
    
            if (data.success) {
                console.log("Tarefas carregadas com sucesso:", data.tasks);
                return data.tasks;
            } else {
                console.error("Erro ao carregar tarefas:", data.error || data.message);
                return [];
            }
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
            return [];
        }
    },
    
    deleteTasks: async (token, task) => {
        try {
            const response = await fetch("http://localhost:5000/tasks/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ task }),
            });

            const data = await response.json();

            if (data.success) {
                console.log("Tarefa deletada com sucesso:", data.message);
            } else {
                console.error("Erro ao deletar tarefa:", data.error || data.message);
            }
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
            return [];
        }
    },

    editTasks: async (token, oldTask, newTask) => {
        try {
            const response = await fetch ("http://localhost:5000/tasks/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ oldTask, newTask }),
            });

            const data = await response.json();

            if (data.success) {
                console.log("Tarefa atualizada com sucesso:", data.message);
            } else {
                console.error("Erro ao atualizar tarefa:", data.error || data.message);
            }
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            return [];
        }
    },

    checkedTask: async (token, task, checked) => {
        try {
            const response = await fetch("http://localhost:5000/tasks/checked", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ task, checked }),
            });

            const data = await response.json();

            if (data.success) {
                console.log("Tarefa atualizada com sucesso:", data.message);
            } else {
                console.error("Erro ao atualizar tarefa:", data.error || data.message);
            }
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            return [];
        }
    },

    favoriteTask: async (token, task, favorite) => {
        try {
            const response = await fetch("http://localhost:5000/tasks/favorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ task, favorite }),
            });

            const data = await response.json();

            if (data.success) {
                console.log("Tarefa atualizada com sucesso:", data.message);
            } else {
                console.error("Erro ao atualizar tarefa:", data.error || data.message);
            }
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            return [];
        }
    }
};

export default reqApi;

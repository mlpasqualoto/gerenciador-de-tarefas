const reqApi = {
    addTask: async (token, task) => {
        fetch("http://localhost:5000/tasks/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ task })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Tarefa adicionada com sucesso:", data.message);
            } else {
                console.error("Erro ao adicionar tarefa:", data.error || data.message);
            };
        })
        .catch(error => console.error("Erro:", error));
    },
};

export default reqApi;

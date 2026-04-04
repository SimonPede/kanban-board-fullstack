import { defineStore } from "pinia";

//verwende jetzt Pinia als globalen Store für meine Komp. um
//Pop Drilling zu vermeiden
//jede Komponente kann direkt auf den pinia store zugreifen, ohne alles durchreichen zu müssen

//2 Hauptbereiche:
//State (Die Daten): Das ist wie ref() oder reactive()
//Actions (Die Logik): Das sind die Funktionen (z.B. fetch-Aufrufe aus der App.vue)

export const useBoardStore = defineStore("boardStore", {
    state: () => ({
        columns: [],
        tags: [],
        isLoading: false,
        isOpen: false
    }),

    actions: {
        async loadColumns(isInitialLoad = false) {
            if (isInitialLoad) {
                this.isLoading = true;
            }
            try {
                const response = await fetch('/api/columns');

                console.log("STATUS:", response.status);

                const text = await response.text();
                console.log("RAW RESPONSE:", text);

                if (!response.ok) {
                    throw new Error("Server error");
                }

                this.columns = JSON.parse(text);

            } catch (err) {
                console.error("LOAD COLUMNS ERROR:", err);
            } finally {
                this.isLoading = false;
            }
        },
        async loadTags() {
            try {
                const response = await fetch('/api/tags');
                if (!response.ok) throw new Error("Server error");

                this.tags = await response.json(); // this statt .value
            } catch (err) {
                console.error("LOAD TAGS ERROR:", err);
            }
        },
        async handleNewTask(taskData) {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    column: taskData.columnId,
                    title: taskData.title,
                    text: taskData.text,
                    taskTags: taskData.tags
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("SERVER FEHLER DETAILS:", errorData.details);
                
                alert("Fehler: " + errorData.details.join("\n")); 
                return;
            }

            await this.loadColumns(); 
            this.isOpen = false;
        },
        async handleDeleteTask(taskId) {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            await this.loadColumns();
        },
        async moveTaskHandler({taskId, newColumnId}) {
            await fetch(`/api/move-task/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newColumnId })
            });

            await this.loadColumns();
        }
    }
})
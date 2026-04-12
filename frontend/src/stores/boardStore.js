import { defineStore } from "pinia";
const API_BASE = import.meta.env.VITE_API_URL || '';
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
        isUpdating: false,
        isOpen: false
    }),

    actions: {
        async loadColumns(isInitialLoad = false) {
            if (isInitialLoad) {
                this.isLoading = true;
            } else {
                this.isUpdating = true;
            }

            try {
                const response = await fetch(`${API_BASE}/api/columns`);

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
                this.isUpdating = false;
            }
        },
        async loadTags() {
            try {
                const response = await fetch(`${API_BASE}/api/tags`);
                if (!response.ok) throw new Error("Server error");

                this.tags = await response.json(); // this statt .value
            } catch (err) {
                console.error("LOAD TAGS ERROR:", err);
            }
        },
        async handleNewTask(taskData) {
            try {
                const response = await fetch(`${API_BASE}/api/tasks`, {
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
                    
                    return;
                }

                await this.loadColumns(); 
                this.isOpen = false;

            }catch(err) {
                console.error("handleNewTask ERROR:", err);
            }
        },
        async handleDeleteTask(taskId) {
            try {
                await fetch(`${API_BASE}/api/tasks/${taskId}`, {
                    method: 'DELETE'
                });

                await this.loadColumns();
            } catch (err) {
                console.error("DELETE ERROR:", err);
            }
        },
        async moveTaskHandler({taskId, newColumnId}) {
            try {
                await fetch(`${API_BASE}/api/move-task/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newColumnId })
                });

                await this.loadColumns();
            } catch (err) {
                console.error("MOVETASK ERROR:", err);
            }
        }
    }
})
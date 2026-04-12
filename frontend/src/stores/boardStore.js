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
        isOpen: false,
        currEditedTask: null
    }),

    actions: {
        async request(url, options = {}) {
            const response = await fetch(`${API_BASE}${url}`, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || "Server-Fehler");
                error.details = errorData.details || [];
                throw error;
            }
            //Verhindert Fehler bei leeren Antworten
            return response.json().catch(() => ({}));
        },
        async loadColumns(isInitialLoad = false) {
            this[isInitialLoad ? "isLoading" : "isUpdating"] = true;

            try {
                this.columns = await this.request("/api/columns");
            } catch (err) {
                console.error("LOAD COLUMNS ERROR:", err);
                throw err;
            } finally {
                this.isLoading = false;
                this.isUpdating = false;
            }
        },
        async loadTags() {
            try {
                this.tags = await this.request("/api/tags");
            } catch (err) {
                console.error("LOAD TAGS ERROR:", err);
                throw err;
            } finally {
                this.isLoading = false;
                this.isUpdating = false;
            }
        },
        async handleNewTask(taskData) {
            try {
                await this.request("/api/tasks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        column: taskData.columnId,
                        title: taskData.title,
                        text: taskData.text,
                        taskTags: taskData.tags
                    })
                });
                await this.loadColumns();
                this.isOpen = false;
            } catch (err) {
                console.error("CREATE TASK FAILED:", err);
                throw err; //Damit das Modal weiß: "Nicht schließen, Fehler zeigen!"
            }
        },
        async handleDeleteTask(taskId) {
            try {
                await this.request(`/api/tasks/${taskId}`, {
                    method: "DELETE"
                });

                await this.loadColumns();
            } catch (err) {
                console.error("DELETE TASK ERROR:", err);
                throw err;
            }
        },
        async handleMoveTask({taskId, newColumnId}) {
            try {
                await this.request(`/api/move-task/${taskId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ newColumnId })
                });

                await this.loadColumns();
            } catch (err) {
                console.error("MOVE TASK ERROR:", err);
                throw err;
            }
        },
        async handleUpdatedTask(taskId, taskData) {
            try {
                await this.request(`/api/tasks/${taskId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: taskData.title,
                        text: taskData.text,
                        taskTags: taskData.tags,
                        column: taskData.columnId
                    })
                });
                await this.loadColumns();
                this.isOpen = false;
                this.currentEditedTask = null;
            } catch (err) {
                console.error("UPDATE TASK FAILED:", err);
                throw err;
            }
        }
    }
})
import { defineStore } from "pinia";
const API_BASE = import.meta.env.VITE_API_URL || "";
//using Pinia to avoid Pop Drilling!

export const useBoardStore = defineStore("boardStore", {
    state: () => ({
        columns: [],
        tags: [],
        isLoading: false,
        isUpdating: false,
        isOpen: false,
        currEditedTask: null,
        serverErrors: []
    }),

    actions: {
        async request(url, options = {}) {
            this.serverErrors = [];
            const response = await fetch(`${API_BASE}${url}`, options);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || "Server failure");
                error.details = errorData.details || [];
                this.serverErrors = errorData.details || ["An unknown server error ocurred."]    ;
                throw error;
            }

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
                    body: JSON.stringify(taskData) //expects { columnId, title, text, tags }
                });
                await this.loadColumns();
                this.isOpen = false;
            } catch (err) {
                console.error("CREATE TASK FAILED:", err);
                throw err;
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

        async handleMoveTask({taskId, columnId}) {
            try {
                await this.request(`/api/move-task/${taskId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ columnId })
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
                    body: JSON.stringify(taskData)
                });
                await this.loadColumns();
                this.isOpen = false;
                this.currEditedTask = null;
            } catch (err) {
                console.error("UPDATE TASK FAILED:", err);
                throw err;
            }
        }
    }
});
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

    getters: {
        /**
         * Returns true if the modal is currently editing an existing task
         */
        isEditing: (state) => !!state.currEditedTask
    },

    actions: {
        /**
         * Centralized HTTP request helper method
         */
        async request(url, options = {}) {
            this.serverErrors = [];
            const response = await fetch(`${API_BASE}${url}`, options);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || "Server failure");
                error.details = errorData.details || [];
                this.serverErrors = errorData.details || ["An unknown server error occurred."]    ;
                throw error;
            }

            return response.json().catch(() => ({}));
        },

        /**
         * Fetches board columns and nested tasks
         * @param {boolean} isInitialLoad - Toggles full-screen loader if true, background blur if false
         */
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

        /**
         * Fetches all available task tags
         */
        async loadTags() {
            try {
                this.tags = await this.request("/api/tags");
            } catch (err) {
                console.error("LOAD TAGS ERROR:", err);
                throw err;
            }
        },

        /**
         * Opens modal for creating a new task
         */
        openCreateModal() {
            this.currEditedTask = null;
            this.serverErrors = [];
            this.isOpen = true;
        },

        /**
         * Opens modal populated with task data for editing
         * @param {Object} task - Task object to edit
         */
        openEditModal(task) {
            this.currEditedTask = { ...task };
            this.serverErrors = [];
            this.isOpen = true;
        },

        /**
         * Closes modal and resets edit state
         */
        closeModal() {
            this.isOpen = false;
            this.currEditedTask = null;
            this.serverErrors = [];
        },

        /**
         * Creates a new task and refreshes board
         * @param {Object} taskData - Payload { columnId, title, text, tags }
         */
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

        /**
         * Deletes a task document by ID
         * @param {string} taskId - MongoDB ObjectId string
         */
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

        /**
         * Updates task column location
         * @param {Object} payload - Object { taskId, columnId }
         */
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

        /**
         * Updates existing task details
         * @param {string} taskId - MongoDB ObjectId string
         * @param {Object} taskData - Updated task payload
         */
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
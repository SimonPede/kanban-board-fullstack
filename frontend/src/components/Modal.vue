<script setup>
    import { ref, watch } from 'vue';
    import { useBoardStore } from '../stores/boardStore';

    const boardStore = useBoardStore(); 

    const newTask = ref({
        title: "",
        text: "",
        columnId: "todo",
        tags: []
    });

    watch(() => boardStore.isOpen, (isOpen) => {
        if (isOpen) {
            if (boardStore.currEditedTask) {
                const task = boardStore.currEditedTask;
                newTask.value = {
                    title: task.title,
                    text: task.text || "",
                    columnId: task.columnId,
                    tags: [...(task.tags || [])]
                };
            } else {
                resetForm();
            }
        }
    }, { immediate: true });

    function resetNewTask() {
        newTask.value = {
            title: '',
            text: '',
            columnId: boardStore.columns[0]?.id || "todo",
            tags: []
        }
    }

    async function handleSubmit() {
        try {
            if (boardStore.currEditedTask) {
                await boardStore.handleUpdatedTask(boardStore.currEditedTask.id, newTask.value);
            } else {
                await boardStore.handleNewTask(newTask.value);
            }
            resetNewTask();
        } catch (err) {
            alert("Ups: " + err.message);
        }
    }

    function handleCancel() {
        resetNewTask();
        boardStore.isOpen = false;
    }

</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="handleCancel"></div> <!--Hintergund -->
        
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div class="flex items-center gap-3">
                    <h5 class="text-lg font-bold text-slate-800 m-0 leading-none">
                        {{ boardStore.currEditedTask ? "Edit Task in" : "Create Task in" }}
                    </h5>
                    <select v-model="newTask.columnId" class=" bg-slate-100 px-2 py-1 rounded-md text-blue-600 font-bold hover:bg-slate-200 transition-colors">
                        <option v-for="col in boardStore.columns" :key="col.id" :value="col.id">
                            {{ col.name }}
                        </option>
                    </select>
                </div>
                <button @click="handleCancel" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <div class="p-6">
                <div class="mt-2">
                    <label class="block mb-1.5 text-sm font-bold text-slate-700 tracking-wider">Task Title</label>
                    <input type="text" v-model="newTask.title" maxlength="50" 
                        placeholder="What needs to be done?"
                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <p class="mt-1.5 text-xs text-right text-slate-400">
                        {{ newTask.title.length }}/50 characters
                    </p>
                </div>

                <div class="mt-4">
                    <label class="block mb-1.5 text-sm font-bold text-slate-700 tracking-wider">Description</label>
                    <textarea v-model="newTask.text" rows="4"
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"></textarea>
                </div>
                <div class="mt-4">
                    <label class="block mb-1.5 text-sm font-bold text-slate-700 tracking-wider">Tags</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl border-t border-slate-200">
                        <div v-for="tagName in boardStore.tags" :key="tagName" class="flex">
                            <label :for="tagName"
                                class="flex items-center w-full rounded-lg cursor-pointer select-none transition-all group"
                            >    
                                <input
                                    type="checkbox" 
                                    :value="tagName"
                                    :id="tagName"
                                    v-model="newTask.tags"
                                    class="sr-only peer"
                                >
                                <div class="
                                    w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white
                                    text-center text-sm font-bold transition-all duration-200
                                    text-slate-600 active:scale-90
                                    
                                    peer-checked:!bg-blue-600 peer-checked:!text-white peer-checked:!border-blue-600 peer-checked:!shadow-md
                                    group-hover:border-slate-300 group-hover:bg-slate-50"
                                >
                                    {{ tagName }}
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-2 px-6 py-4 bg-slate-50/80 flex justify-end gap-3">
                <button @click="handleCancel" 
                        class="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all rounded-xl!">
                    Cancel
                </button>
                
                <button @click="handleSubmit" 
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-blue-600/20! font-bold rounded-2xl! shadow-lg transition-all active:scale-95">
                    {{ boardStore.currEditedTask ? "Save Changes" : "Create Task" }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>




<!-- <template>
    <!-- Modal-Container: Wird nur angezeigt, wenn isOpen true ist -->
    <!-- 
        Bootstrap-Klassen:
        - "modal": Definiert das grundlegende Styling und Verhalten eines Modals
        - "show": Aktiviert die Anzeige des Modals (inklusive Animationen)
        - "tabindex=-1": Verbessert die Zugänglichkeit, indem es verhindert, dass das Modal ungewollt fokussiert wird
        - style="display: block": Überschreibt das Standardverhalten von Bootstrap (normalerweise display: none) und zeigt das Modal an
    -->
    <!-- <div :id="MODAL_ID" class="modal show" tabindex="-1" style="display: block">
        <!-- TODO: implement -->
        <!-- <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header d-flex align-items-center">
                    <h5 class="modal-title me-3">Create Task in</h5>
                    <select name="" :id="MODAL_SELECT_COLUMN_ID" v-model="newTask.columnId" class="form-select w-auto">
                        <option v-for="col in columns" :value="col.id">
                            {{ col.name }}
                        </option>
                    </select>
                    <button class="btn-close" @click="$emit('close')" :id="MODAL_BUTTON_X_ID"></button>
                </div>
                <div class="modal-body">
                    <label class="form-label" for="modalInputTitle">Task Title</label>
                    <input type="text" :id="MODAL_INPUT_TITLE_ID" v-model="newTask.title" maxlength="50" class="form-control">
                    <p class="text-muted" :id="MODAL_HELPER_TITLE_ID">
                        {{ newTask.title.length }}/50 characters
                    </p>

                    <label class="form-label" for="modalInputText">Task Description</label>
                    <textarea type="text" :id="MODAL_INPUT_TEXT_ID" v-model="newTask.text" maxlength="50" class="form-control" rows="3"></textarea>
                    
                    <div class="dropdown">
                        <button class="mt-3 btn btn-outline-secondary dropdown-toggle text-start"
                            type="button" 
                            :id="MODAL_DROPDOWN_TRIGGER_ID" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            Select tags
                        </button>

                        <ul class="dropdown-menu w-100 p-3" :id="MODAL_DROPDOWN_MENU_ID">
                            <li v-for="tagName in tags" :key="tagName" class="form-check">
                                <input class="form-check-input" 
                                    type="checkbox" 
                                    :value="tagName" 
                                    :id="MODAL_CHECKBOX_BASE_ID + tagName"
                                    v-model="newTask.tags">
                                <label class="form-check-label" :for="MODAL_CHECKBOX_BASE_ID + tagName">
                                <Tag :tagText="tagName" />
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer d-flex align-items-end gap-2">
                    <button class="mt-1 btn-primary text-center" @click="handleCancel" :id="MODAL_BUTTON_CANCEL">
                        Cancel
                    </button>
                    <button class="mt-1 btn-primary bg-info text-center" @click="handleSubmit" :id="MODAL_BUTTON_SUBMIT">
                        Create
                    </button>
                </div>
            </div>
        </div>
    </div>
</template> -->
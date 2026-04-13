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
                resetNewTask();
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
            boardStore.currEditedTask = null;
            resetNewTask();
        } catch (err) {
            alert("Ups: " + err.message);
        }
    }

    function handleCancel() {
        resetNewTask();
        boardStore.currEditedTask = null;
        boardStore.isOpen = false;
    }

</script>

<template>
    <div class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" @click="handleCancel"></div> 
        
        <div class="relative w-full max-w-lg bg-[#1a1f2e]/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
            
            <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5 shrink-0">
                <div class="flex items-center sm:gap-3 gap-1.5">
                    <h5 class="text-base sm:text-lg font-bold text-white m-0 leading-none tracking-tight">
                        {{ boardStore.currEditedTask ? "Edit Task in" : "Create Task in" }}
                    </h5>
                    <select v-model="newTask.columnId" 
                            class="bg-slate-800/50 border border-white/10 px-2 py-1 rounded-lg text-blue-500 font-bold text-xs outline-none focus:border-blue-500/50 transition-all hover:cursor-pointer">
                        <option v-for="col in boardStore.columns" :key="col.id" :value="col.id" class="bg-slate-500">
                            {{ col.name }}
                        </option>
                    </select>
                </div>
                <button @click="handleCancel" class="text-slate-400 hover:text-white transition-colors p-1 rounded-lg active:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto grow custom-scrollbar space-y-6">
                
                <div class="space-y-2">
                    <label class="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Title</label>
                    <input type="text" v-model="newTask.title" maxlength="50" 
                        placeholder="What needs to be done?"
                        class="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:bg-white/7 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                    <p class="text-[10px] text-right text-slate-400 font-mono">
                        {{ newTask.title.length }}/50
                    </p>
                </div>

                <div class="space-y-2">
                    <label class="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</label>
                    <textarea v-model="newTask.text" rows="4"
                            placeholder="Add more details..."
                            class="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                    </textarea>
                </div>

                <div class="space-y-2 mt-3">
                    <label class="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tags</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <label v-for="tagName in boardStore.tags" :key="tagName" class="group relative flex cursor-pointer">
                            <input type="checkbox" :value="tagName" v-model="newTask.tags" class="sr-only peer">
                            <div class="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-white/5 bg-white/3 text-center text-[11px] font-bold text-slate-400 transition-all duration-200 
                                        group-hover:bg-white/10 group-hover:text-slate-200
                                        peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-500 peer-checked:shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                {{ tagName }}
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-end items-center gap-4 shrink-0">
                <button @click="handleCancel" 
                        class="text-sm font-bold text-slate-400 hover:text-white transition-all active:text-white">
                    Cancel
                </button>
                
                <button @click="handleSubmit" 
                        class="px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-xl! shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:-translate-y-0.5 active:scale-95 transition-all">
                    {{ boardStore.currEditedTask ? "SAVE CHANGES" : "CREATE TASK" }}
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
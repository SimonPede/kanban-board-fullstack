<script setup>
    import 'bootstrap';
    import { ref } from 'vue';
    import Tag from './Tag.vue';

    const MODAL_ID = 'modalRoot' // for the modal's root element
    const MODAL_SELECT_COLUMN_ID = 'modalSelectColumn' // for the selector in the modal's header
    const MODAL_BUTTON_X_ID = 'modalButtonX'
    const MODAL_INPUT_TITLE_ID = 'modalInputTitle' // for the input where users enter the task's title
    const MODAL_HELPER_TITLE_ID = 'modalHelperTitle' // for the helper showing the length of entered title
    const MODAL_INPUT_TEXT_ID = 'modalInputText' // for the textarea where users enter the task's description
    const MODAL_DROPDOWN_TRIGGER_ID = 'modalDropdownTrigger' // for the button that toggles the tag selection dropdown
    const MODAL_DROPDOWN_MENU_ID = 'modalDropdownMenu' // for the root element of the tag selection dropdown's menu
    const MODAL_CHECKBOX_BASE_ID = 'modalCheckbox' // base string for the checkboxes in the dropdown, concatenate with the respective tag's name
    const MODAL_BUTTON_CANCEL = 'modalButtonCancel' // for the modal's cancel button
    const MODAL_BUTTON_SUBMIT = 'modalButtonSubmit' // for the modal's submit button

    const newTask = ref({
        title: '',
        text: '',
        columnId: "todo",
        tags: []
    });

    const props = defineProps({
        isOpen: Boolean,
        columns: Array,
        tags: Array
    });

    const emit = defineEmits(['close', 'submit']);

    function resetNewTask() {
        newTask.value = {
            title: '',
            text: '',
            columnId: props.columns[0]?.id || "todo",
            tags: []
        }
    }

    function handleSubmit() {
        emit('submit', {... newTask.value});
        resetNewTask();
    }

    function handleCancel() {
        resetNewTask();
        emit('close');
    }

</script>

<template>
    <div :id="MODAL_ID" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="handleCancel"></div> <!--Hintergund -->
        
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div class="flex items-center gap-3">
                    <h5 class="text-lg font-bold text-slate-800">Create Task in</h5>
                    <select v-model="newTask.columnId" class="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5 outline-none">
                        <option v-for="col in columns" :key="col.id" :value="col.id">
                            {{ col.name }}
                        </option>
                    </select>
                </div>
                <button @click="handleCancel" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <div class="p-6 space-y-5">
                <div>
                    <label class="block mb-1.5 text-sm font-semibold text-slate-700">Task Title</label>
                    <input type="text" v-model="newTask.title" maxlength="50" 
                        placeholder="What needs to be done?"
                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <p class="mt-1.5 text-xs text-right text-slate-400">
                        {{ newTask.title.length }}/50 characters
                    </p>
                </div>

                <div>
                    <label class="block mb-1.5 text-sm font-semibold text-slate-700">Description</label>
                    <textarea v-model="newTask.text" rows="3"
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"></textarea>
                </div>
                <div class="mt-4">
                    <label class="block mb-2 text-sm font-semibold text-slate-700">Tags</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div v-for="tagName in tags" :key="tagName" class="flex">
                            <label :for="MODAL_CHECKBOX_BASE_ID + tagName"
                                class="flex items-center w-full p-2 rounded-lg cursor-pointer select-none hover:bg-white hover:shadow-sm transition-all group"
                            >    
                                <input
                                    type="checkbox" 
                                    :value="tagName"
                                    :id="MODAL_CHECKBOX_BASE_ID + tagName"
                                    v-model="newTask.tags"
                                    class="shrink-0 w-4 h-4 mb-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer translate-y-40px self-center"
                                    style="margin: 0 !important; 
                                            position: relative !important; 
                                            top: 0px; 
                                            display: inline-block !important;
                                            vertical-align: middle !important;"
                                >

                                <div class="w-2 inline-block"></div>

                                <Tag :tagText="tagName" class="ml-3" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-6 py-4 bg-slate-50/80 flex justify-end gap-3">
                <button @click="handleCancel" 
                        class="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                    Cancel
                </button>
                
                <button @click="handleSubmit" 
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                    Create Task
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
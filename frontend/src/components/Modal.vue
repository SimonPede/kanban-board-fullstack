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
        columnId: null,
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
            columnId: props.columns[0]?.id || null,
            tags: []
        }
    }

    function handleSubmit() {
        emit('submit', {... newTask.value});
        resetNewTask();
    }

    function handleCancel() {
        resetNewTask(); // Beim Abbrechen leeren
        emit('close');
    }

</script>

<template>
    <!-- Modal-Container: Wird nur angezeigt, wenn isOpen true ist -->
    <!-- 
        Bootstrap-Klassen:
        - "modal": Definiert das grundlegende Styling und Verhalten eines Modals
        - "show": Aktiviert die Anzeige des Modals (inklusive Animationen)
        - "tabindex=-1": Verbessert die Zugänglichkeit, indem es verhindert, dass das Modal ungewollt fokussiert wird
        - style="display: block": Überschreibt das Standardverhalten von Bootstrap (normalerweise display: none) und zeigt das Modal an
    -->
    <div :id="MODAL_ID" class="modal show" tabindex="-1" style="display: block">
        <!-- TODO: implement -->
        <div class="modal-dialog">
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
</template>

<style scoped>
</style>
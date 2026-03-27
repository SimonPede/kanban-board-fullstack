<script setup>
    // import { ref } from 'vue';
    ///////////////////////////////////////////////
    // IDs to be used for the respective DOM elements in the template
    ///////////////////////////////////////////////
    const BUTTON_TOGGLE_MODAL_ID = 'buttonToggleModal';

    defineProps(["title"]);
    const emits = defineEmits(["open"]);  
</script>

<template>
    <header class="bg-light d-flex align-items-center justify-content-between p-2">
        <img src="../assets/logo.svg" alt="Logo" class="img-fluid me-2" width="24">
        <h5 class="m-0">{{ title }}</h5>
        <button :id="BUTTON_TOGGLE_MODAL_ID" class="btn-sm btn-primary" @click="$emit('open')">
            Create new Task
        </button>
    </header>
</template>
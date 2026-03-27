<script setup>
    const BUTTON_TOGGLE_MODAL_ID = 'buttonToggleModal';

    defineProps(["title"]);
    defineEmits(["open"]);  
</script>

<template>
    <header class="bg-dark text-light d-flex align-items-center justify-content-between p-3 shadow-sm">
        <div class="d-flex align-items-center">
            <img src="../assets/logo.svg" alt="Logo" class="img-fluid me-2" width="28">
            <h5 class="m-0 fw-bold">{{ title }}</h5>
        </div>
        
        <button 
            :id="BUTTON_TOGGLE_MODAL_ID" 
            class="btn btn-outline-info btn-sm px-3 fw-bold shadow-sm" 
            @click="$emit('open')"
        >
            <i class="bi bi-plus-lg me-1"></i> + Create Task
        </button>
    </header>
</template>

<style scoped>
    header {
        background-color: #1f1f1f !important; 
        border-bottom: 1px solid #333;
    }

    button {
        transition: all 0.3s ease;
        border-radius: 8px;
    }

    button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 255, 255, 0.2);
        filter: brightness(1.1);
    }
</style>
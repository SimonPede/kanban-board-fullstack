<script setup>
    import { useBoardStore } from "../stores/boardStore";
    import { ListTodo, Plus } from "lucide-vue-next";
    const boardStore = useBoardStore();
</script>

<template>
    <header class="sticky top-0 z-40 w-full bg-[#0B0E14]/80 backdrop-blur-md
        border-b border-slate-600 px-6 py-3 flex items-center justify-between shadow-2xl"
    >
        
        <div class="flex items-center gap-3 text-slate-100">
            <div class="p-2 bg-[#0B0E14] rounded-xl text-blue-400 border">
                <ListTodo class="w-6 h-6"/>
            </div>
            <h5 class="text-lg font-black text-slate-100 tracking-tight uppercase m-0 leading-none">
                My Kanban Board
            </h5>
        </div>
        
        <button 
            @click="boardStore.openCreateModal()"
            class="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-slate-100 font-bold rounded-xl!
                transition-all duration-300 hover:bg-blue-500 
                hover:-translate-y-0.5 active:scale-95 shadow-lg"
        >
            <Plus class="w-6 h-6"/>
            <!-- text "Create Task" is not visible on Smartphones! -->
            <span class="hidden sm:inline">Create Task</span>
        </button>
    </header>
</template>
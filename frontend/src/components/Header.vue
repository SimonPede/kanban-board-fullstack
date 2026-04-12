<script setup>
    import { useBoardStore } from '../stores/boardStore';
    import { ListTodo } from 'lucide-vue-next';
    const boardStore = useBoardStore();
    
</script>

<template>
    <header class="sticky top-0 z-40 w-full bg-[#0B0E14]/80 backdrop-blur-md border-b border-slate-600 px-6 py-3 flex items-center justify-between shadow-2xl">
        
        <div class="flex items-center gap-3">
            <div class="p-2 bg-slate-900 rounded-xl text-blue-400 border border-blue-500/20">
                <ListTodo class="w-6 h-6" />
            </div>
            <h5 class="text-lg font-black text-white tracking-tight uppercase m-0 leading-0">
                My Kanban Board
            </h5>
        </div>
        
        <button 
            @click="boardStore.isOpen = true"
            class="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl!
                transition-all duration-300 hover:bg-blue-500 
                hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5
                active:scale-95 shadow-lg"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            <span class="hidden sm:inline">Create Task</span>
        </button>
    </header>
</template>

<style scoped>
</style>
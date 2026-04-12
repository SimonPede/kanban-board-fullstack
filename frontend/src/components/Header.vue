<script setup>
    import { useBoardStore } from '../stores/boardStore';
    import { ListTodo } from 'lucide-vue-next';
    const boardStore = useBoardStore();
    
</script>

<template>
    <header class="sticky top-0 z-40 w-full bg-[#141414] border-b border-slate-600 px-6 py-3 text-light flex items-center justify-between shadow-lg">
        
        <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <ListTodo class="w-6 h-6" />
            </div>
            <h5 class="text-lg font-black text-white tracking-tight uppercase m-0 leading-0">
                My Kanban <span class="text-blue-400">Board</span>
            </h5>
        </div>
        
        <button 
            @click="boardStore.isOpen = true"
            class="group relative flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 font-bold rounded-xl!
                    transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            <span class="hidden sm:inline">Create Task</span>
        </button>
    </header>
</template>

<style scoped>
</style>
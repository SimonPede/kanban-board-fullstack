<script setup>
    import { ref, watch, nextTick } from 'vue';
    import { useBoardStore } from '../stores/boardStore';
    import { X } from "lucide-vue-next";

    const boardStore = useBoardStore(); 
    const errorArea = ref(null);

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

    watch(() => boardStore.serverErrors, async (newErrors) => {
        if (newErrors.length > 0) {
            //warten bis Vue Element gezeichnet hat
            await nextTick(); 
            
            if (errorArea.value) {
                errorArea.value.scrollIntoView({ 
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    }, { deep: true });

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
            console.log("Task Erstellung ist fehlgeschlagen. User bekommt Meldung vom Server angezeigt.");
        }
    }

    function handleCancel() {
        boardStore.serverErrors = [];
        resetNewTask();
        boardStore.currEditedTask = null;
        boardStore.isOpen = false;
    }

</script>

<template>
    <div class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" @click="handleCancel"></div> 
        
        <div class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-600 bg-[#1a1f2e]/95 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            
            <div class="flex shrink-0 items-center justify-between border-b border-slate-700/80 bg-slate-800/40 px-6 py-4">
                <div class="flex items-center sm:gap-3 gap-1.5 text-slate-100">
                    <h5 class="m-0 text-base font-bold leading-none tracking-tight sm:text-lg">
                        {{ boardStore.currEditedTask ? "Edit Task in" : "Create Task in" }}
                    </h5>
                    <select v-model="newTask.columnId" 
                            class="cursor-pointer rounded-lg border border-slate-600 bg-slate-900
                                px-2 py-1 text-xs font-bold text-blue-300 outline-none transition-all hover:border-blue-400/60
                                hover:bg-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option v-for="col in boardStore.columns" :key="col.id" :value="col.id" class="bg-slate-900 text-slate-100">
                            {{ col.name }}
                        </option>
                    </select>
                </div>
                <button @click="handleCancel" class="p-1 text-slate-400 transition-colors hover:text-slate-100 active:text-white">
                    <X />
                </button>
            </div>

            <div class="p-6 overflow-y-auto grow custom-scrollbar space-y-6">
                <div v-if="boardStore.serverErrors.length > 0"
                        ref="errorArea"
                        class="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-red-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="space-y-1">
                            <p class="text-sm font-bold text-red-500">Ah, damn! Something is wrong:</p>
                            <ul class="text-xs text-red-400/80 list-disc list-inside">
                                <li v-for="(err, index) in boardStore.serverErrors" :key="index">
                                    {{ err }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Task Title</label>
                    <input type="text" v-model="newTask.title" maxlength="50" 
                        placeholder="What needs to be done?"
                        class="w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:bg-white/7 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                    <p class="text-[10px] text-right text-slate-400 font-mono">
                        {{ newTask.title.length }}/50
                    </p>
                </div>

                <div class="space-y-2">
                    <label class="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Description</label>
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
.animate-shake {
    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>

<script setup>
	import TaskCard from './TaskCard copy.vue'; 
	defineProps(["column"]);
</script>

<template>
	<div class="flex flex-col bg-[#1a1f2e]/60 backdrop-blur-md border border-slate-600 p-4 rounded-2xl min-h-37.5 shadow-2xl transition-all hover:border-blue-500/30">
		<h4 class="text-lg font-black text-white tracking-tight m-0 leading-0 mt-2 flex justify-between items-center mb-2">
				{{ column.name }}
				<span class="bg-slate-700 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-inner">
					{{ column.tasks.length }}
				</span>
		</h4>
		
		<div class="space-y-3">
            <TaskCard
                v-for="task in column.tasks" :key="task.id"
                :task="task" :currentColumnId="column.id"
            />
        </div>

		<div v-if="column.tasks.length === 0"
			class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/20" style="border-style: dashed !important; border-width: 1px;">
			<p class="text-slate-400 text-xs font-medium uppercase tracking-tighter italic">No task here yet.</p>
			<svg class="mt-2 w-6 h-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
		</div>
	</div>
</template>

<style scoped>
</style>
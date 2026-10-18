<script setup>
	import TaskCard from "./TaskCard.vue";
	import { PackageOpen } from "lucide-vue-next";
	defineProps(["column"]);
</script>

<template>
	<div class="flex flex-col bg-[#1a1f2e]/60 backdrop-blur-md border border-slate-600 p-4
		rounded-2xl min-h-37.5 transition-all text-slate-100"
	>
		<h4 class="text-lg font-black tracking-tight m-0 leading-none mt-2 flex justify-between items-center mb-2">
				{{ column.name }}
				<span class="bg-slate-700 text-[10px] px-2.5 py-1 rounded-full font-bold shadow-inner">
					{{ column.tasks.length }}
				</span>
		</h4>
		
		<div class="space-y-3">
            <TaskCard
				v-for="task in column.tasks" 
				:key="task.id"
				:task="task"
            />
        </div>

		<div v-if="column.tasks.length === 0"
			class="flex flex-col items-center justify-center py-10
				border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/20 text-slate-400"
			style="border-style: dashed !important; border-width: 1px;"
		>
			<p class="text-xs font-medium uppercase tracking-tighter italic">
				No task here yet.
			</p>
			<PackageOpen class="w-7 h-7"/>
		</div>
	</div>
</template>

<style scoped>
</style>
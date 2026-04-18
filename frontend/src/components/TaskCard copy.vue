<script setup>
	import { computed, ref } from 'vue';
	import Tag from './Tag.vue'
	import { Trash2, Pencil } from 'lucide-vue-next';
	import { useBoardStore } from '../stores/boardStore';
    const boardStore = useBoardStore();

	const props = defineProps({
		task: { type: Object, required: true },
		currentColumnId: { type: String, required: true }
	});
	const isCollapsed = ref(true);

	const otherColumns = computed(() => {
        if (!boardStore.columns) return [];
        return boardStore.columns.filter(col => col.id !== props.currentColumnId);
    });

	function toggleCollapsed() {
		isCollapsed.value = !isCollapsed.value;
	}

	function handleMove(event) {
		const newColumnId = event.target.value;
		boardStore.handleMoveTask({ taskId: props.task.id, newColumnId });
	}

	function openEditModal() {
		boardStore.currEditedTask = { 
			...props.task, 
			columnId: props.currentColumnId 
		};
		boardStore.isOpen = true;
	}
</script>

<template>
	<div class="bg-slate-100 mt-3 rounded-xl border border-slate-200 shadow-sm p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md group">
		<div class="flex justify-between items-center mb-3">
			<h6 class="m-0 font-bold text-slate-800 truncate max-w-[80%]">
				{{ task.title }}
			</h6>
			<button
				class="text-red-400 opacity-40 group-hover:opacity-100 transition-all duration-200 hover:-translate-y-1 hover:text-red-600"
				@click.stop="boardStore.handleDeleteTask(task.id)"
				aria-label="Löschen"
			>
				<Trash2 :size="18"/>
			</button>
		</div>

		<div 
			:class="[
				'text-sm text-slate-500 leading-relaxed cursor-pointer', 
				'my-3 py-3 px-2 bg-white/40 rounded-lg border-y border-slate-200/50', 
				isCollapsed ? 'truncate' : 'whitespace-normal'
			]"
			@click="toggleCollapsed"
		>
			{{ task.text }}
		</div>

		<div class="space-y-3 bg-transparent border-0 pt-0">
			<div class="flex flex-wrap gap-1 mb-2">
				<Tag v-for="tag in task.tags" :key="tag" :tagText="tag" />
			</div>
			<div class="mt-2 pt-2 flex justify-between items-center border-t border-slate-200">
				<select
					class="text-[11px] bg-slate-200/50 border-0 rounded-lg px-2 py-1 text-slate-500 opacity-40 group-hover:opacity-100 transition-all ease-in-out cursor-pointer focus:ring-0"
					@change="handleMove"
					:value="currentColumnId" 
				>
					<option value="" disabled selected>Move to...</option>
					<option v-for="col in otherColumns" :value="col.id" :key="col.id">
						→ {{ col.name }}
					</option>
				</select>
				<button
					aria-label="Editieren"
					
					class="text-black/50 opacity-40 group-hover:opacity-100 transition-all duration-200 hover:-translate-y-1 hover:text-black"
					@click.stop="openEditModal"
				>
					<Pencil :size="18"/>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>

	/*sieht finde ich besser aus als die tailwind Lösung*/
    .truncate {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

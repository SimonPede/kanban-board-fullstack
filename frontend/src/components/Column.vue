<script setup>
	import TaskCard from './TaskCard.vue';
	defineProps(["column", "allColumns"]);
	defineEmits(["delete-task", "move-task"]);
</script>

<template>
	<div class="kanban-col p-2 rounded">
		<h4 class="text-light pt-2 d-flex justify-content-between align-items-center">
				{{ column.name }}
				<span class="badge rounded-pill bg-secondary mt-1">
					{{ column.tasks.length }}
				</span>
		</h4>
		<div class="column-body">
			<TaskCard
				v-for="task in column.tasks" :key="task.id"
				:task="task" :allColumns="allColumns" :currentColumnId="column.id"
				@delete-task="$emit('delete-task', $event)" @move-task="$emit('move-task', $event)"
			/>
		</div>
		<div v-if="column.tasks.length === 0" class="text-center py-5 border rounded border-secondary border-dashed" style="border-style: dashed !important; border-width: 1px;">
			<p class="text-muted small m-0">No task here yet.</p>
			<i class="bi bi-box-seam text-muted" style="font-size: 1.5rem;"></i>
		</div>
	</div>
</template>

<style scoped>
	h4 span {
		font-size: 0.7rem;
	}

	.kanban-col {
		background-color: rgba(145, 139, 139, 0.389);
		border: 1px solid rgba(255, 255, 255, 0.1);
		margin-top: 1rem;
	}
</style>
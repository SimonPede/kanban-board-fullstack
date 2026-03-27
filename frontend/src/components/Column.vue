<script setup>
	import TaskCard from './TaskCard.vue';
	defineProps(["column"]);
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
			<TaskCard v-for="task in column.tasks" :key="task.id" :task="task" />
		</div>
		<div v-if="column.tasks.length === 0" class="text-center">
			<p class="text-muted small m-0">No task here yet.</p>
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
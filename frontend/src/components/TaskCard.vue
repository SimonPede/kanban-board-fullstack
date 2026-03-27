<script setup>
	import { ref } from 'vue';
	import Tag from './Tag.vue'
	import { Trash2 } from 'lucide-vue-next';

	defineProps(["task"]);
	defineEmits(["delete-task"]);
	const isCollapsed = ref(true);

	function toggleCollapsed() {
		isCollapsed.value = !isCollapsed.value;
	}
</script>

<template>
	<div class="card bg-light mt-3 shadow-sm border-0 task-card">
		<div class="card-header d-flex justify-content-between align-items-center">
			<h6 class="m-0 fw-bold text-truncate" style="max-width: 80%;">
				{{ task.title }}
			</h6>
			<button
				aria-label="Löschen"
				class="btn btn-link text-danger p-0 m-0 d-flex align-items-center delete-btn"
				@click.stop="$emit('delete-task', task.id)"
			>
				<Trash2 :size="18" />
			</button>
		</div>

        <div :class="['card-body', {'collapsed': isCollapsed}]" @click="toggleCollapsed">
			{{ task.text }}
		</div>

		<div class="card-footer">
			<Tag v-for="tag in task.tags" :tagText="tag" />
		</div>
	</div>
</template>

<style scoped>
	.collapsed {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.task-card {
        transition: transform 0.2s ease;
    }
    
    .task-card:hover {
        transform: translateY(-2px);
    }

	/* Der Button ist standardmäßig fast unsichtbar und wird beim Hover deutlich */
    .delete-btn {
        opacity: 0.4;
        transition: opacity 0.2s;
		transition: transform 0.2s;
    }

	.delete-btn:hover {
        transform: translateY(-2px);
    }
    
    .task-card:hover .delete-btn {
        opacity: 1.0;
    }
</style>

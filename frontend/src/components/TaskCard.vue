<script setup>
	import { computed, ref } from 'vue';
	import Tag from './Tag.vue'
	import { Trash2 } from 'lucide-vue-next';
	import { useBoardStore } from '../stores/boardStore';
    const boardStore = useBoardStore();

	const props = defineProps(["task", "allColumns", "currentColumnId"]);
	const isCollapsed = ref(true);

	const otherColumns = computed(() => {
        if (!props.allColumns) return [];
        return props.allColumns.filter(col => col.id !== props.currentColumnId);
    });

	function toggleCollapsed() {
		isCollapsed.value = !isCollapsed.value;
	}

	function handleMove(event) {
		const newColumnId = event.target.value;
		boardStore.moveTaskHandler( { taskId: props.task.id, newColumnId });
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
				@click.stop="boardStore.handleDeleteTask(task.id)"
			>
				<Trash2 :size="18"/>
			</button>
		</div>

        <div :class="['card-body', {'collapsed': isCollapsed}]" @click="toggleCollapsed">
			{{ task.text }}
		</div>

		<div class="card-footer bg-transparent border-0 pt-0">
			<div class="d-flex flex-wrap gap-1 mb-2">
				<Tag v-for="tag in task.tags" :key="tag" :tagText="tag" />
			</div>
			<div class="mt-2 pt-2 border-top border-secondary-subtle d-flex justify-content-lg-start gap-2 align-items-center">
				<label 
					class="form-label text-muted small m-0 mb-1 d-block" 
					style="font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;"
				>
					Move to status
				</label>
				<select
					class="form-select form-select-sm w-auto border-0 text-muted transition-all action-dropdown"
					@change="handleMove"
					:value="currentColumnId" 
				>
					<option v-for="col in otherColumns" :value="col.id" :key="col.id">
						→ {{ col.name }}
					</option>
				</select>
			</div>
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

	/* Der Button ist standardmäßig fast unsichtbar*/
    .delete-btn {
        opacity: 0.4;
        transition: opacity 0.2s ease-in-out;
		transition: transform 0.2s;
    }

	.delete-btn:hover {
        transform: translateY(-2px);
    }
    
    .task-card:hover .delete-btn {
        opacity: 1.0;
    }

	.action-dropdown {
		opacity: 0.4; /* Standardmäßig dezent */
		transition: all 0.2s ease-in-out;
		border-radius: 6px;
		padding-left: 0.5rem;
		padding-right: 1.5rem; /* Platz für den Pfeil */
		font-size: 0.75rem;
		background-color: #f1f3f5;
		cursor: pointer;
	}

	/* den Fokus-Rahmen von Bootstrap weg und eigenes Styling */
	.action-dropdown:focus {
		box-shadow: none;
		border: 1px solid #ced4da !important;
	}

	/* Beim Hover über die Karte wird das Dropdown präsent */
	.task-card:hover .action-dropdown {
		opacity: 1;
		background-color: #e9ecef;
	}
</style>

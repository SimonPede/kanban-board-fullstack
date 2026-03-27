<script setup>
	import { ref } from 'vue';
	import Tag from './Tag.vue'

	defineProps(["task"]);
	const isCollapsed = ref(true);

	function toggleCollapsed() {
		isCollapsed.value = !isCollapsed.value;
	}
</script>

<template>
	<div class="card bg-light mt-3">
        <h5 class="card-header collapsed">{{ task.title }}</h5>

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
</style>

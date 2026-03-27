<script setup>
	import Column from './Column.vue';
	defineProps(["columns"]);
    defineEmits(["delete-task"]);
</script>

<template>
    <div class="container-fluid">
        <div class="row g-3">
            <div v-for="col in columns" :key="col.id" class="col-lg-4 col-md-6 col-12">
                <Column :column="col" @delete-task="$emit('delete-task', $event)"></Column>
            </div>
        </div>
    </div>
</template>

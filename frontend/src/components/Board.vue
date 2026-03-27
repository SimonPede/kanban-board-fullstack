<script setup>
	import Column from './Column.vue';
	defineProps(["columns"]);
    defineEmits(["delete-task", "move-task"]);
</script>

<template>
    <div class="container-fluid">
        <div class="row g-3">
            <div v-for="col in columns" :key="col.id" class="col-lg-4 col-md-6 col-12">
                <Column
                    :column="col" :allColumns="columns"
                    @delete-task="$emit('delete-task', $event)"  @move-task="$emit('move-task', $event)"
                />
            </div>
        </div>
    </div>
</template>

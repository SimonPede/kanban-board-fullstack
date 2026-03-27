<script setup>
	import Column from './Column.vue';
	defineProps(["columns"]);
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div v-for="col in columns" :key="col.id" class="col-lg-4 col-md-6 col-12">
                <Column :column="col"></Column>
            </div>
        </div>
    </div>
</template>

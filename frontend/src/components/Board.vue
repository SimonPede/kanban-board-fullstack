<script setup>
	import Column from './Column.vue';
	defineProps(["columns"]);
</script>

<template>
    <div class="container-fluid">
        <div class="row g-3">
            <div v-for="col in columns" :key="col.id" class="col-lg-4 col-md-6 col-12">
                <Column
                    :column="col" :allColumns="columns"
                />
            </div>
        </div>
    </div>
</template>

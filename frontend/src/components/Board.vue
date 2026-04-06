<script setup>
	import Column from './Column.vue';
    import { useBoardStore } from '../stores/boardStore';
    const boardStore = useBoardStore(); 
</script>

<template>
    <div class="w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="col in boardStore.columns" :key="col.id" class="h-full">
                <Column
                    :column="col"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useBoardStore } from './stores/boardStore'
    import Board from './components/Board.vue';
    import Header from './components/Header.vue';
    import Modal from './components/Modal.vue';

    const boardStore = useBoardStore();

    onMounted(async () => {
        try {
            await Promise.all([boardStore.loadColumns(true), boardStore.loadTags()]);
        } catch (error) {
            console.log("Beim Laden von Columns oder Tags gab es einen Fehler!");
        }
    });
</script>

<template>
    <div v-if="boardStore.isLoading" class=" bg-[#323232] flex flex-col items-center justify-center min-h-[50vh] mt-20">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p class="mt-4 text-slate-400 font-medium animate-pulse">Loading Board...</p>
    </div>
	<div v-else class="min-h-screen bg-[#323232]">
        <div :class="[
            'transition-all duration-500 ease-in-out',
            { 'blur-sm grayscale opacity-50 pointer-events-none': boardStore.isUpdating }
        ]">
            <Header/>
            <Board :columns="boardStore.columns"/>
        </div>
		<Modal 
			v-if="boardStore.isOpen"
		/>
	</div>
</template>

<style scoped>
</style>
<script setup>
    import { ref, onMounted } from 'vue';
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
    <div v-if="boardStore.isLoading" class="d-flex justify-content-center mt-5">
        <div class="spinner-border text-primary"></div>
    </div>
	<div v-else>
		<Header/>
		<Board :columns="boardStore.columns"/>
		<Modal 
			v-if="boardStore.isOpen"
			:isOpen="isOpen" 
			:columns="boardStore.columns" 
			:tags="boardStore.tags" 
			@close="boardStore.isOpen = false"
			@submit="boardStore.handleNewTask"
		/>
	</div>
</template>
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
        <div :class="{ 'content-blur': boardStore.isUpdating}">
            <Header/>
            <Board :columns="boardStore.columns"/>
        </div>
		<Modal 
			v-if="boardStore.isOpen"
		/>
	</div>
</template>

<style scoped>

/* Board wird leicht unscharf, während es lädt */
.content-blur {
    filter: blur(2px) grayscale(0.3); /* Kombiniert leichte Unschärfe mit Entfärbung */
    opacity: 0.6;
    pointer-events: none; /* Verhindert Klicks auf das Board während des Updates */
    transition: all 0.3s ease; /* Macht das Ein-/Ausblenden weich */
}

/* Standard-Zustand für den Content (für weichen Übergang) */
div {
    transition: all 0.3s ease;
}
</style>
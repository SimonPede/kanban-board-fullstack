<script setup>
    import { onMounted, watch } from "vue";
    import { useBoardStore } from "./stores/boardStore";
    import Board from "./components/Board.vue";
    import Header from "./components/Header.vue";
    import Modal from "./components/Modal.vue";

    const boardStore = useBoardStore();

    onMounted(async () => {
        try {
            await Promise.all([boardStore.loadColumns(true), boardStore.loadTags()]);
        } catch (error) {
            console.error("Error loading initial board data:", error);
        }
    });

    watch(() => boardStore.isOpen, (isOpen) => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, { immediate: true });
</script>

<template>
    <div
        v-if="boardStore.isLoading"
        class="bg-[#0B0E14] flex flex-col items-center justify-center min-h-screen"
    >
        <div class="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-slate-400 font-medium animate-pulse">Loading Board...</p>
    </div>
	<div v-else class="min-h-screen bg-[#0B0E14]">
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
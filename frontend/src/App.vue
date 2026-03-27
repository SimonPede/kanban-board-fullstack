<script setup>
    import { ref, onMounted } from 'vue';
    import Board from './components/Board.vue';
    import Header from './components/Header.vue';
    import Modal from './components/Modal.vue'; //Modal importen (1. Aufgabe)

    //Speichervariablen für Daten vom Backend
    const tags = ref([]);
    const columns = ref([]);

    const isOpen = ref(false); //entscheidet, ob Modal geöffnet ist, oder nicht. getogglet durch openModalFunction
    const isLoading = ref(true);
    const title = "My Kanban Board";

    async function loadTags() {
        const response = await fetch('/api/tags');
        tags.value = await response.json();
    }

    async function loadColumns() {
        const response = await fetch('/api/columns');
        columns.value = await response.json();
    }

    async function handleNewTask(taskData) {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                column: taskData.columnId,
                title: taskData.title,
                text: taskData.text,
                taskTags: taskData.tags
            })
        });

        await loadColumns();
        
        isOpen.value = false;
    }

    async function handleDeleteTask(taskId) {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        await loadColumns();
    }

    async function moveTaskHandler({taskId, newColumnId}) {
        await fetch(`/api/move-task/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newColumnId })
        });

        await loadColumns();
    }

    onMounted(async () => {
        try {
            await Promise.all([loadColumns(), loadTags()]);
        } catch (error) {
            console.log("Beim Laden von Columns oder Tags gab es einen Fehler!");
        } finally {
            isLoading.value = false;
        }
    });

</script>

<template>
    <div v-if="isLoading" class="d-flex justify-content-center mt-5">
        <div class="spinner-border text-primary"></div>
    </div>
	<div v-else>
		<Header :title="title" @open="isOpen = !isOpen"/>
		<Board :columns="columns" @delete-task="handleDeleteTask" @move-task="moveTaskHandler"/>
		<Modal 
			v-if="isOpen"
			:isOpen="isOpen" 
			:columns="columns" 
			:tags="tags" 
			@close="isOpen = false"
			@submit="handleNewTask"
		/>
	</div>
</template>
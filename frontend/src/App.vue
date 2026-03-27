<script setup>
    import { ref, onMounted } from 'vue';
    import Board from './components/Board.vue';
    import Header from './components/Header.vue';
    import Modal from './components/Modal.vue'; //Modal importen (1. Aufgabe)

    const tags = ref([]);
    const columns = ref([]);
    const isOpen = ref(false); //entscheidet, ob Modal geöffnet ist, oder nicht. getogglet durch openModalFunction

    const title = 'My Kanban Board'

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

    onMounted(() => {
        loadTags()
        loadColumns()
    });

</script>

<template>
	<div>
		<Header :title="title" @open="isOpen = !isOpen"></Header>
		<Board :columns="columns"></Board>
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
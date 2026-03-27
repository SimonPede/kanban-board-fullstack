<template>
    <span class="badge me-2" :class="colorClass">
        {{ tagText }}
    </span>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps(["tagText"]);

    const colorClass = computed(() => {
        switch (props.tagText) {
            case 'Feature':
                return "bg-primary"
            case 'Bug':
                return 'bg-primary';
            case 'In concept':
                return 'bg-secondary';
            case 'Shelved':
                return 'bg-secondary';
            case 'Abandoned':
                return 'bg-secondary';
            case 'Assigned':
                return 'bg-success';
            case 'Client request':
                return 'bg-warning text-dark'; // Gelb braucht oft dunkle Schrift für Lesbarkeit
            case 'Urgent':
                return 'bg-danger';
            default:
                return 'bg-light text-dark'; // Default laut Tabelle
        }
    });
</script>

<style scoped>

</style>
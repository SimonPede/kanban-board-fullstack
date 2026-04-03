<template>
    <span class="badge" :class="colorClass">
        {{ tagText }}
    </span>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps(["tagText"]);

    const colorClass = computed(() => {
    switch (props.tagText) {
        // Blau-Töne für Technik
        case 'Backend':
        case 'Database':
        case 'Logic':
            return "bg-primary-subtle text-primary border border-primary-subtle";
        
        // Türkis/Info für Frontend & UI
        case 'Frontend':
        case 'UI':
        case 'Feature':
            return 'bg-info-subtle text-info border border-info-subtle';
        
        // Lila/Violett für Design & UX
        case 'Design':
        case 'UX':
        case 'Animation':
            return 'bg-secondary text-white'; 

        // Warnfarben (falls du sie mal wieder einbaust)
        case 'Urgent':
        case 'Bug':
            return 'bg-danger';

        default:
        return 'bg-dark text-light border border-secondary';
    }
    });
</script>

<style scoped>
    .badge {
        font-weight: 500;
        font-size: 0.7rem;
        padding: 0.35em 0.65em;
        /* Ein leichter Glas-Effekt */
        backdrop-filter: blur(4px);
    }
</style>
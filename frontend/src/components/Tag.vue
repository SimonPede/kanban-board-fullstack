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
            // Blau: Harte Technik & Logik
            case 'Backend':
            case 'Database':
            case 'Logic':
                return "bg-blue-500/70 text-blue-400 border-blue-500/40";
            
            // Cyan/Sky: Sichtbares & Interaktion
            case 'Frontend':
            case 'UI':
            case 'Feature':
                return 'bg-cyan-500/90 text-cyan-400 border-cyan-500/20';
            
            // Indigo/Violett: Kreativität & Flow
            case 'Design':
            case 'UX':
            case 'Animation':
                return 'bg-indigo-500/100 text-indigo-400 border-indigo-500/20';

            // Rose: Warnungen & Fehler
            case 'Urgent':
            case 'Bug':
                return 'bg-rose-500/100 text-rose-400 border-rose-500/20';

            // Default: Neutrales Slate
            default:
                return 'bg-slate-500/90 text-slate-400 border-slate-500/20';
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
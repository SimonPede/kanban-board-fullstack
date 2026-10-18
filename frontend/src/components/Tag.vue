<script setup>
    import { computed } from "vue";

    const props = defineProps(["tagText"]);

    const colorClass = computed(() => {
        switch (props.tagText) {
            //Blue: technical work and logic
            case "Backend":
            case "Database":
            case "Logic":
                return "bg-blue-500/70 text-blue-400 border-blue-500/40";
            
            //Cyan/Sky: visual work and interaction
            case "Frontend":
            case "UI":
            case "Feature":
                return "bg-cyan-500/90 text-cyan-400 border-cyan-500/20";
            
            //Indigo/Purple: creativity and flow
            case "Design":
            case "UX":
            case "Animation":
                return "bg-indigo-500 text-indigo-400 border-indigo-500/20";

            //Rose: warnings and errors
            case "Urgent":
            case "Bug":
                return "bg-rose-500 text-rose-400 border-rose-500/20";

            //Default: neutral slate
            default:
                return "bg-slate-500/90 text-slate-400 border-slate-500/20";
        }
    });
</script>

<template>
    <span
        class="inline-flex items-center rounded-md border px-2 py-1 text-[0.7rem] font-medium backdrop-blur text-slate-100"
        :class="colorClass"
    >
        {{ tagText }}
    </span>
</template>

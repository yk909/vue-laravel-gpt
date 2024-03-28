<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({
    title: "Page Not Found",
});
</script>

<template>
    <main
        class="flex min-h-screen items-center justify-center gap-2 bg-base-100 text-base-content antialiased"
    >
        <div
            class="flex items-center justify-center gap-2 text-lg uppercase tracking-wider"
        >
            <span>404</span>
            <span
                class="divider divider-horizontal mx-0 before:bg-base-content/60 after:bg-base-content/60"
            />
            <span>Page Not Found</span>
        </div>
    </main>
</template>

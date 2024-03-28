<script setup lang="ts">
import { setTheme } from "@/utils/helpers";
import { ref, watch } from "vue";
const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
];

const value = ref(null);

watch(() => value.value, setTheme);
</script>

<template>
    <select v-model="value" class="select select-bordered select-sm capitalize">
        <option :value="null">Default Theme</option>
        <option
            class="capitalize"
            v-for="theme in themes"
            :key="theme"
            :value="theme"
        >
            {{ theme }}
        </option>
    </select>
</template>

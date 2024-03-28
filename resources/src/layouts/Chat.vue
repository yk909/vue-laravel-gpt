<script setup lang="ts">
import LenginLogoSvg from "@/components/SVG/LenginLogo.svg.vue";
import TrashIconSvg from "@/components/SVG/TrashIcon.svg.vue";
import ThemeSelect from "@/components/ThemeSelect.vue";
import type { Chat } from "@/types/app";
import db, { useObservable } from "@/utils/database";
import { trunc } from "@/utils/helpers";
import { onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const { model } = defineProps({ model: { type: String, default: null } });
const route = useRoute();
const router = useRouter();
const chats = useObservable(
    db.getChats((q) => q.orderBy("createdAt").reverse().limit(10).toArray()),
    [],
);

function deleteChat(chat: Chat) {
    db.deleteChat(chat.id);
    if (Number(route.params.id) === chat.id) {
        router.replace("/");
    }
}

onUnmounted(() => chats.destroy());
</script>

<template>
    <div id="drawer" class="drawer lg:drawer-open">
        <input id="sidebar" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex min-h-screen flex-col">
            <nav
                v-if="model"
                class="navbar sticky top-0 z-10 bg-base-100 drop-shadow"
            >
                <div class="flex-none">
                    <label
                        for="sidebar"
                        class="btn btn-square btn-ghost lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="inline-block h-5 w-5 stroke-current"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </label>
                </div>
                <div class="flex-1 text-xl">
                    <button class="btn btn-ghost text-xl">
                        {{ model }}
                    </button>
                </div>
            </nav>
            <slot />
        </div>
        <div class="drawer-side z-10">
            <label
                for="sidebar"
                aria-label="close sidebar"
                class="drawer-overlay"
            />
            <div
                class="flex min-h-full flex-col gap-4 bg-base-200 p-2 text-base-content"
            >
                <button class="btn-xl btn btn-ghost max-h-none">
                    <LenginLogoSvg class="h-12" />
                </button>
                <ul class="menu w-64 flex-1">
                    <li class="mb-2">
                        <router-link class="btn btn-outline btn-sm" to="/">
                            + New Chat
                        </router-link>
                    </li>
                    <li v-for="chat in chats" :key="chat.id" class="group">
                        <router-link
                            :to="`/chat/${chat.id}`"
                            class="flex rounded-lg"
                        >
                            <span class="flex-1">
                                {{ trunc(chat.name, 30) }}
                            </span>
                            <button
                                type="button"
                                class="btn btn-square btn-error btn-xs -my-1 -mr-2 hidden items-center justify-center rounded-md group-hover:flex"
                                @click.stop.prevent="deleteChat(chat)"
                            >
                                <TrashIconSvg class="h-4 fill-current" />
                            </button>
                        </router-link>
                    </li>
                </ul>
                <ThemeSelect />
            </div>
        </div>
    </div>
</template>

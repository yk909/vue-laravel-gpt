<script setup lang="ts">
import SendIconSvg from "@/components/SVG/SendIcon.svg.vue";
import Chat from "@/layouts/Chat.vue";
import database from "@/utils/database";
import { resize } from "@/utils/helpers";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useHead } from "@unhead/vue";

const router = useRouter();
const message = ref("");
const loading = ref(false);

async function submit() {
    if (!message.value) return;

    loading.value = true;

    const detail = await database.createChat({
        content: message.value,
        role: "user",
    });

    router.push(`/chat/${detail.chatId}`).then(() => {
        window.dispatchEvent(new CustomEvent("message:created", { detail }));
    });
}

useHead({
    title: "New Chat",
});
</script>

<template>
    <Chat>
        <main class="flex flex-1 items-center justify-center p-4">
            <div
                class="container flex h-full flex-col lg:max-w-2xl xl:max-w-3xl"
            >
                <div
                    class="flex flex-1 items-center justify-center gap-4 text-3xl"
                >
                    <span class="loading loading-ring w-12 text-primary" />
                    How can I help you today?
                </div>
                <form class="relative flex" @submit.prevent="submit">
                    <textarea
                        v-model="message"
                        @input="resize($event.target as HTMLTextAreaElement)"
                        @keydown.enter.exact.prevent="submit"
                        rows="1"
                        class="textarea textarea-bordered w-full resize-none pr-12"
                        type="text"
                        required
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        class="btn btn-square btn-primary btn-sm absolute bottom-2 right-2"
                        :disabled="loading || !message"
                    >
                        <SendIconSvg class="h-6 fill-current" />
                    </button>
                </form>
            </div>
        </main>
    </Chat>
</template>

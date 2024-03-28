<script setup lang="ts">
import SendIconSvg from "@/components/SVG/SendIcon.svg.vue";
import Chat from "@/layouts/Chat.vue";
import type { ChatLoading } from "@/types/app";
import { chat } from "@/utils/api";
import db, { useObservable } from "@/utils/database";
import { renderMarkdown, resize } from "@/utils/helpers";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";

const route = useRoute();
const chatId = ref(Number(route.params.id));
const message = ref("");
const stream = ref("");
const loading = ref(undefined as undefined | ChatLoading);
const messages = useObservable(
    db.getMessages((q) => q.where("chatId").equals(chatId.value).toArray()),
    [],
);

async function submit() {
    if (!message.value) return;

    const messageId = await db.createMessage({
        chatId: chatId.value,
        content: message.value,
        role: "user",
    });

    message.value = "";

    window.dispatchEvent(
        new CustomEvent("message:created", { detail: { messageId } }),
    );
}

async function handler(event: CustomEvent) {
    const { messageId } = event.detail;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    while (messages.value[messages.value.length - 1]?.id !== messageId) {
        await sleep(10);
    }

    loading.value = chat(messages.value, (res) => (stream.value += res));
    loading.value
        .then(() => {
            db.createMessage({
                chatId: chatId.value,
                content: stream.value,
                role: "assistant",
            });

            stream.value = "";
        })
        .catch(() => {
            db.deleteMessage(messageId);
        })
        .finally(() => (loading.value = undefined));
}

useHead({
    title: () => messages.value[0]?.content || "New Chat",
});

watch(
    () => route.params.id,
    (val) => {
        chatId.value = Number(val);
        messages.update(
            db.getMessages((q) =>
                q.where("chatId").equals(chatId.value).toArray(),
            ),
        );
    },
);

onMounted(() => {
    window.addEventListener("message:created", handler);
});

onUnmounted(() => {
    window.removeEventListener("message:created", handler);
    messages.destroy();
});
</script>

<template>
    <Chat>
        <main class="flex h-full flex-1 items-center justify-center p-4">
            <div
                class="container flex h-full flex-col gap-6 lg:max-w-2xl xl:max-w-3xl"
            >
                <div class="flex-1 overflow-auto">
                    <div
                        v-for="message in messages"
                        :key="message.id"
                        v-bind:class="
                            message.role === 'assistant'
                                ? 'chat-start'
                                : 'chat-end'
                        "
                        class="chat"
                    >
                        <div
                            v-bind:class="
                                message.role === 'assistant'
                                    ? 'chat-bubble-secondary text-secondary-content'
                                    : 'chat-bubble-primary text-primary-content'
                            "
                            class="prose chat-bubble min-w-[50%] prose-headings:text-current prose-a:text-current prose-blockquote:text-current prose-strong:text-current prose-li:marker:text-current"
                            v-html="renderMarkdown(message.content)"
                        />
                    </div>
                    <div v-if="loading && stream" class="chat chat-start">
                        <div
                            class="prose chat-bubble chat-bubble-secondary min-w-[50%] prose-headings:text-current prose-a:text-current prose-blockquote:text-current prose-strong:text-current prose-li:marker:text-current"
                            v-html="renderMarkdown(stream)"
                        />
                    </div>
                </div>
                <form class="sticky bottom-4" @submit.prevent="submit">
                    <div class="relative flex w-full">
                        <textarea
                            v-model="message"
                            @input="
                                resize($event.target as HTMLTextAreaElement)
                            "
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
                            :disabled="!!loading || !message"
                        >
                            <SendIconSvg class="h-6 fill-current" />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </Chat>
</template>

import type { Chat, Message, ObservableRef, Query } from "@/types/app";
import Dexie, {
    liveQuery,
    type DexieOptions,
    type Observable,
    type Subscription,
    type Table,
} from "dexie";
import { ref } from "vue";

export class Database extends Dexie {
    chats!: Table<Chat, number>;
    messages!: Table<Message, number>;

    constructor(databaseName: string, options?: DexieOptions) {
        super(databaseName, options);

        this.version(1).stores({
            chats: "++id, name, createdAt",
            messages: "++id, chatId, role, content, createdAt",
        });
    }

    async createChat(message: Message) {
        const createdAt = Date.now();
        const chatId = await this.chats.add({
            name: message.content,
            createdAt,
        });

        const messageId = await this.createMessage({ ...message, chatId });

        return { chatId, messageId };
    }

    async createMessage(message: Message) {
        const createdAt = Date.now();
        return await this.messages.add({
            ...message,
            createdAt,
        });
    }

    async getChat(chatId: number) {
        return await this.chats.get(chatId);
    }

    getChats(query?: Query<Chat, number> | undefined) {
        return liveQuery(() =>
            query ? query(this.chats) : this.chats.toArray(),
        );
    }
    getMessages(query?: Query<Message, number> | undefined) {
        return liveQuery(() =>
            query ? query(this.messages) : this.messages.toArray(),
        );
    }

    async deleteMessage(messageId: number) {
        if (!messageId) return;
        await this.messages.delete(messageId);
    }

    async deleteChat(chatId?: number) {
        if (!chatId) return;
        await this.chats.delete(chatId);
        await this.messages.where("chatId").equals(chatId).delete();
    }
}

export default new Database(import.meta.env.VITE_APP_NAME);

export function useObservable<T>(
    query: Observable<T>,
    initialValue?: T,
): ObservableRef<T> {
    const value = ref(initialValue as T) as ObservableRef<T>;
    let subscription: Subscription | undefined;

    value.update = (query: Observable) => {
        subscription?.unsubscribe();
        subscription = query.subscribe({
            next: (result) => (value.value = result),
        });
    };

    value.destroy = () => subscription?.unsubscribe();

    value.update(query);

    return value;
}

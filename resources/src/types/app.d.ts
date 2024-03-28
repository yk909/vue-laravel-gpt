import type { Ref } from 'vue';
import type { IndexableType, Observable, Table } from "dexie";

export interface Chat {
    id?: number;
    name: string;
    createdAt?: number;
}

export interface Message {
    id?: number;
    chatId?: number;
    role: string;
    content: string;
    createdAt?: number;
}

export interface ObservableRef<T> extends Ref<T> {
    update: (query: Observable) => void;
    destroy: () => void;
}

export type Query<T = any, TKey = IndexableType> = (
    query: Table<T, TKey>,
) => Promise<T[]> | T[];

export interface ChatLoading extends Promise<Response> {
    cancel: () => void;
}

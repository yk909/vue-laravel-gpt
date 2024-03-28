import type { ChatLoading, Message } from "@/types/app";
import swal from "sweetalert2";

export function chat(
    messages: Message[],
    pump: (res: string) => void,
): ChatLoading {
    const controller = new AbortController();

    const response = fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
            messages: messages.map(({ content, role }) => ({ content, role })),
        }),
        signal: controller.signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "text/plain, application/json",
            "X-CSRF-TOKEN":
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "",
        },
    })
        .then(async (res) => {
            if (res.ok)
                return res.body
                    ?.pipeThrough(new TextDecoderStream())
                    .getReader();
            throw new Error((await res.json())?.message || "Unknown error");
        })
        .then((reader) =>
            reader?.read().then(function _pump({ done, value }): any {
                if (controller.signal.aborted || done) return;

                pump(value);

                return reader.read().then(_pump);
            }),
        )
        .catch((err: Error) => {
            swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                width: "fit-content",
                timer: 5000,
                showConfirmButton: false,
                title: err?.message || err || "Unknown error",
            });

            throw err;
        }) as ChatLoading;

    response.cancel = () => controller.abort();

    return response;
}

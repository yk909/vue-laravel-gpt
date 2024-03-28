import MarkdownIt from "markdown-it";

export function resize(el: HTMLTextAreaElement, max: number = 300) {
    el.style.height = "auto";
    const height = el.scrollHeight > max ? max : el.scrollHeight;
    el.style.height = `${height}px`;
}

export function trunc(str: string, num: number) {
    return str.length > num ? str.slice(0, num - 1) + "..." : str;
}

export function renderMarkdown(str: string) {
    return new MarkdownIt().render(str);
}

export function setTheme(theme: string | null) {
    if (!theme) {
        localStorage.removeItem("theme");
        document.documentElement.removeAttribute("data-theme");
    } else {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }
}

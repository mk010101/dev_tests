let timer;
export function debounce(callback, delay) {
    clearTimeout(timer);
    timer = setTimeout(callback, delay);
}
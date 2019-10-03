window.addEventListener("resize", ()=> winResizeHandler());

function winResizeHandler() {
    document.body.height = window.innerHeight;
}
winResizeHandler();
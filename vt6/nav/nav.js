window.addEventListener("resize", () => winResizeHandler());

function winResizeHandler() {
    //document.body.height = window.innerHeight;
}

winResizeHandler();


let pages = [];
for (let i = 0; i < 10; i++) {
    let page = {
        title: "Page Title" + (i + 1),
        text: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>"
    };
    pages.push(page);
}



function getPage(idNum) {

    let str = "";

    let page = pages[idNum];
    str += `<h3>${page.title}</h3>
        <section class="page-content">
            <div><img src="../assets/1.jpg" alt="Hello world!"></div>
            <div>${page.text}</div>
        </section>
    `;

    let p = document.createElement("div");
    p.classList.add("page");
    p.innerHTML = str;
    return p;

}

let p = getPage(0);

document.querySelector(".pages-container").appendChild(p);


//-------------------------------------------------------------------------------------------


class Touch {

    constructor(target) {
        //console.log('ontouchstart' in window)

        //console.log("PointerEvent" in window)

        this.target = target;
        this.init();
    }

    init() {

        this.pointerDown = this.pointerDown.bind(this);

        //this.target.addEventListener("mousedown")
        this.target.addEventListener("pointerdown", this.pointerDown)
    }

    pointerDown(e) {
        console.log(e)
    }





}

new Touch(document.querySelector(".pages-container"));























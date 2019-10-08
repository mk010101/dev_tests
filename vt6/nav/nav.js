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
            <div><img src="../assets/1.jpg" alt="Hello world!" draggable="false"></div>
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
        this._x0 = 0;
        this._y0 = 0;
        this._dist = 10;
        this._isSwiping = false;
        this.init();
    }

    init() {

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);


        this.target.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);

        if ('ontouchstart' in window) {

            this.touchStart = this.touchStart.bind(this);
            this.touchMove = this.touchMove.bind(this);
            this.touchEnd = this.touchEnd.bind(this);

            this.target.addEventListener("touchstart", this.touchStart);
            window.addEventListener("touchend", this.touchEnd);

        }


    }


    mouseDown(e) {
        this._x0 = e.clientX - this.target.getBoundingClientRect().left;
        this._y0 = e.clientY;
        this.target.addEventListener("mousemove", this.mouseMove);
    }

    mouseMove(e) {
        let x = e.clientX - this._x0;
        //let y = e.clientY - this.y0;
        //console.log(x, y)
        this.target.style.transform = `translateX(${x}px)`;
    }


    mouseUp(e) {
        this.target.removeEventListener("mousemove", this.mouseMove);
    }


    touchStart(e) {
        if (e.touches.length > 1) return;
        this._x0 = e.touches[0].clientX - this.target.getBoundingClientRect().left;
        this._y0 = e.touches[0].clientY;
        this.target.addEventListener("touchmove", this.touchMove);
        //console.log(e)
    }

    touchMove(e) {

        if (e.touches.length > 1) return;

        let x = e.touches[0].clientX - this._x0;
        let y = e.touches[0].clientY - this._y0;

        if (! this._isSwiping) {

            let xa = Math.abs(x);
            let ya = Math.abs(y);

            if (ya > this._dist && ya > xa) {
                this.touchEnd(e);
            } else if (xa > this._dist && xa > ya) {
                this._isSwiping = true;
                console.log(Math.random())
            }
        } else {
            this.target.style.transform = `translateX(${x}px)`;
        }





        //
    }


    touchEnd(e) {
        this.target.removeEventListener("touchmove", this.touchMove);
        this._isSwiping = false;
    }


}

new Touch(document.querySelector(".pages-container"));























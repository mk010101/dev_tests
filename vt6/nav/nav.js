import {Shifter} from "./Shifter.js";



const pContainer = document.querySelector(".pages-container");
const gap = 50;

let currentPage;
let pages = [];



// data stub -----------------------------------------------------------------------------------------------------------

let pagesData = [];
for (let i = 0; i < 10; i++) {
    let page = {
        title: "Page Title: " + (i),
        image: {
            src: "../assets/1.jpg"
        },
        text: `<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
            a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, 
            but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in 
            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with 
            desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is 
            simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard 
            dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a 
            type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, 
            remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets 
            containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker 
            including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting 
            industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown 
            printer took a galley of type and scrambled it to make a type specimen book. It has survived not only 
            five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
            and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`
    };
    pagesData.push(page);
}

// ---------------------------------------------------------------------------------------------------------------------

class PagesViewer {

    constructor(dataArr) {

        this._livePages = [];
    }

    render(parent) {

    }

}



// Page ----------------------------------------------------------------------------------------------------------------

class Page {

    constructor(numId) {
        this.numId = numId;
        this._html = "";
        this._x = 0;
        this.init();
    }

    init() {
        let str = "";
        let pageData = pagesData[this.numId];
        str += `<div><h3>${pageData.title}</h3></div>
        <section class="page-content">
            <div class="media"><img src="../assets/1.jpg" alt="Hello world!"><div class="hotspot"></div></div>
            <div>${pageData.text}</div>
        </section>
    `;

        let p = document.createElement("div");
        p.setAttribute("data-id", this.numId);
        p.classList.add("page");
        p.innerHTML = str;
        this._html = p;
    }

    get html() {
        return this._html;
    }

    set x (valueNum) {
        this._x = valueNum;
        this._html.style.transform = `translateX(${valueNum}px)`;
    }

    get x () {
        return this._x;
    }

}

// ---------------------------------------------------------------------------------------------------------------------


let lastAdded = null;




function addPageNext() {

    let lastPage = pages[pages.length - 1];
    let id = parseInt(lastPage.position);
    let x = lastPage.html.getBoundingClientRect().right + gap - shifter.targetX;

    let newPage = new Page(id + 1);
    newPage.html.style.transform = `translateX(${x}px)`;
    pContainer.appendChild(newPage.html);
    pages.push(newPage);
}


let p = new Page(0);
pContainer.appendChild(p.html);
currentPage = p;
pages.push(p);




function addPage(numId) {

    let newPage = new Page(numId);

    if (lastAdded) {

    }


}

//addPageNext();


//-------------------------------------------------------------------------------------------



const shifter = new Shifter(pContainer, [Shifter.Func.PAN_X]);





function shiftStart() {



}




function setListeners() {

    shifter.on(Shifter.Events.PAN_X_START, ()=> shiftStart());

    shifter.on(Shifter.Events.START, (e) => {
        glide.remove(pContainer);
    });

    shifter.on(Shifter.Events.ENDZZZZ, () => {

        if (shifter.speedX < -5) {
            addPageNext();
            glide.to(pContainer, 300, {t: {x: shifter.targetX - pages[pages.length-1].html.getBoundingClientRect().left}}, {ease: glide.Ease.quadOut});
        } else if (shifter.speedX > 5) {
            glide.to(pContainer, 300, {t: {x: [shifter.targetX, 0]}}, {ease: glide.Ease.quadOut});
        }

    });

}

setListeners();




















import {Shifter} from "./Shifter.js";


// data stub -----------------------------------------------------------------------------------------------------------

let pagesData = [];
for (let i = 0; i < 10; i++) {
    let page = {
        numId: i,
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

// PagesViewer ---------------------------------------------------------------------------------------------------------

class PagesViewer {


    constructor(data) {

        this._html = null;
        this._pagesDataArr = data.pagesData;
        this._children = [];
        this._initPos = data.position;
        this._curretPage = null;

        this._shifter = null;

        this._gap = 0;

        let p = new Page(data.pagesData[data.position]);
        this._children.push(p);


        this._init();
    }


    _init() {
        //this._onPan = this._onPan.bind(this);
        this._onPanXEnd = this._onPanXEnd.bind(this);
    }

    render(parent) {
        this._html = parent;
        for (let i = 0; i < this._children.length; i++) {
            this._children[i].render(this._html);
        }

        this._setUpShifter();

        if (this._initPos < this._pagesDataArr.length) {
            this._addPageRight(this._initPos + 1);
        }

        if (this._initPos > 0) {
            this._addPageLeft(this._initPos - 1);
        }
    }

    addChild() {

    }


    _setUpShifter() {
        this._shifter = new Shifter(this._html, [Shifter.Func.PAN_X]);

        //this._shifter.on(Shifter.Evt.PAN_X_PROGRESS, this._onPan);
        this._shifter.on(Shifter.Evt.PAN_X_END, this._onPanXEnd);

    }

    _addPageRight(pageNumId) {
        let p = new Page(this._pagesDataArr[pageNumId]);
        p.x = this._html.getBoundingClientRect().right + this._gap;
        p.render(this._html);
        this._children.push(p);
    }

    _addPageLeft(pageNumId) {
        let p = new Page(this._pagesDataArr[pageNumId]);
        let rect = this._html.getBoundingClientRect();
        p.x = rect.left - this._gap - rect.width;
        p.render(this._html);
        this._children.push(p);
    }


    _onPan() {
        //console.log(this._html.getBoundingClientRect().right)
    }

    _onPanXEnd() {

        let speed = this._shifter.speedX;

        // User swipe slow ------
        if (Math.abs(speed) < 5) {
            let closestPage = this._children.reduce((prev, curr) => {
                return Math.abs(prev.boundsX) < Math.abs(curr.boundsX) ? prev : curr;
            });
            glide.to(this._html, 300, {t: {translateX: this._html.getBoundingClientRect().left - closestPage.boundsX}});
          // User swipe fast -----
        } else {

        }


        //console.log(closestPage)
    }


}


// Page ----------------------------------------------------------------------------------------------------------------

class Page {

    constructor(data) {
        this.numId = data.numId;
        this._data = data;
        this._html = "";
        this._x = 0;
        this._init();
    }

    _init() {

    }

    render(parent) {

        let str = "";

        str += `<div><h3>${this._data.title}</h3></div>
        <section class="page-content">
            <div class="media"><img src="../assets/1.jpg" alt="Hello world!"><div class="hotspot"></div></div>
            <div>${this._data.text}</div>
        </section>
    `;

        let p = document.createElement("div");
        p.setAttribute("data-id", this.numId);
        p.classList.add("page");
        p.innerHTML = str;
        this._html = p;
        this.x = this._x;
        parent.appendChild(p)
    }

    get html() {
        return this._html;
    }

    set x(valueNum) {
        this._x = valueNum;
        if (this._html) this._html.style.transform = `translateX(${valueNum}px)`;
    }

    get x() {
        return this._x;
    }

    get boundsX() {
        return this._html.getBoundingClientRect().left;
    }

}

// ---------------------------------------------------------------------------------------------------------------------

const pViewer = new PagesViewer({
    pagesData: pagesData,
    position: 2,
    parent: document.querySelector(".pages-container")
});
pViewer.render(document.querySelector(".pages-container"));


//-------------------------------------------------------------------------------------------


/*



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


 */




















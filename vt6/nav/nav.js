import {Shifter} from "./Shifter.js";


let pages = [];
for (let i = 0; i < 10; i++) {
    let page = {
        title: "Page Title: " + (i),
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
    pages.push(page);
}


const pContainer = document.querySelector(".pages-container");
const gap = 50;

let currentPage;
let elPagesArr = [];

const gest = new Shifter(pContainer, [Shifter.Funcs.PAN_X]);


function createPage(idNum) {

    let str = "";

    let page = pages[idNum];
    str += `<h3>${page.title}</h3>
        <section class="page-content">
            <div><img src="../assets/1.jpg" alt="Hello world!" draggable="false"></div>
            <div>${page.text}</div>
        </section>
    `;

    let p = document.createElement("div");
    p.setAttribute("data-id", idNum);
    p.classList.add("page");
    p.innerHTML = str;
    return p;
}


function $$insertPage(page) {


    let curId = parseInt(currentPage.getAttribute("data-id"));
    let newId = parseInt(page.getAttribute("data-id"));
    let bb = currentPage.getBoundingClientRect();

    if (newId > curId) {
        page.style.transform = `translateX(${bb.right + gap}px)`;
        pContainer.appendChild(page);
        elPagesArr.push(page)
    } else {
        let bb = pContainer.getBoundingClientRect();
        page.style.transform = `translateX(${bb.left - bb.width - gap}px)`;
        page.style.left = `${bb.left - bb.width - gap}px`;
        pContainer.appendChild(page);
        elPagesArr.push(page)
    }

    currentPage = page;

}


function addPageNext() {

    let lastPage = elPagesArr[elPagesArr.length - 1];
    let id = parseInt(lastPage.getAttribute("data-id"));
    let x = lastPage.getBoundingClientRect().right + gap;

    let newPage = createPage(id + 1);
    newPage.style.transform = `translateX(${x}px)`;
    pContainer.appendChild(newPage);
    elPagesArr.push(newPage);
}


let p = createPage(0);
pContainer.appendChild(p);
currentPage = p;
elPagesArr.push(p);

addPageNext();
addPageNext();
addPageNext();


//-------------------------------------------------------------------------------------------


function setListeners() {

    gest.on(Shifter.Events.PAN_X_START, (e) => {


    });

    gest.on(Shifter.Events.START, (e) => {
        //console.log(gest.targetX, panPages[1].getBoundingClientRect().left, window.innerWidth)
        if (0 < 1) {
            glide.remove(pContainer);
        }
    });

    gest.on(Shifter.Events.END, () => {

        if (gest.speedX < -5) {
            glide.to(pContainer, 400, {t: {x: gest.targetX - elPagesArr[1].getBoundingClientRect().left}}, {ease: glide.Ease.quadOut});
            //console.log(gest.targetX, panPages[1].getBoundingClientRect().left)
            //panStarted = false;
        } else if (gest.speedX > 5) {
            glide.to(pContainer, 400, {t: {x: [gest.targetX, 0]}}, {ease: glide.Ease.quadOut});
            //panStarted = false;
        }
    });
}

setListeners();




















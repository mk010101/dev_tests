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

const shifter = new Shifter(pContainer, [Shifter.Funcs.PAN_X]);


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




function addPageNext() {

    let lastPage = elPagesArr[elPagesArr.length - 1];
    let id = parseInt(lastPage.getAttribute("data-id"));
    let x = lastPage.getBoundingClientRect().right + gap - shifter.targetX;

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


//-------------------------------------------------------------------------------------------


function setListeners() {

    shifter.on(Shifter.Events.PAN_X_START, (e) => {


    });

    shifter.on(Shifter.Events.START, (e) => {
        glide.remove(pContainer);
    });

    shifter.on(Shifter.Events.END, () => {

        if (shifter.speedX < -5) {
            glide.to(pContainer, 300, {t: {x: shifter.targetX - elPagesArr[1].getBoundingClientRect().left}}, {ease: glide.Ease.quadOut});
            addPageNext();
        } else if (shifter.speedX > 5) {
            glide.to(pContainer, 300, {t: {x: [shifter.targetX, 0]}}, {ease: glide.Ease.quadOut});
        }
    });
}

setListeners();




















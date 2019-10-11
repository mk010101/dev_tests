import {Shifter} from "./Shifter.js";


let pages = [];
for (let i = 0; i < 10; i++) {
    let page = {
        title: "Page Title" + (i + 1),
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

let currentPage;
let panPages = [];


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
    p.setAttribute("data-id", idNum);
    p.classList.add("page");
    p.innerHTML = str;
    return p;
}


function insertPage(page) {

    let lastPage = panPages[panPages.length-1];

    let lastId =parseInt(lastPage.getAttribute("data-id"));
    let newId =parseInt(page.getAttribute("data-id"));
    if (newId > lastId) {
        let bb = lastPage.getBoundingClientRect();
        page.style.transform = `translateX(${bb.right + 50}px)`;
        //page.style.left = `${bb.right + 50}px`;
        pContainer.appendChild(page);
        panPages.push(page)
    }


}




let p = getPage(0);
pContainer.appendChild(p);
currentPage = p;
panPages.push(p);


insertPage(getPage(1));
insertPage(getPage(2));
insertPage(getPage(3));



//-------------------------------------------------------------------------------------------



const gest = new Shifter(pContainer, [Shifter.Funcs.PAN_X]);


gest.on(Shifter.Events.PAN_X_START, (e) => {
    //gest.remove();
});




















import {Dispatcher} from "../Dispatcher.js";
import {debounce} from "../helpers.js";

class Gestures extends Dispatcher {


    constructor(target, options) {

        super();

        this.options = options || {
            gestures: ["panX"]
        };


        this.target = target;
        this._x0 = 0;
        this._y0 = 0;
        this._speedX0 = 0;
        this._speedX = 0;
        this._speedY0 = 0;
        this._speedY = 0;
        this._detectPanDist = 10;
        this._isPanningX = false;
        this._gestures = [];
        this._targetBB = null;
        this._disabled = false;


        if (this.options.detectPanDist !== undefined) this._detectPanDist = this.options.detectPanDist;

        this.init();


    }

    init() {

        for (let i = 0; i < this.options.gestures.length; i++) {
            let g = this[this.options.gestures[i]];
            if (g) this._gestures.push(this.options.gestures[i]);

        }

        this.pointerDown = this.pointerDown.bind(this);
        this.pointerMove = this.pointerMove.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
        this.dispatchEnd = this.dispatchEnd.bind(this);


        this.target.addEventListener("mousedown", this.pointerDown);
        window.addEventListener("mouseup", this.pointerUp);

        if ('ontouchstart' in window) {

            this.target.addEventListener("touchstart", this.pointerDown);
            window.addEventListener("touchend", this.pointerUp);

        }

    }

    get speedX() {
        return this._speedX;
    }

    get speedY() {
        return this._speedY;
    }

    set disabled(bool) {
        this._disabled = bool;
    }


    pointerDown(e) {
        if (this._disabled) return;
        this._targetBB = this.target.getBoundingClientRect();

        let clientX, clientY;

        if (e.type.indexOf("touch") > -1) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;

        }

        this._speedX0 = clientX;
        this._speedY0 = clientY;

        this._x0 = clientX - this._targetBB.left;
        this._y0 = clientY - this._targetBB.top;

        this.target.addEventListener("mousemove", this.pointerMove);
        this.target.addEventListener("touchmove", this.pointerMove);
    }

    pointerMove(e) {
        if (this._disabled) return;
        let clientX, clientY;

        if (e.type.indexOf("touch") > -1) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        this._speedX = this._speedX0 - clientX;
        this._speedY = this._speedY0 - clientY;
        this._speedX0 = clientX;
        this._speedY0 = clientY;

        for (let i = 0; i < this._gestures.length; i++) {
            this[this._gestures[i]](e);
        }
    }


    pointerUp(e) {
        if (this._disabled) return;
        this.removeMoveListeners();
        document.querySelector(".page").classList.remove("no-scroll");
        //console.log(e)
        debounce(this.dispatchEnd, 100);
    }

    removeMoveListeners() {
        this.target.removeEventListener("mousemove", this.pointerMove);
        this.target.removeEventListener("touchmove", this.pointerMove);
        this._isPanningX = false;
    }

    dispatchEnd(e) {

    }


    panX(e) {
        let clientX, clientY;
        if (e.type === "touchmove") {
            if (e.touches.length > 1) {
                e.preventDefault();
                return;
            }
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }


        let x = clientX - this._x0;
        let y = clientY - this._y0 - this._targetBB.top;


        if (!this._isPanningX) {

            let xa = Math.abs(x);
            let ya = Math.abs(y);

            if (ya > this._detectPanDist && ya > xa) {
                this.removeMoveListeners();
            } else if (xa > this._detectPanDist && xa > ya) {
                this._isPanningX = true;
                document.querySelector(".page").classList.add("no-scroll");
                this.dispatch("panXStart", e);
            }
        } else {
            this.target.style.transform = `translateX(${x}px)`;
        }

    }


}

export {Gestures}
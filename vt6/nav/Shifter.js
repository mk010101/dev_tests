import {Dispatcher} from "../Dispatcher.js";
import {debounce} from "../helpers.js";


class Shifter extends Dispatcher {


    constructor(target, options) {

        super();

        this.options = options || {
            gestures: ["panX"]
        };


        this._target = target;
        this._gestures = [];
        this._disabled = false;

        // Target transforms -------------
        this._targetX = 0;
        this._targetY = 0;
        this._targetScale = 1;
        // -------------------------------


        this._pinchDist0 = 0;
        this._pinchSpeed = 0.025;

        this._speedX0 = 0;
        this._speedX = 0;
        this._speedY0 = 0;
        this._speedY = 0;

        this._panX0 = 0;
        this._panY0 = 0;
        this._detectPanDist = 10;
        this._isPanningX = false;

        // CSS
        this._cssNoScroll = "__Shifter__no-scroll_027345234523";



        if (this.options.detectPanDist !== undefined) this._detectPanDist = this.options.detectPanDist;

        this.init();


    }

    init() {

        for (let i = 0; i < this.options.gestures.length; i++) {
            let funcStr = this.options.gestures[i];
            if (this[funcStr]) {
                this._gestures.push(funcStr);
            }
        }

        this._pointerDown = this._pointerDown.bind(this);
        this._pointerMove = this._pointerMove.bind(this);
        this._pointerUp = this._pointerUp.bind(this);
        this._dispatchEnd = this._dispatchEnd.bind(this);


        this._target.addEventListener("mousedown", this._pointerDown);
        window.addEventListener("mouseup", this._pointerUp);

        if ('ontouchstart' in window) {

            this._target.addEventListener("touchstart", this._pointerDown);
            window.addEventListener("touchend", this._pointerUp);

        }

        let existingNoScroll = document.getElementById(this._cssNoScroll);
        if (! existingNoScroll) {
            let style = document.createElement('style');
            style.id = this._cssNoScroll;
            style.innerHTML = `.${this._cssNoScroll} * { overflow: hidden }`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }


    }

    get speedX() {
        return this._speedX;
    }

    get speedY() {
        return this._speedY;
    }


    get disabled() {
        return this._disabled;
    }

    set disabled(bool) {
        this._disabled = bool;
    }

    /* =================================================================================================================
        PRIVATE
     =================================================================================================================*/


    _pointerDown(e) {
        if (this._disabled) return;

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

        this._panX0 = clientX - this._targetX;
        this._panY0 = clientY - this._targetY;

        this._target.addEventListener("mousemove", this._pointerMove);
        this._target.addEventListener("touchmove", this._pointerMove);

        this.dispatch(Shifter.Events.START, e);

    }

    _pointerMove(e) {
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

        this.dispatch(Shifter.Events.MOVE, e);
    }


    _pointerUp(e) {
        if (this._disabled) return;
        this._removeMoveListeners();
        this._target.classList.remove(this._cssNoScroll);
        debounce(this._dispatchEnd, 100);
    }

    _removeMoveListeners() {
        this._target.removeEventListener("mousemove", this._pointerMove);
        this._target.removeEventListener("touchmove", this._pointerMove);
        this._isPanningX = false;
    }

    _dispatchEnd(e) {
        this.dispatch(Shifter.Events.END, null);
    }


    /* =================================================================================================================
           MANIPULATORS
     =================================================================================================================*/

    /**
     * Pans target on x-Axes. Uses transform.
     * @param e {Event} Event (touch or mouse)
     */
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


        let x = clientX - this._panX0;
        let y = clientY - this._panY0;


        if (!this._isPanningX) {

            let xa = Math.abs(x);
            let ya = Math.abs(y);

            if (ya > this._detectPanDist && ya > xa) {
                this._removeMoveListeners();
            } else if (xa > this._detectPanDist && xa > ya) {
                this._isPanningX = true;
                //document.querySelector(".page").classList.add("no-scroll");
                this._target.classList.add(this._cssNoScroll);
                this.dispatch(Shifter.Events.PAN_X_START, e);
            }
        } else {
            this._targetX = x;
            this._applyTransforms();
            this.dispatch(Shifter.Events.PAN_X_PROGRESS, e);
        }

    }

    pan(e) {
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


        let x = clientX - this._panX0;
        let y = clientY - this._panY0;

        this._targetX = x;
        this._targetY = y;
        this._applyTransforms();

    }

    scale(e) {

        if (e.type.indexOf("touch") > -1 && e.touches.length === 2) {
            let x0 = e.touches[0].clientX;
            let x1 = e.touches[1].clientX;
            let y0 = e.touches[0].clientY;
            let y1 = e.touches[1].clientY;
            let dist = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));

            if (dist > this._pinchDist0) {
                this._targetScale += this._pinchSpeed;
            } else if (dist < this._pinchDist0) {
                this._targetScale -= this._pinchSpeed;
            }
            this._pinchDist0 = dist;
            this._applyTransforms();
        }

    }


    _applyTransforms() {
        this._target.style.transform = `
        translate(${this._targetX}px, ${this._targetY}px) 
        scale(${this._targetScale}, ${this._targetScale})`;
    }


}

Shifter.Funcs = {
    PAN_X: "panX",
    PAN: "pan",
    SCALE: "scale"

};

Shifter.Events = {
    PAN_X_START: "panXStart",
    PAN_X_PROGRESS: "panXProgress",
    PAN_START: "panStart",
    PAN_PROGRESS: "panProgress",
    START: "start",
    MOVE: "move",
    END: "end",
};

Object.freeze(Shifter.Events);
Object.freeze(Shifter.Funcs);

export {Shifter}
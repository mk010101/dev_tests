import {Dispatcher} from "../Dispatcher.js";


class Shifter extends Dispatcher {


    constructor(target, funcs) {

        super();


        this._target = target;
        this._gestures = [];
        this._disabled = false;

        // Target transforms -------------
        this._targetX = 0;
        this._targetY = 0;
        this._targetScale = 1;
        // -------------------------------


        this._pinchDist0 = 0;
        this._zoomSpeed = 0.025;
        this._minZoom = .5;
        this._maxZoom = 2;

        this._speedX0 = 0;
        this._speedX = 0;
        this._speedY0 = 0;
        this._speedY = 0;

        this._panX0 = 0;
        this._panY0 = 0;
        this._detectPanDist = 10;
        this._isPanningX = false;

        // CSS
        this._cssNoScroll = "__Shifter__no-scroll_2019-15";


        this.init(funcs);


    }

    init(funcs) {

        for (let i = 0; i < funcs.length; i++) {
            let funcStr = funcs[i];
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

        this._addCSS();

        //*
        //this._target.setAttribute("draggable", "false");
        this._target.addEventListener("pointerup", (e)=> {
            console.log(e)
        })
         //*/
    }


    get speedX() {
        return this._speedX;
    }

    get speedY() {
        return this._speedY;
    }

    get targetX() {
        return this._targetX;
    }

    get targetY() {
        return this._targetY;
    }

    get targetScale() {
        return this._targetScale
            ;
    }


    get disabled() {
        return this._disabled;
    }

    set disabled(bool) {
        this._disabled = bool;
    }

    set minZoom(value) {
        this._minZoom = value;
    }

    set maxZoom(value) {
        this._maxZoom = value;
    }

    set zoomSpeed(value) {
        this._zoomSpeed = value;
    }

    remove(keepCSS = true) {
        this._target.removeEventListener("mousemove", this._pointerMove);
        this._target.removeEventListener("touchmove", this._pointerMove);
        this._target.removeEventListener("mousedown", this._pointerDown);
        this._target.removeEventListener("touchstart", this._pointerDown);
        window.removeEventListener("mouseup", this._pointerUp);
        window.removeEventListener("touchend", this._pointerUp);
        this._target.classList.remove(this._cssNoScroll);
        this._target = null;
        this.offAll();
        if (!keepCSS) this._removeCSS();
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

        this._getTransforms();

        //this._speedX = 0;
        //this._speedY = 0;

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

        this._speedX =  clientX - this._speedX0;
        this._speedY =  clientY - this._speedY0;
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
        //debounce(this._dispatchEnd, 5);
        this._dispatchEnd(e);
    }

    _removeMoveListeners() {
        this._target.removeEventListener("mousemove", this._pointerMove);
        this._target.removeEventListener("touchmove", this._pointerMove);
        this._isPanningX = false;
    }

    _dispatchEnd(e) {
        this.dispatch(Shifter.Events.END, null);
    }

    _getTransforms() {
        let str = this._target.style.transform;
        let arr = str.split(/\s+/gmi);
        for (let i = 0; i < arr.length; i++) {
            let m = arr[i].match(/([a-z]+)|([0-9-.]+)/gim);
            if (m) {
                if (m[0] === "scaleX") this._targetScale = parseFloat(m[1]);
                if (m[0] === "translateX") this._targetX = parseFloat(m[1]);
                if (m[0] === "translateY") this._targetY = parseFloat(m[1]);
                //console.log(m)
            }
        }
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
            //console.log(clientX, this._panX0)
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

    zoom(e) {

        if (e.type.indexOf("touch") > -1 && e.touches.length === 2) {
            let x0 = e.touches[0].clientX;
            let x1 = e.touches[1].clientX;
            let y0 = e.touches[0].clientY;
            let y1 = e.touches[1].clientY;
            let dist = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
            //let hyp = Math.hypot((x0 - x1), (y0 - y1));
            //console.log(dist, hyp)

            if (dist > this._pinchDist0 && this._targetScale <= this._maxZoom) {
                this._targetScale += this._zoomSpeed;
            } else if (dist < this._pinchDist0 && this._targetScale >= this._minZoom) {
                this._targetScale -= this._zoomSpeed;
            }
            this._pinchDist0 = dist;
            this._applyTransforms();
        }

    }


    _applyTransforms() {
        this._target.style.transform = `
        translatex(${this._targetX}px) translateY(${this._targetY}px) 
        scaleX(${this._targetScale}) scaleY(${this._targetScale})`;
    }


    _addCSS() {

        let existingNoScroll = document.getElementById(this._cssNoScroll);
        if (!existingNoScroll) {
            let style = document.createElement('style');
            style.id = this._cssNoScroll;
            style.innerHTML = `.${this._cssNoScroll} * { overflow: hidden }`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    _removeCSS() {

        let existingNoScroll = document.getElementById(this._cssNoScroll);
        if (existingNoScroll) {
            document.getElementsByTagName('head')[0].removeChild(existingNoScroll);
        }
    }


}

Shifter.Funcs = {
    PAN_X: "panX",
    PAN: "pan",
    ZOOM: "zoom"

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
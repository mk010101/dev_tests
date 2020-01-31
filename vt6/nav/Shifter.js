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

        this._isPassiveEvt = true;

        this._pointers = [];


        // CSS
        this._cssNoScroll = "__Shifter__no-scroll_2019-15";


        this._init(funcs);


    }

    _init(funcs) {

        for (let i = 0; i < funcs.length; i++) {
            let funcStr = funcs[i];
            if (this[funcStr]) {
                this._gestures.push(funcStr);
            }
        }


        if ("PointerEvent" in window) {

            this._down = this._down.bind(this);
            this._move = this._move.bind(this);
            this._up = this._up.bind(this);
            this._dispatchEnd = this._dispatchEnd.bind(this);

            this._target.addEventListener("pointerdown", this._down);
            window.addEventListener("pointerup", this._up);

        } else if ("ontouchstart" in window) {

            //this._touchDown = this._touchDown.bind(this);
            //this._target.addEventListener("touchstart", this._touchDown);

        }




        this._addCSS();

    }



    _touchDown(e) {

    }

    _touchMove(e) {

    }

    _touchUp(e) {

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

    updateTransforms() {
        this._getTransforms();
    }

    remove(keepCSS = true) {

        this._target.removeEventListener("pointermove", this._move);
        this._target.removeEventListener("pointerdown", this._down);
        window.removeEventListener("pointerup", this._up);
        this._unlockScroll();
        this._target = null;
        this.offAll();

        if (!keepCSS) this._removeCSS();

    }

    /* =================================================================================================================
        PRIVATE
     =================================================================================================================*/


    _down(e) {

        // console.log(e.timeStamp - this._lastEvtDown)

        this._speedX = 0;
        this._speedY = 0;

        if (this._disabled) return;

        let clientX = e.clientX;
        let clientY = e.clientY;

        this._getTransforms();

        this._speedX0 = clientX;
        this._speedY0 = clientY;

        this._panX0 = clientX - this._targetX;
        this._panY0 = clientY - this._targetY;

        this._target.setPointerCapture(e.pointerId);
        this._pointers.push(e);

        this._target.addEventListener("pointermove", this._move, {passive: this._isPassiveEvt});

        this.dispatch(Shifter.Events.START, e);

    }

    _move(e) {
        if (this._disabled) return;


        let clientX = e.clientX;
        let clientY = e.clientY;

        this._speedX = clientX - this._speedX0;
        this._speedY = clientY - this._speedY0;
        this._speedX0 = clientX;
        this._speedY0 = clientY;

        for (let i = 0; i < this._gestures.length; i++) {
            this[this._gestures[i]](e);
        }

        this.dispatch(Shifter.Events.MOVE, e);
    }


    _up(e) {
        if (this._disabled) return;

        for (let i = this._pointers.length - 1; i >= 0; i--) {
            if (e.pointerId === this._pointers[i].pointerId) {
                this._pointers.splice(i, 1);
            }
        }

        this._removeMoveListeners();
        this._unlockScroll();
        this._dispatchEnd(e);

    }

    _removeMoveListeners() {
        this._target.removeEventListener("pointermove", this._move);
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

        if (this._pointers.length > 1) {
            //e.preventDefault();
            //return;
        }

        let x = e.clientX - this._panX0;
        let y = e.clientY - this._panY0;


        if (!this._isPanningX) {

            let xa = Math.abs(x - this._targetX);
            let ya = Math.abs(y);

            if (ya > this._detectPanDist && ya > xa) {
                this._removeMoveListeners();
            } else if (xa > this._detectPanDist && xa > ya) {
                this._isPanningX = true;
                this._lockScroll();
                this.dispatch(Shifter.Events.PAN_X_START, e);
            }
        } else {
            this._targetX = x;
            //console.log(clientX, this._panX0)
            this._applyTransforms();
            this.dispatch(Shifter.Events.PAN_X_PROGRESS, e);
        }

    }

    /**
     * Pans target on x- and y- Axes. Uses transform.
     * @param e {Event} Event (touch or mouse)
     */
    pan(e) {

        if (this._pointers.length > 1) {
            e.preventDefault();
            return;
        }


        let x = e.clientX - this._panX0;
        let y = e.clientY - this._panY0;

        this._targetX = x;
        this._targetY = y;
        this._applyTransforms();

    }

    /**
     * Zooms target. Uses transform.
     * @param e {Event} Event (touch or mouse)
     */
    zoom(e) {

        if (this._pointers.length === 2) {

            for (let i = 0; i < this._pointers.length; i++) {
                if (e.pointerId === this._pointers[i].pointerId) {
                    this._pointers[i] = e;
                    break;
                }
            }

            let x0 = this._pointers[0].clientX;
            let x1 = this._pointers[1].clientX;
            let y0 = this._pointers[0].clientY;
            let y1 = this._pointers[1].clientY;
            let dist = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));

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
            style.innerHTML = `.${this._cssNoScroll} * { overflow: hidden; }`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    _removeCSS() {

        let existingNoScroll = document.getElementById(this._cssNoScroll);
        if (existingNoScroll) {
            document.getElementsByTagName('head')[0].removeChild(existingNoScroll);
        }
    }

    _lockScroll() {
        this._target.classList.add(this._cssNoScroll);
    }

    _unlockScroll() {
        this._target.classList.remove(this._cssNoScroll);
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
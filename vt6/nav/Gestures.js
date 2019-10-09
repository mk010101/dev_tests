class Gestures {



    constructor(target, options) {

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
        this.target.addEventListener("touchmove", this.touchMove, {passive: false});
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
                document.querySelector(".page").classList.add("no-scroll");
            }
        } else {
            this.target.style.transform = `translateX(${x}px)`;
        }





        //
    }


    touchEnd(e) {
        document.querySelector(".page").classList.remove("no-scroll");
        this.target.removeEventListener("touchmove", this.touchMove);
        this._isSwiping = false;
    }


}

export {Gestures}
class Dispatcher {

    constructor() {
        this._listeners = {};
    }




    on(evtName, listener, scope = null) {

        if (! this._listeners[evtName]) this._listeners[evtName] = [];
        if (this._listeners[evtName].indexOf(listener) === -1) {
            this._listeners[evtName].push(listener);
            if (scope) {
                listener = listener.bind(scope);
            }
        }
        return this;
    }

    off(evtName, listener) {

        if (this._listeners[evtName]) {
            let index = this._listeners[evtName].indexOf(evtName);
            if (index > -1) this._listeners[evtName] = this._listeners[evtName].splice(index, 1);
        }
        return this;
    }

    dispatch(evtName, data) {

        if (!this._listeners[evtName]) return;

        for (let i = 0; i < this._listeners[evtName].length; i++) {
            this._listeners[evtName][i](data);
        }

    }

}

export {Dispatcher};
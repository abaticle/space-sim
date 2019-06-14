
export default class Observable {
    constructor() {
        this.observers = [];
    }

    /**
     * Subscribe to function
     * @param {function} f Function to add
     */
    subscribe(f) {
        this.observers.push(f);
    }

    /**
     * Remove a subscribed function
     * @param {function} f Function to remove
     */
    unsubscribe(f) {
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    /**
     * Notify / Send event
     * @param {string} event 
     * @param {object} data 
     */
    notify(event, data) {
        this.observers.forEach(observer => observer(event, data));
    }
}
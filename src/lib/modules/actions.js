export default class ActionsManager {

    constructor() {
        this.actions = [];
    }

    addAction(action, payload = {}) {
        this.actions.push({
            action,
            payload
        })
    }

    /**
     * 
     * @param {number|string} index 
     */
    removeAction(index) {
        if (typeof index === "number") {
            this.actions.splice(index, 1);
        }

        else {
            this.actions = this.actions.filter(({action}) => action !== index);
        }
        
    }

    getActions() {
        return this.actions;
    }
}
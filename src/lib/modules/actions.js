export default class ActionsManager {

    constructor() {
        this.actions = [];
    }

    /** 
     * Add an action
     * @param {string} action Action name
     * @param {object} payload Action payload
     */
    addAction(action, payload = {}) {
        this.actions.push({
            action,
            payload
        })
    }

    /**
     * Remove actions
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
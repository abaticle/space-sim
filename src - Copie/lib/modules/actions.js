export default class ActionsManager {

    constructor() {
        this.actions = [];
    }

    addAction(action, payload = {}) {
        this.validateAction(action);

        this.actions.push({
            action,
            payload
        })
    }

    removeAction(index) {
        if (typeof index === "number") {
            this.actions.splice(index, 1);
        }

        else {
            this.actions = this.actions.filter(({action}) => action !== index);
        }
        
    }


    validateAction(action) {
        switch (action) {
            case "displayPanel":
            case "removePanel":
                return true;

            default:
                throw new Error(`Action ${action} unknown`);
        }
    }


    getActions() {
        return this.actions;
    }
}
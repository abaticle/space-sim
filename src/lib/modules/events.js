export default class Event {

    constructor() {
        this.events = [];
    }

    static displayBuilding(id) {
        return {
            event: "displayBuilding", 
            payload: {
                id
            }
        }
    }

}
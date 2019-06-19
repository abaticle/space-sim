import { debug as debugStore } from "./../ui/stores"




export default class DebugSystem {
    
    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions
    }

    init() {

    }



    update(dt) {

        debugStore.set({
            data: [{
                name: "action",
                value: JSON.stringify(this.actions.getActions())
            }, {
                name: "Earth X",
                value: this.ecs.get(3, "position").x
            }, {
                name: "Earth Y",
                value: this.ecs.get(3, "position").y
            }]
        })

    }
}
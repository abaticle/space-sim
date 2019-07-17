import { debug as debugStore } from "./../ui/stores"
import { getAngleAsDegree } from "../modules/vector";




export default class DebugSystem {
    
    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions

        this.spaceship = null
    }

    init() {

    }



    update(dt) {

        if (this.spaceship === null) {

            const [id] = this.ecs.searchEntities(["position", "velocity"]);

            this.spaceship = this.ecs.get(id)
        }

        debugStore.set({
            data: [{
                name: "action",
                value: JSON.stringify(this.actions.getActions())
            }]
        })

    }
}
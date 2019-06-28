import { debug as debugStore } from "./../ui/stores"
import { getAngleAsDegree } from "../modules/vector";




export default class DebugSystem {
    
    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions

        this.spaceship = undefined
    }

    init() {

    }



    update(dt) {

        if (this.spaceship === undefined) {

            const [id] = this.ecs.searchEntities(["position", "vector"]);

            this.spaceship = this.ecs.get(id)
        }

        debugStore.set({
            data: [{
                name: "action",
                value: JSON.stringify(this.actions.getActions())
            }, {
                name: "mouse x",
                value: window.mouseX
            }, {
                name: "mouse y",
                value: window.mouseY
            }, {
                name: "ship x",
                value: this.spaceship.position.x || 0
            }, {
                name: "angle",
                value: getAngleAsDegree(this.spaceship.vector)
            }
                
            /*, {
                name: "spaceshipState",
                value: JSON.stringify(this.spaceshipState)   
            }, {
                name: "spaceship.stateIndex",
                value: this.spaceship.stateIndex
            }, {
                name: "orders",
                value: JSON.stringify(this.spaceship.states)
            }*/]
        })

    }
}
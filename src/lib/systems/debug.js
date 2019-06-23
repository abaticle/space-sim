import { debug as debugStore } from "./../ui/stores"




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

            const id = this.ecs.searchEntities("spaceshipState")[0];

            this.spaceshipState = this.ecs.get(id, "spaceshipState")
            this.spaceship = this.ecs.get(id, "spaceship")
        }

        debugStore.set({
            data: [{
                name: "action",
                value: JSON.stringify(this.actions.getActions())
            }/*, {
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
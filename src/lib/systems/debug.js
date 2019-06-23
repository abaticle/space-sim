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
            }/*, {
                name: "Earth speed",
                value: this.ecs.get(3, "planet", "speed")
            },{
                name: "Spaceship pos",
                value: JSON.stringify(this.ecs.get(9).position)
            }, {
                name: "Spaceship state",
                value: JSON.stringify(this.ecs.get(9).spaceshipState)
            }*/]
        })

    }
}
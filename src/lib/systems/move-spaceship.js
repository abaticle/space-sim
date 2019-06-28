import Tools from "./../modules/tools"
import {
    add,
    substract,
    normalize,
    scale
} from "./../modules/vector"
import constants from "../data/constants";
import EntityManager from "../modules/entity-manager";
import {
    vector
} from "../components/position";


export default class MoveSpaceshipSystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;
    }

    init() {

    }


    /**
     * Move spaceship around an entity
     *  - spaceshipState.orbitAround
     * @param {object} spaceshipState 
     * @param {number} spaceshipState.orbitAround Center of orbit
     * @param {object} position 
     */
    spaceshipOrbit(spaceshipState, position, dt) {

        const planetPos = this.ecs.get(spaceshipState.orbitAround, "position")

        const rotation = Tools.rotate(planetPos, position, dt * constants.spaceshipOrbitRotationSpeed)

        position.x = rotation.x
        position.y = rotation.y

    }


    /**
     * Get current state
     * @param {object} spaceship Spaceship component
     */
    getCurrentState(spaceship) {
        return spaceship.states[spaceship.stateIndex]
    }

    /**
     * Increment stateIndex, update states array if in repeat mode, and return new state
     * @param {object} spaceship Spaceship component
     * @param {object} spaceshipState Spaceship state component
     * @returns {object|undefined} New state or undefined
     */
    updateNextState(spaceship, spaceshipState) {

        //With repeat 
        if (spaceship.stateRepeat) {

            //Update index
            spaceship.stateIndex++

            if (spaceship.stateIndex >= spaceship.states.length) {
                spaceship.stateIndex = 0
            }
        }

        //Without repeat, no need to update the index
        else {
            spaceship.states.shift()
        }

        const newState = spaceship.states[spaceship.stateIndex];

        if (newState) {
            if (newState.payload) {
                for (let key in newState.payload) {
                    spaceshipState[key] = newState.payload[key]
                }
            }
        }
    }


    /**
     * Move a spaceship toward an entity at ship speed
     * - spaceshipState.moveTo
     * @param {object} spaceshipState 
     * @param {number} spaceshipState.moveTo Target entity
     * @param {object} position 
     * @param {object} spaceship 
     * @param {number} dt 
     */
    spaceshipMove(spaceshipState, position, spaceship, dt) {


        const targetPosition = this.ecs.get(spaceshipState.moveTo, "position");

        const nextPosition = Tools.moveToward(position, targetPosition, spaceship.speed * dt * constants.spaceshipSpeedModifier);

        position.x = nextPosition.x
        position.y = nextPosition.y
        position.angle = nextPosition.angle

        switch (true) {

            //Target is a planet 
            case this.ecs.has(spaceshipState.moveTo, "planet"):

                //Set a distance for orbit
                const maxDistance = this.ecs.get(spaceshipState.moveTo, "planet", "size")

                //And planet is near 
                if (Tools.distance(position, targetPosition) <= maxDistance) {
                    this.updateNextState(spaceship, spaceshipState)
                }


                //Target is a ship
                case this.ecs.has(spaceshipState.moveTo, "spaceship"):
                    //TODO:Ship target move spaceship
                    break;


                    //Target is a position
                case typeof spaceshipState.moveTo === "object":
                    //TODO:Ship target move position
                    break;

                default:
                    throw new Error(`${spaceshipState.moveTo} is not a valid target`)

        }

        /*
        if (this.ecs.has(spaceshipState.moveTo, "planet")) {

            //Set a distance for orbit
            const maxDistance = this.ecs.get(spaceshipState.moveTo, "planet", "size") * 3

            //And planet is near 
            if (Tools.distance(position, targetPosition) <= maxDistance) {
                this.updateNextState(spaceship, spaceshipState)
            }
        } else {

        }*/
    }

    spaceshipGive(spaceshipState, spaceship, dt) {

        spaceshipState.giveCurrentTime += dt

        if (spaceshipState.giveCurrentTime >= spaceshipState.giveTime) {

            spaceshipState.giveCurrentTime = 0;

            //Target items
            const planet = this.ecs.get(spaceshipState.giveTo, "planet")

            for (let item in spaceshipState.giveItems) {

                if (spaceship.items[item]) {
                    const maxToGive = spaceship.items[item] <= spaceshipState.giveItems[item] ?
                        spaceship.items[item] :
                        spaceshipState.giveItems[item]

                    EntityManager.transferItem(spaceship, planet, item, maxToGive)

                }

            }

            this.updateNextState(spaceship, spaceshipState)
        }

    }

    spaceshipTake(spaceshipState, spaceship, dt) {

        spaceshipState.takeCurrentTime += dt


        if (spaceshipState.takeCurrentTime >= spaceshipState.takeTime) {

            spaceshipState.takeCurrentTime = 0;

            //Target items
            const planet = this.ecs.get(spaceshipState.takeFrom, "planet")

            //Transfer items to ship
            for (let item in spaceshipState.takeItems) {

                if (planet.items[item]) {
                    const maxToGive = planet.items[item] >= spaceshipState.takeItems[item] ?
                        spaceshipState.takeItems[item] :
                        planet.items[item]

                    EntityManager.transferItem(planet, spaceship, item, maxToGive)
                    /*if (planet.items[item] >= spaceshipState.takeItems[item]) {
                        EntityManager.transferItem(planet, spaceship, item, maxToGive)
                    }*/
                }
            }

            this.updateNextState(spaceship, spaceshipState)
        } else {
            //Wait in orbit
        }
    }

    spaceshipRefuel() {

    }

    /**
     * Move all spaceships
     * @param {number} dt Time difference
     */
    moveSpaceships(dt) {

        let spaceships = this.ecs.searchEntities(["spaceship", "position", "spaceshipState"])

        spaceships.forEach(id => {
            const {
                spaceship,
                position,
                spaceshipState
            } = this.ecs.get(id)

            switch (this.getCurrentState(spaceship).state) {
                case "orbit":
                    this.spaceshipOrbit(spaceshipState, position, dt)
                    break

                case "move":
                    this.spaceshipMove(spaceshipState, position, spaceship, dt)
                    break

                case "take":
                    this.spaceshipTake(spaceshipState, spaceship, dt)
                    break

                case "refuel":
                    this.spaceshipRefuel()
                    break

                case "give":
                    this.spaceshipGive(spaceshipState, spaceship, dt)
                    break
            }

        })


    }

    moveVectors(dt) {
        if (this._tick === undefined) {
            this._tick = 0
        } else {
            this._tick += 1
        }
        const vectors = this.ecs.searchEntities(["vector", "position"])




        vectors.forEach(id => {

            const {
                vector,
                position
            } = this.ecs.get(id)

            const speed = 2;

            //const nextPosition = add(position, scale(normalize(vector), speed)) 

            //position.x = nextPosition.x
            //position.y = nextPosition.y



            const target = {
                x: window.mouseX,
                y: window.mouseY
            }

            
            const velocity = scale(normalize(substract(target, position)), speed)

            vector.x = velocity.x
            vector.y = velocity.y


            const nextPosition = add(position, velocity);
            position.x = nextPosition.x
            position.y = nextPosition.y



            //const desiredVelocity = normalize(substract(target, position))

            //const steering = substract(desiredVelocity, velocity)

            
            /*if (this._tick > 60) {
                this._tick = 0
                vector.x = Tools.random(-1, 1)
                vector.y = Tools.random(-1, 1)
            }*/

        })

    }


    update(dt) {
        this.moveSpaceships(dt);

        //TODO:Tests move vectors
        this.moveVectors(dt)
    }



}
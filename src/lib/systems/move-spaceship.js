import Tools from "./../modules/tools"
import {
    add,
    substract,
    normalize,
    multiply,
    divide,
    truncate,
    magnitude
} from "./../modules/vector"
import constants from "../data/constants";
import EntityManager from "../modules/entity-manager";


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

    seek() {
        
    }

    moveVectors(dt) {
        
        const vectors = this.ecs.searchEntities(["velocity", "position"])

        vectors.forEach(id => {

            const maxVelocity = dt * 500    
            const maxForce = 5
            const mass = 5
            const slowingRadius = 15 * mass

            const {
                velocity,
                position
            } = this.ecs.get(id)

            const target = {
                x: window.mouseX || 500,
                y: window.mouseY || 500
            }

            
            let desiredVelocity = substract(target, position)
            const distance = magnitude(desiredVelocity)

            if (distance < slowingRadius) {
                desiredVelocity = multiply(multiply(normalize(desiredVelocity), maxVelocity), (distance / slowingRadius))
            } else {
                desiredVelocity = multiply(normalize(desiredVelocity), maxVelocity)    
            }           

            let steering = substract(desiredVelocity, velocity)

            steering = truncate(steering, maxForce)
            steering = divide(steering, mass)


            //New velocity
            const tmp = truncate(add(velocity, steering), maxVelocity)

            velocity.x = tmp.x
            velocity.y = tmp.y


            //New position
            const tmp2 = add(position, velocity)

            position.x = tmp2.x
            position.y = tmp2.y


        })

    }


    update(dt) {
        this.moveSpaceships(dt);

        //TODO:Tests move vectors
        this.moveVectors(dt)
    }



}
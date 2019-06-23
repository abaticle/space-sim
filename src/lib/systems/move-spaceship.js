
import Tools from "./../modules/tools"
import constants from "../data/constants";


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
     * @returns {object|undefined} New state or undefined
     */
    getNextState(spaceship) {

        //Update index, and put first element at end
        if (spaceship.stateRepeat) {

            const state = spaceship.states.shift()
            spaceship.states.push(state)

            spaceship.stateIndex++

            if (spaceship.stateIndex >= spaceship.states.length) {
                spaceship.stateIndex = 0
            }
        }

        //Remove first element, no need to update index
        else {
            spaceship.states.shift()        
        }

        //Return first state
        return spaceship.states[0]

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


        //If target is a planet :
        if (this.ecs.has(spaceshipState.moveTo, "planet")) {

            //Set a distance for orbit
            const maxDistance = this.ecs.get(spaceshipState.moveTo, "planet", "size") * 3

            //And planet is near 
            if (Tools.distance(position, targetPosition) <= maxDistance) {

                //Next state
                const newState = this.getNextState(spaceship);

                
                spaceshipState.moveTo = newState.moveTo
            }


        } else {



        }
    }

    spaceshipDeposit() {

    }

    spaceshipTake() {

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

            switch(this.getCurrentState(spaceship).state) {
                case "orbit":
                    this.spaceshipOrbit(spaceshipState, position, dt)
                    break
    
                case "move":
                    this.spaceshipMove(spaceshipState, position, spaceship, dt)
                    break
    
                case "take":
                    this.spaceshipTake()
                    break

                case "refuel":
                    this.spaceshipRefuel()
                    break
    
                case "deposit":
                    this.spaceshipTransfer()
                    break
            }

        })

        
    }


    update(dt) {
        this.moveSpaceships(dt);
    }



}

export default class MoveSpaceshipSystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;
        
        this.planets = [];
    }

    init() {

    }


    stateOrbit() {

    }

    stateMove() {

    }

    stateTransfer() {

    }

    stateAttack() {

    }


    /**
     * Move a spaceship
     * @param {number} id Spaceship id
     * @param {number} dt Time difference
     */
    moveSpaceship(id, dt) {

        const {
            spaceship,
            position,
            spaceshipState
        } = this.ecs.get(id);

        switch(spaceshipState.state) {
            case "orbit":
                //Get planet pos
                const planetPosition = this.ecs.get(spaceshipState.orbitAround, "position")

                position.x = planetPosition.x
                position.y = planetPosition.y
                break;

            case "move":
                const targetPosition = this.ecs.get(spaceshipState.moveTo, "position");

                const nextPosition = Tools.moveToward(position, targetPosition, spaceship.speed * dt);

                this.ecs.set(nextPosition, id, "position");

                break;

            case "stop":
                
                break;

            case "transfer":
                break;
        }
    }

    /**
     * Move all spaceships
     * @param {number} dt Time difference
     */
    moveSpaceships(dt) {

        let spaceships = this.ecs.searchEntities(["spaceship", "position", "spaceshipState"]);

        spaceships.forEach(id => {
            this.moveSpaceship(id, dt);
        })
    }


    update(dt) {
        this.moveSpaceships(dt);
    }



}
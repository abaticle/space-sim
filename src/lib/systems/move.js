export default class MoveSystem {

    constructor(ecs) {
        this.ecs = ecs;
    }

    init() {
        
    }

    rotate(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    movePlanet(id) {
        let { position, planet } = this.ecs.get(id);

        let parentPos = this.ecs.get(planet.parentId, "position");

        let r = this.rotate(parentPos.x, parentPos.y, position.x, position.y, 0.8)
        position.x = r[0]
        position.y = r[1]

        return r;
    }

    update(dt) {

        let planets = this.ecs.searchEntities(["planet", "position"]);


        //Move earth 
        //this.movePlanet(1)

        //Move moon
        this.movePlanet(9)


        
        /*planets.forEach(planetId => {

            let { position, planet } = this.ecs.get(planetId);

            if (planet.parent !== undefined) {
                let parentPos = this.ecs.get(planet.parent, "position");

                let r = this.rotate(parentPos.x, parentPos.y, position.x, position.y, 1)

                position.x = r[0]
                position.y = r[1]

            }
        })*/
    }

}
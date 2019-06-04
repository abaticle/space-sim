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

    update(dt) {

        let planets = this.ecs.searchEntities(["planet", "position"]);

        planets.forEach(planetId => {

            let { position, planet } = this.ecs.get(planetId);

            if (planet.parent !== undefined) {
                let parentPos = this.ecs.get(planet.parent, "position");

                let r = this.rotate(parentPos.x, parentPos.y, position.x, position.y, 1)

                position.x = r[0]
                position.y = r[1]

            }

            //position.x += 1;
        })
    }

}
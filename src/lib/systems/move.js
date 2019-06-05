export default class MoveSystem {

    constructor(ecs) {
        this.ecs = ecs;
        this.planets = [];
    }

    init() {
        /*this.planets = this.ecs.searchEntities(["planet", "position"]).map(id => {
            return {
                _id: id,
                data: this.ecs.get(id)
            }
        });*/
    }

    rotate(cx, cy, x, y, angle) {
        let radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        
        return {x: nx, y: ny}
        //return [nx, ny];
    }

    
    movePlanet(id, dt) {
        let { position, planet } = this.ecs.get(id);

        //Save planet position
        let t = {
            x: position.x,
            y: position.y
        }       

        if (planet.parentId !== undefined) {

            //Rotate planet :
            let parentPos = this.ecs.get(planet.parentId, "position");

            let r = this.rotate(parentPos.x, parentPos.y, position.x, position.y, planet.speed * dt);

            position.x = r.x
            position.y = r.y

            t.x = position.x - t.x
            t.y = position.y - t.y


            //And move all childrens :
            planet.childrenIds.forEach(childrenId => {
                let p = this.ecs.get(childrenId, "position");
                p.x += t.x
                p.y += t.y
            })
            
        }
    }

    update(dt) {

        let planets = this.ecs.searchEntities(["planet", "position"]);

        planets.forEach(id => {
            this.movePlanet(id, dt);
        })

    }

}
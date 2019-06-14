export default class Tools {


    static easeOutQuint(from, to, number) { 
        const f = t => 1+(--t)*t*t*t*t

        const slices = Math.abs((from - to) / number);
        let pos = [];

        for (let i = 0; i < number; i++) {
            pos.push(f(from + i*slices));
        }
        return pos;
    }

    /**
     * Move pointFrom toward pointTo with a speed
     * @param {{x: number, y: number}} pointFrom Object with x, y properties
     * @param {{x: number, y: number}} pointTo Target with x, y properties
     * @param {number} speed Object speed
     * @return {{x: number, y: number, angle: number}} New point with angle in degree
     */
    static moveToward(pointFrom, pointTo, speed) {

        let tx = pointTo.x - pointFrom.x;
        let ty = pointTo.y - pointFrom.y;

        let dist = Math.sqrt(tx * tx + ty * ty);
        let rad = Math.atan2(ty, tx);
        let angle = rad / Math.PI * 180;;

        let velX = (tx / dist) * speed;
        let velY = (ty / dist) * speed;

        return {
            x: pointFrom.x + velX,
            y: pointFrom.y + velY,
            angle
        }
    }


    /**
     * Get new posititon for an item rotation
     * @param {number} cx Rotation axle x pos
     * @param {*} cy Rotation axle y pos
     * @param {*} x Item x to rotate
     * @param {*} y Item y to rotate
     * @param {*} angle Angle in degree
     */
    static rotate(cx, cy, x, y, angle) {
        let radians = (Math.PI / 180) * angle;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

        return {
            x: nx,
            y: ny
        }
    }

    /**
     * Calculate distance between 2 points
     * @param {object} pointFrom Origin object with x, y properties
     * @param {object} pointTo Target object with x, y properties 
     */
    static distance(pointFrom, pointTo) {
        var xDist = pointFrom.x - pointTo.x;
        var yDist = pointFrom.y - pointTo.y;

        return Math.sqrt(xDist * xDist + yDist * yDist);
    }
}
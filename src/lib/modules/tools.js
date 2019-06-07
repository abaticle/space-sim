export default class Tools {
    
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
    * @param {*} pointTo Target object with x, y properties 
    */
    static distance(pointFrom, pointTo) {
        var xDist = pointFrom.x - pointTo.x;
        var yDist = pointFrom.y - pointTo.y;

        return Math.sqrt(xDist * xDist + yDist * yDist);
    }
}
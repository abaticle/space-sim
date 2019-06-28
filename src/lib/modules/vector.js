/**
 * @typedef Vector
 * @type {object}
 * @property {number} x
 * @property {number} y
 */

/**
 * Get angle 
 * @param {Vector} v1 
 */
const getAngleAsDegree = (v1) => {
    let deg = convertRadianToDegree(Math.atan(v1.y / v1.x))

    if (deg > -90 && deg < 90 ) {
        deg += 90
    } else {
        deg += 30
    }
    return deg

}


const convertRadianToDegree = (radian) => {
    return radian * (180 / Math.PI)
}

/**
 * Add vectors
 * @param {Vector} v1 
 * @param {Vector} v2 
 */
const add = (v1, v2) => {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    }
}

/**
 * Substract vectors
 * @param {Vector} v1 
 * @param {Vector} v2 
 */
const substract = (v1, v2) => {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y
    }
}

/**
 * Multiply vectors
 * @param {Vector} v1 
 * @param {Vector} v2 
 */
const dot = (v1, v2) => {
    return v1.x * v2.x + v1.y * v2.y;
}

const scale = (v1, scale) => {
    return {
        x: v1.x * scale,
        y: v1.y * scale
    }
}

/**
 * Get magnitude from a vector
 * @param {Vector} v1 
 */
const magnitude = (v1) => {
    return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
}

/**
 *Normalize a vector
 * @param {Vector} v1 
 */
const normalize = (v1) => {
    var magnitude = Math.sqrt(v1.x * v1.x + v1.y * v1.y); //magnitude(v1);

    if (magnitude === 0) {
        return {
            x: 0,
            y: 0
        };
    } else {
        return {
            x: v1.x / magnitude,
            y: v1.y / magnitude
        };
    }
}

export {
    add,
    substract,
    dot,
    scale,
    magnitude,
    normalize,
    getAngleAsDegree,
    convertRadianToDegree
}
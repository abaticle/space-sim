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
    var angle = Math.atan2(v1.y, v1.x);
    var degrees = 180 * angle / Math.PI;
    return (360 + Math.round(degrees)) % 360;
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

const multiply = (v1, multiply) => {
    if (typeof multiply === "number") {
        return {
            x: v1.x * multiply,
            y: v1.y * multiply
        }
    }
    return {
        x: v1.x * multiply,
        y: v1.y * multiply
    }
}

const divide = (v1, divide) => {
    if (typeof divide === "number") {
        return {
            x: v1.x / divide,
            y: v1.y / divide
        }
    }
    return {
        x: v1.x / divide,
        y: v1.y / divide
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
 * Normalize a vector
 * @param {Vector} v1 
 * @returns {Vector}
 */
const normalize = (v1) => {
    let magnitude = Math.sqrt(v1.x * v1.x + v1.y * v1.y)

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

/**
 * Truncate a vector (set a max magnitude)
 * @param {Vector} v1 
 * @param {number} maxLength Maximum vector magnitude
 * @returns {Vector}
 */
const truncate = (v1, maxLength) => {
    let magnitude = Math.sqrt(v1.x * v1.x + v1.y * v1.y)

    if (magnitude <= maxLength) {
        return {
            x: v1.x,
            y: v1.y
        }
    } else {
        return multiply(normalize(v1), maxLength)
    }
}

export {
    add,
    substract,
    dot,
    multiply,
    divide,
    magnitude,
    normalize,
    truncate,
    getAngleAsDegree,
    convertRadianToDegree
}

export const building = {
    name: "building",
    buildingId: "",
    type: "",
    desc: "",
    longDesc: "",
    planetId: 0,
    electricityUsed: 0,
    populationUsed: 0
}

export const electricityProducer = {
    name: "electricityProducer",
    speed: 1,
    state: ""
}

export const electricityBattery = {
    name: "electricityBattery",
    capacity: 0
}

export const producer = {
    name: "producer",
    workstep: 0,
    items: {},
    produce: "",
    canProduce: [], //Array of items 
    speed: 1,
    state: ""   //inactive/active/filled
}

export const construction = {
    name: "construction",
    building: "",
    workstep: 0,
    price: {},
    time: 0,
    items: {}
}

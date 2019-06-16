
const building = {
    name: "building",
    buildingId: "",
    type: "",
    desc: "",
    longDesc: "",
    planetId: 0,
    energyUsed: 0,
    populationUsed: 0
}

const producer = {
    name: "producer",
    workstep: 0,
    items: {},
    produce: "",
    canProduce: [], //Array of items 
    speed: 1,
    state: ""   //inactive/active/filled
}

const construction = {
    name: "construction",
    building: "",
    workstep: 0,
    price: {},
    time: 0,
    items: {}
}



export { building, producer, construction };



const building = {
    name: "building",
    type: "",
    desc: "",
    planetId: 0,
    energyUsed: 0,
    populationUsed: 0,
    price: {},
    time: 0
}

const producer = {
    name: "producer",
    workstep: 0,
    items: {},
    produce: "",
    speed: 1,
    state: ""   //inactive/active/filled
}

const construction = {
    name: "construction",
    building: "",
    workstep: 0
}



export { building, producer, construction };


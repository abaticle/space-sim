const building = {
    name: "building",
    type: "",
    desc: "",
    planetId: 0,
    price: {}
};

const extractor = {
    name: "extractor",
    workstep: 0,
    resource: "", //string: item id
    time: 0,
    speed: 1
};

const factory = {
    name: "factory",
    canWork: false,
    produce: "", //string: item id
    workstep: 0,
    time: 0,
    items: {}, //object {ironBar:2}
    speed: 1
}

export { building, extractor, factory };


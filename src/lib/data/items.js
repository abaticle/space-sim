export default {

    //Population
    population: {
        id: "population",
        type: "population",
        desc: "Population"
    },

    //Money 
    money: {
        id: "money",
        type: "money",
        desc: "Money"
    },

    //Research
    research: {
        id: "research",
        type: "research",
        desc: "Research"
    },

    //Resources 
    iron: {
        id: "iron",
        type: "resource",
        desc: "Iron"
    },
    copper: {
        id: "copper",
        type: "resouce",
        desc: "Copper"
    },

    //Ores
    ironOre: {
        id: "ironOre",
        type: "ore",
        desc: "Iron ore",
        recipe: {
            iron: 1
        },
        time: 5
    },
    copperOre: {
        id: "copperOre",
        type: "ore",
        desc: "Copper ore",
        recipe: {
            copper: 1
        },
        time: 10
    },

    //Items
    ironBar: {
        id: "ironBar",
        type: "item",
        desc: "Iron bar",
        recipe: {
            ironOre: 2
        },
        time: 10
    },
    copperBar: {
        id: "copperBar",
        type: "item",
        desc: "Copper bar",
        recipe: {
            copperOre: 4
        },
        time: 20
    },
    electricComponent: {
        id: "electricComponent",
        type: "item",
        desc: "Electric component",
        recipe: {
            copperBar: 2,
            ironBar: 1
        },
        time: 12
    }
}
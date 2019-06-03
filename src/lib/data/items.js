export default {
    //Resources 
    ironOre: {
        id: "ironOre",
        type: "resource",
        desc: "Iron ore",
        produce: "ironOre",
        time: 2
    },
    copperOre: {
        id: "copperOre",
        type: "resource",
        desc: "Copper ore",
        produce: "copperOre",
        time: 4
    },

    //Items
    ironBar: {
        id: "ironBar",
        type: "item",
        desc: "Iron bar",
        time: 6,
        recipe: {
            ironOre: 5
        }
    },
    copperBar: {
        id: "copperBar",
        type: "item",
        desc: "Copper bar",
        time: 8,
        recipe: {
            copperOre: 5
        }
    },
    electricComponent: {
        id: "electricComponent",
        type: "item",
        desc: "Electric component",
        recipe: {
            copperBar: 5,
            ironBar: 2
        },
        time: 12
    }
}
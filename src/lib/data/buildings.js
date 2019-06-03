export default {

    //Extractors
    extractorMk1: {
        id: "extractorMk1",
        desc: "Extractor MKI",
        speed: 1,
        produce: ["ironOre", "copperOre"],
        price: {
            ironBar: 5
        },
        type: "extractor"
    },
    extractorMk1: {
        id: "extractorMk2",
        desc: "Extractor MKII",
        speed: 2,
        produce: ["ironOre", "copperOre"],
        price: {
            ironBar: 50
        },
        type: "extractor"
    },

    //Furnaces
    furnaceMk1: {
        id: "furnaceMk1",
        desc: "Furnace MKI",
        speed: 1,
        produce: ["ironBar", "copperBar"],
        price: {
            ironBar: 15
        },
        type: "factory"
    },
    furnaceMk2: {
        id: "furnaceMk2",
        desc: "Furnace MKII",
        speed: 2,
        produce: ["ironBar", "copperBar"],
        price: {
            ironBar: 150
        },
        type: "factory"
    },

    //Factories
    factoryMk1: {
        id: "FactoryMk1",
        desc: "Factory MKI",
        speed: 1,
        produce: ["electricComponent"],
        price: {
            ironBar: 30,
            copperBar: 15
        },
        type: "factory"
    }

}
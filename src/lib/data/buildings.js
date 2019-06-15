export default {

    //Laboratories
    laboratoryMk1: {
        id: "laboratoryMk1",
        components: ["building", "producer"],
        data: {
            building: {
                desc: "Laboratory MK1",
                type: "laboratory",
                time: 50,
                price: {
                    ironBar: 30,
                    copperBar: 60
                }
            },
            producer: {
                speed: 10,
                canProduce: ["research"]
            }
        }
    },


    //Extractors
    extractorMk1: {
        id: "extractorMk1",
        components: ["building", "producer"],
        data: {
            building: {
                desc: "Extractor MKI",
                time: 10,
                price: {
                    ironBar: 5
                },
                type: "extractor"
            },
            producer: {
                speed: 1,
                canProduce: ["ironOre", "copperOre"]
            }
        }
    },
    extractorMk2: {
        id: "extractorMk2",
        components: ["building", "producer"],
        data: {
            building: {
                desc: "Extractor MK2",
                time: 100,
                price: {
                    ironBar: 50
                },
                type: "extractor"
            },
            producer: {
                speed: 5,
                canProduce: ["ironOre", "copperOre"]
            }
        }
    },

    
    //Furnaces
    furnaceMk1: {
        id: "furnaceMk1",
        components: ["building", "producer"],
        data: {
            building: {
                desc: "Furnace MK1",
                time: 50,
                price: {
                    ironBar: 50
                },
                type: "factory"
            },
            producer: {
                speed: 1,
                canProduce: ["ironBar", "copperBar"]
            }
        }
    },

    
    //Factories
    factoryMk1: {
        id: "factoryMk1",
        components: ["building", "producer"],
        data: {
            building: {
                desc: "Factory MK1",
                time: 50,
                price: {
                    ironBar: 100
                },
                type: "factory"
            },
            producer: {
                speed: 1,
                canProduce: ["electricComponent"]
            }
        }
    }

}
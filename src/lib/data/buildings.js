export default {

    //Ship builder
    spaceshipBuilderMk1: {
        components: ["building", "producer", "construction"],
        data: {
            building: {
                buildingId: "spaceshipBuilderMk1",
                type: "spaceshipBuilder",
                desc: "Spaceship builder MK1",
                longDesc: "A spaceship builder"
            },
            producer: {
                speed: 10,
                canProduce: ["spaceshipTest"]
            },
            construction: {
                time: 5,
                price: {
                    ironBar: 10
                }, 
                items: {}
            }
        }
    },

    //Laboratories
    laboratoryMk1: {
        components: ["building", "producer", "construction"],
        data: {
            building: {
                buildingId: "laboratoryMk1",
                type: "laboratory",
                desc: "Laboratory MK1",
                longDesc: "A laboratory to produce research"
            },
            producer: {
                speed: 10,
                canProduce: ["research"]
            },
            construction: {
                time: 5,
                price: {
                    ironBar: 1,
                    copperBar: 1
                }, 
                items: {}
            }
        }
    },


    //Extractors
    extractorMk1: {
        components: ["building", "producer", "construction"],
        data: {
            building: {
                buildingId: "extractorMk1",
                type: "extractor",
                desc: "Extractor MKI",
                longDesc: "An extractor to produce iron or copper ore"
            },
            producer: {
                speed: 1,
                canProduce: ["ironOre", "copperOre"]
            },
            construction: {
                time: 10,
                price: {
                    ironBar: 5
                }, 
                items: {}
            }
        }
    },
    extractorMk2: {
        components: ["building", "producer", "construction"],
        data: {
            building: {
                buildingId: "extractorMk2",
                desc: "Extractor MK2",
                longDesc: "An extractor to produce iron or copper ore",
                type: "extractor"
            },
            producer: {
                speed: 5,
                canProduce: ["ironOre", "copperOre"]
            },
            construction: {
                time: 100,
                price: {
                    ironBar: 50
                }, 
                items: {}
            }
        }
    },

    
    //Furnaces
    furnaceMk1: {
        components: ["building", "producer", "construction"],
        data: {
            building: {
                buildingId: "furnaceMk1",
                desc: "Furnace MK1",
                longDesc: "A furnace to produce iron or copper bar",
                type: "factory"
            },
            producer: {
                speed: 1,
                canProduce: ["ironBar", "copperBar"]
            },
            construction: {
                time: 5,
                price: {
                    ironBar: 1
                }, 
                items: {}
            }
        }
    },

    
    //Factories
    factoryMk1: {
        components: ["building", "producer", "construction"],
        data: {
            building: {
                buildingId: "factoryMk1",
                desc: "Factory MK1",
                longDesc: "A factory to produce things",
                type: "factory"
            },
            producer: {
                speed: 1,
                canProduce: ["electricComponent"]
            },
            construction: {
                time: 5,
                price: {
                    ironBar: 1
                }, 
                items: {}
            }
        }
    }

}
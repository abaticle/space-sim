export default {

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
                time: 50,
                price: {
                    ironBar: 30,
                    copperBar: 60
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
                time: 50,
                price: {
                    ironBar: 50
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
                time: 50,
                price: {
                    ironBar: 100
                }, 
                items: {}
            }
        }
    }

}
const buildings = {
    extractorMk1: {
        components: ["building", "extractor"],
        data: {
            building: {
                type: "extractor",
                desc: "Extractor MK1",
                price: {
                    ironBar: 5
                }
            },
            extractor: {
                speed: 1
            }
        }        
    },
    extractorMk2: {
        components: ["building", "extractor"],
        data: {
            building: {
                type: "extractor",
                desc: "Extractor MK2",
                price: {
                    ironBar: 30
                }
            },
            extractor: {
                speed: 2
            }
        }        
    }
}

export default buildings;
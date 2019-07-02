export default {

    //Ship builder
    spaceshipTest: {
        components: ["spaceship", "spaceshipState", "vector", "position", "construction"],
        data: {
            spaceship: {
                desc: "Test spaceship",
                speed: 300,
                mass: 30,
                longDesc: "A spaceship builder"
            },
            construction: {
                time: 5,
                price: {
                    ironBar: 10
                }, 
                items: {}
            }
        }
    }


}
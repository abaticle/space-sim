export default [
    //{name: "Sun", dist: 0, speed: 0, size: 695},
    {
        name: "Mercury",
        distance: 0.4,
        speed: 47,
        size: 2.4
    },
    {
        name: "Venus",
        distance: 0.7,
        speed: 35,
        size: 6
    },
    {
        name: "Earth",
        distance: 1,
        speed: 30,
        size: 6.3,
        resources: {
            ironOre: 30000,
            copperOre: 20000
        },
        satellites: [{
            name: "Moon",
            distance: 1.10,
            speed: 150,
            size: 1.7
        }]
    },
    {
        name: "Mars",
        distance: 1.5,
        speed: 24,
        size: 3.4
    },
    {
        name: "Jupiter",
        distance: 5.2,
        speed: 13,
        size: 70,
        satellites: [{
            name: "Ganymede",
            distance: 5.5,
            speed: 30,
            size: 5
        }]
    },
    {
        name: "Saturn",
        distance: 9.5,
        speed: 9.7,
        size: 58
    },
    {
        name: "Uranus",
        distance: 19.2,
        speed: 6.8,
        size: 25
    },
    {
        name: "Neptune",
        distance: 30.1,
        speed: 5.4,
        size: 24.6
    },
]
export default [
    //{name: "Sun", dist: 0, speed: 0, size: 695},
    {
        name: "Mercury",
        distance: 0.4,
        speed: 47,
        size: 2.4,
        items: {},
        owned: false,
        satellites: []
    },
    {
        name: "Venus",
        distance: 0.7,
        speed: 35,
        size: 6,
        items: {},
        owned: false,
        satellites: []
    },
    {
        name: "Earth",
        distance: 1,
        speed: 30,
        size: 6.3,
        items: {
            iron: 30000,
            copper: 20000
        },
        owned: true,
        satellites: [{
            name: "Moon",
            distance: 1.10,
            speed: 150,
            size: 1.7,
            owned: true,
            items: {
                iron: 15000
            }
        }]
    },
    {
        name: "Mars",
        distance: 1.5,
        speed: 24,
        size: 3.3,
        items: {},
        owned: false,
        satellites: []
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
        }],
        items: {},
        owned: false
    },
    {
        name: "Saturn",
        distance: 9.5,
        speed: 9.7,
        size: 58,
        items: {},
        owned: false,
        satellites: []
    },
    {
        name: "Uranus",
        distance: 19.2,
        speed: 6.8,
        size: 25,
        items: {},
        owned: false,
        satellites: []
    },
    {
        name: "Neptune",
        distance: 30.1,
        speed: 5.4,
        size: 24.6,
        items: {},
        owned: false,
        satellites: []
    },
]
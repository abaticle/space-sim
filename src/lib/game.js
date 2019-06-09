import ECS from "./modules/ecs";
import _ from "lodash";
import {
    building,
    extractor,
    factory
} from "./components/building";
import {
    planet
} from "./components/planet";
import {
    position
} from "./components/position";
import {
    spaceship,
    spaceshipState
} from "./components/spaceship";
import BuildingSystem from "./systems/building";
import MoveSystem from "./systems/move";
import DrawSystem from "./systems/draw";
import UISystem from "./systems/ui";
import items from "./data/items";
import assemblages from "./assemblages/buildings";
import Observable from "./modules/observable";
import ActionsManager from "./modules/actions";

export default class Game extends Observable {

    constructor() {
        super();
        this.speed = 1;
        this.ecs = new ECS();
        this.actions = new ActionsManager();
        this.systems = [];
        this.timeOld = 0;
    }

    /**
     * Initialize and start game
     */
    init() {
        this.registerComponents();
        this.createPlanets();
        this.createSpaceships();
        this.createSystems();
        this.initSystems();
        requestAnimationFrame(this.update.bind(this));
    }

    initSystems() {
        this.systems.forEach(s => s.init());
    }

    createSystems() {
        this.systems.push(new BuildingSystem(this.ecs, this.actions))
        this.systems.push(new MoveSystem(this.ecs, this.actions))
        this.systems.push(new DrawSystem(this.ecs, this.actions))
        this.systems.push(new UISystem(this.ecs, this.actions))
    }

    /**
     * Update systems and draw app
     * @param {number} time 
     */
    update(time) {
        let dt = (time - this.timeOld) / 1000;
        this.timeOld = time;


        //Display FPS
        this.updateFPS(dt);


        //Update speed
        dt *= this.speed;

        _.each(this.systems, system => {
            system.update(dt);
        });

        requestAnimationFrame(this.update.bind(this));

    }

    updateFPS(dt) {
        let fps = (1 / (dt)).toFixed(0);
        fps += " fps"
        document.getElementById("fpsCounter").innerHTML = fps;
    }


    createPlanet(name, size, x, y) {
        let planet = this.ecs.createEntity(["planet", "position"]);

        this.ecs.set(name, planet, "planet", "desc");
        this.ecs.set(size, planet, "planet", "size");

        this.ecs.set(x, planet, "position", "x");
        this.ecs.set(y, planet, "position", "y");

        if (name === "Earth") console.log("Earth id: " + planet)

        return planet;
    }


    createExtractor(planet, resource) {
        const building = this.ecs.createFromAssemblage(assemblages.extractorMk1);

        const {
            id,
            time
        } = items[resource];

        this.ecs.set(id, building, "extractor", "resource");
        this.ecs.set(time, building, "extractor", "time");
        this.ecs.set(planet, building, "building", "planetId");
    }

    createFactory(planet, produce) {
        const building = this.ecs.createEntity(["building", "factory"]);

        this.ecs.set(planet, building, "building", "planetId");
        this.ecs.set("Factory MK1", building, "building", "desc");

        const item = items[produce];
        this.ecs.set(item.id, building, "factory", "produce");
        this.ecs.set(item.time, building, "factory", "time");
    }

    registerComponents() {
        this.ecs.registerComponent(building);
        this.ecs.registerComponent(extractor);
        this.ecs.registerComponent(factory);
        this.ecs.registerComponent(planet);
        this.ecs.registerComponent(position);
        this.ecs.registerComponent(spaceship);
        this.ecs.registerComponent(spaceshipState);
    }

    /**
     * find a planet from it's desc
     * @param {string} desc 
     */
    getPlanet(desc) {
        return this.ecs
            .searchEntities("planet")
            .find(id => this.ecs.get(id, "planet", "desc") === desc);
    }

    createSpaceships() {
        let spaceship = this.ecs.createEntity(["spaceship", "spaceshipState", "position"]);

        console.log("Spaceship id: ", spaceship);

        let earthId = this.getPlanet("Earth");

        let earthPos = this.ecs.get(earthId, "position");

        this.ecs.set(earthPos.x, spaceship, "position", "x")
        this.ecs.set(earthPos.y, spaceship, "position", "y")

        this.ecs.set(5, spaceship, "spaceship", "speed")
        this.ecs.set("space-1", spaceship, "spaceship", "desc")

        const orders = [{
            goTo: this.getPlanet("Moon")
        }, {
            take: {
                ironBar: 10
            }
        }, {
            goTo: this.getPlanet("Earth")
        }, {
            deposit: {
                ironBar: "all"
            }
        }];

        this.ecs.set(orders, spaceship, "spaceship", "orders");

        /**
         * Possible spaceship states are :
         * - orbit
         * - move
         * - stop
         * - transfer
         */

        /**
         * Commands: 
         *
         * */



        this.ecs.set("orbit", spaceship, "spaceshipState", "state");
        this.ecs.set(earthId, spaceship, "spaceshipState", "orbitAround");

    }

    createPlanets() {
        let paramsPlanets = [
            //{name: "Sun", dist: 0, speed: 0, size: 695},
            {
                name: "Mercury",
                dist: 0.4,
                speed: 47,
                size: 2.4
            },
            {
                name: "Venus",
                dist: 0.7,
                speed: 35,
                size: 6
            },
            {
                name: "Earth",
                dist: 1,
                speed: 30,
                size: 6.3
            },
            {
                name: "Mars",
                dist: 1.5,
                speed: 24,
                size: 3.4
            },
            {
                name: "Jupiter",
                dist: 5.2,
                speed: 13,
                size: 70
            },
            {
                name: "Saturn",
                dist: 9.5,
                speed: 9.7,
                size: 58
            },
            {
                name: "Uranus",
                dist: 19.2,
                speed: 6.8,
                size: 25
            },
            {
                name: "Neptune",
                dist: 30.1,
                speed: 5.4,
                size: 24.6
            },
        ];

        let paramsSattelites = [{
            name: "Moon",
            parent: "Earth",
            dist: 1.10,
            speed: 150,
            size: 1.7
        }]

        let sun = this.createPlanet("Sun", 350, 0, 0);
        this.ecs.set("Sun", sun, "planet", "name");
        this.ecs.set("star", sun, "planet", "type");


        let earthId;

        let sizeModifier = 2;
        let distanceModifier = 5000;
        let speedModifier = 0.001;

        paramsPlanets.forEach(param => {
            let p = this.createPlanet(param.name, param.size * sizeModifier, 695 + (param.dist * distanceModifier), 0);

            if (param.name === "Earth") {
                this.ecs.set(true, p, "planet", "owned");

                /*_.times(40, () => {
                    this.createExtractor(p, "ironOre");    
                })*/
                this.createExtractor(p, "ironOre");
                this.createExtractor(p, "ironOre");
                this.createExtractor(p, "ironOre");

                earthId = p;
            }

            this.ecs.set("planet", p, "planet", "type")
            this.ecs.set(param.name, p, "planet", "name");
            this.ecs.set(sun, p, "planet", "parentId");
            this.ecs.set(param.speed * speedModifier, p, "planet", "speed");
        });

        paramsSattelites.forEach(param => {
            let p = this.createPlanet(param.name, param.size * sizeModifier, 695 + (param.dist * distanceModifier), 0);

            let parentId = this.getPlanet(param.parent);

            if (param.name === "Moon") {
                this.ecs.set(true, p, "planet", "owned");

                this.createExtractor(p, "ironOre");
                this.createExtractor(p, "ironOre");
                this.createExtractor(p, "ironOre");                
            }

            this.ecs.set("planet", p, "planet", "type")
            this.ecs.set(param.name, p, "planet", "name");
            this.ecs.set(parentId, p, "planet", "parentId");
            this.ecs.set(param.speed * speedModifier, p, "planet", "speed");
        })

        this._updatePlanetsChildrens();
    }

    _updatePlanetsChildrens() {
        let planets = this.ecs.searchEntities("planet").map(id => this.ecs.get(id, "planet"));

        planets.forEach(planet => {

            function getChildren(id) {
                let childrens = planets.filter(p => p.parentId === id);

                if (childrens.length === 0) {
                    return;
                } else {
                    childrens.forEach(p => {
                        planet.childrenIds.push(p._id)
                        getChildren(p._id)
                    })
                }
            }

            getChildren(planet._id);
        })
    }
}
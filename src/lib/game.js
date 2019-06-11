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
import solarSystem from "./data/solar-system";
import Observable from "./modules/observable";
import ActionsManager from "./modules/actions";
import EntityManager from "./modules/entity-manager";

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
        this.createPlanets(solarSystem);
        this.createSystems();
        this.initSystems();
        this.createSpaceships();
        requestAnimationFrame(this.update.bind(this));

        //this.tests();
    }


    tests() {
        const ecs = this.ecs;

        let factory = new EntityManager(ecs);

        let p = factory.createPlanet({
            desc: "test",
            size: 400,
            owned: true,
            speed: 2
        })

        console.assert(ecs.get(p, "planet", "desc") === "test", `createPlanet with desc works`)
        console.assert(ecs.get(p, "planet", "type") === "planet", `createPlanet default value`)
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



        this.ecs.set("move", spaceship, "spaceshipState", "state");
        this.ecs.set(0, spaceship, "spaceshipState", "moveTo");

    }


    /**
     * Create planet entities from a solar system
     */
    createPlanets(solarSystem) {
        const modifiers = {
            size: 20,
            distance: 16000,
            speed: 0.001
        }

        const entityManager = new EntityManager(this.ecs);


        //Create the sun 
        const sun = entityManager.createPlanet({
            type: "star",
            desc: "Sun",
            size: 700,
            x: 0,
            y: 0
        })


        solarSystem.forEach(params => {

            //Create each planets 
            const planet = entityManager.createPlanet({
                type: "planet",
                desc: params.name,
                size: modifiers.size * params.size,
                x: 700 + (modifiers.distance * params.distance),
                y: 0,
                parentId: sun,
                speed: modifiers.speed * params.speed,
                resources: params["resources"] ? params.resources : {}
            })


            //For earth, create factories/extractors
            if (params.name === "Earth") {
                window.earth = this.ecs.get(planet);

                for (let i = 0; i < 4; i++) {
                    entityManager.createExtractor({
                        planetId: planet,
                        resource: "ironOre",
                        time: items.ironOre.time
                    })
                }

                entityManager.createFactory({
                    planetId: planet,
                    produce: "ironBar",
                    time: items.ironBar.time
                })
            }


            //And planet satellites 
            if (params["satellites"] !== undefined) {

                params["satellites"].forEach(params => {
                    const satellite = entityManager.createPlanet({
                        type: "satellite",
                        desc: params.name,
                        size: modifiers.size * params.size,
                        x: 700 + (modifiers.distance * params.distance),
                        y: 0,
                        parentId: planet,
                        speed: modifiers.speed * params.speed
                    })
                })
            }
        })

        entityManager.updatePlanetsChildrens();
    }
}
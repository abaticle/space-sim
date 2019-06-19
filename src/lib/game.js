import ECS from "./modules/ecs";
import _ from "lodash";
import {
    building,
    producer,
    construction
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
import ConstructionSystem from "./systems/construction";
import MoveSystem from "./systems/move";
import DrawSystem from "./systems/draw";
import DebugSystem from "./systems/debug";
import UISystem from "./systems/ui";
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
        this.entityManager = new EntityManager(this.ecs);
    }

    /**
     * Initialize and start game
     */
    init() {
        this.registerComponents();
        this.createSolarSystem(solarSystem);
        this.createBuildings();
        this.createSystems();
        this.createSpaceships();
        this.initSystems();
        requestAnimationFrame(this.update.bind(this));

        //this.tests();
    }


    tests() {
        const ecs = this.ecs;

        let manager = new EntityManager(ecs);

        let p = manager.createPlanet({
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
        this.systems.push(new ConstructionSystem(this.ecs, this.actions))
        this.systems.push(new BuildingSystem(this.ecs, this.actions))
        this.systems.push(new MoveSystem(this.ecs, this.actions))
        this.systems.push(new DrawSystem(this.ecs, this.actions))
        this.systems.push(new UISystem(this.ecs, this.actions))
        this.systems.push(new DebugSystem(this.ecs, this.actions))
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
        this.ecs.registerComponent(producer);
        this.ecs.registerComponent(planet);
        this.ecs.registerComponent(position);
        this.ecs.registerComponent(spaceship);
        this.ecs.registerComponent(spaceshipState);
        this.ecs.registerComponent(construction);        
    }

    createSpaceships() {
        let spaceship = this.ecs.createEntity(["spaceship", "spaceshipState", "position"]);
        
        console.log("Spaceship id: ", spaceship);

        let earthId = this.entityManager.getPlanet("Earth");
        let moonId = this.entityManager.getPlanet("Moon");


        let earthPos = this.ecs.get(earthId, "position");

        this.ecs.set(earthPos.x, spaceship, "position", "x")
        this.ecs.set(earthPos.y, spaceship, "position", "y")

        this.ecs.set(5, spaceship, "spaceship", "speed")
        this.ecs.set("space-1", spaceship, "spaceship", "desc")

        const orders = [{
            goTo: moonId
        }, {
            take: {
                ironBar: 10
            }
        }, {
            goTo: earthId
        }, {
            deposit: {
                ironBar: "all"
            }
        }];

        this.ecs.set(orders, spaceship, "spaceship", "orders");
        this.ecs.set("move", spaceship, "spaceshipState", "state");
        this.ecs.set(earthId, spaceship, "spaceshipState", "moveTo");

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




    }



    createBuildings() {
        let earth = this.entityManager.getPlanet("Earth");

        this.entityManager.createBuildingFromData("extractorMk1", false, earth)
        this.entityManager.createBuildingFromData("extractorMk1", false, earth)
        this.entityManager.createBuildingFromData("furnaceMk1", false, earth)
        this.entityManager.createBuildingFromData("factoryMk1", false, earth)
    }

    /**
     * Create planet entities from a solar system
     */
    createSolarSystem(solarSystem) {        

        //Create the sun 
        const sun = this.entityManager.createPlanet({
            type: "star",
            desc: "Sun",
            size: 700,
            x: 0,
            y: 0
        })

        const createPlanetFromParams = (params, parentId) => {
            const modifiers = {
                size: 20,
                distance: 16000,
                speed: 0.001
            }

            return this.entityManager.createPlanet({
                type: "planet",
                desc: params.name,
                size: modifiers.size * params.size,
                x: 700 + (modifiers.distance * params.distance),
                y: 0,
                parentId: parentId || sun,
                speed: modifiers.speed * params.speed,
                items: params["items"] ? params.items : {},
                owned: params.owned
            })
        }

        solarSystem.forEach(params => {
            //Create each planets 
            const planet = createPlanetFromParams(params)

            //And planet satellites 
            params.satellites.forEach(params => createPlanetFromParams(params, planet))
        })

        this.entityManager.updatePlanetsChildrens();
    }
}
import ECS from "./modules/ecs"
import _ from "lodash"
import {
    game
} from "./components/game"
import {
    building,
    producer,
    construction
} from "./components/building"
import {
    planet
} from "./components/planet"
import {
    position,
    velocity
} from "./components/position"
import {
    spaceship,
    spaceshipState
} from "./components/spaceship"
import BuildingSystem from "./systems/building"
import ConstructionSystem from "./systems/construction"
import MovePlanetSystem from "./systems/move-planet"
import MoveSpaceshipSystem from "./systems/move-spaceship"
import DrawSystem from "./systems/draw"
import DebugSystem from "./systems/debug"
import UISystem from "./systems/ui"
import solarSystem from "./data/solar-system"
import Observable from "./modules/observable"
import ActionsManager from "./modules/actions"
import EntityManager from "./modules/entity-manager"
import constants from "./data/constants";
import Tools from "./modules/tools";

export default class Game extends Observable {

    constructor() {
        super();
        this.ecs = new ECS();
        this.actions = new ActionsManager();
        this.systems = [];
        this.timeOld = 0;
        this.entityManager = new EntityManager(this.ecs);
        this._gameEntity = undefined;
    }

    /**
     * Initialize and start game
     */
    init() {
        this.registerComponents();
        this._gameEntity = this.createGame();
        this.createSolarSystem(solarSystem);
        this.createBuildings();
        this.createSystems();
        this.createSpaceships();
        this.initSystems();
        requestAnimationFrame(this.update.bind(this));

    }

    initSystems() {
        this.systems.forEach(s => s.init());
    }

    createSystems() {
        this.systems.push(new ConstructionSystem(this.ecs, this.actions))
        this.systems.push(new BuildingSystem(this.ecs, this.actions))
        this.systems.push(new MovePlanetSystem(this.ecs, this.actions))
        this.systems.push(new MoveSpaceshipSystem(this.ecs, this.actions))
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
        dt *= this._gameEntity.speed

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

        const components = [building, producer, planet, position, spaceship, spaceshipState, construction, game, velocity];

        components.forEach(c => this.ecs.registerComponent(c))

    }

    createSpaceships() {


        for (let i = 0; i < 2; i++)

        this.ecs.createFromAssemblage({
            components: ["spaceship", "spaceshipState", "position", "velocity"],
            data: {
                spaceship: {
                    desc: "space " + i,
                    speed: 1500,
                    stateIndex: 0,
                    stateRepeat: true,
                    states: [{
                        state: "move",
                        payload: {
                            moveTo: this.entityManager.getPlanet("Earth")
                        }
                    }, {
                        state: "take",
                        payload: {
                            takeFrom: this.entityManager.getPlanet("Earth"),
                            takeItems: {
                                ironBar: 2
                            }
                        }
                    }, {
                        state: "move",
                        payload: {
                            moveTo: this.entityManager.getPlanet("Moon")
                        }
                    }, {
                        state: "give",
                        payload: {
                            giveTo: this.entityManager.getPlanet("Moon"),
                            giveItems: {
                                ironBar: 2
                            }
                        }
                    }]
                },
                spaceshipState: {
                    moveTo: this.entityManager.getPlanet("Earth")
                },
                position: {
                    x: Tools.random(-40000, 40000),
                    y: Tools.random(-40000, 40000)
                }
            }

        })
    }


    createBuildings() {
        let earth = this.entityManager.getPlanet("Earth");

        this.entityManager.createBuildingFromData("extractorMk1", false, earth)
        this.entityManager.createBuildingFromData("extractorMk1", false, earth)
        this.entityManager.createBuildingFromData("furnaceMk1", false, earth)
        this.entityManager.createBuildingFromData("factoryMk1", false, earth)
    }


    /**
     * Create game entity with speed
     */
    createGame() {
        let game = this.ecs.createEntity("game");

        return this.ecs.get(game, "game")
    }

    /**
     * Create planet entities from a solar system
     */
    createSolarSystem(solarSystem) {

        const modifiers = {
            size: constants.planetSizeModifier,
            distance: constants.planetDistanceModifier,
            speed: constants.planetSpeedModifier
        }


        //Create the sun 
        const sun = this.entityManager.createPlanet({
            type: "star",
            desc: "Sun",
            size: constants.sunSize * modifiers.size,
            x: 0,
            y: 0
        })



        const createPlanetFromParams = (params, parentId) => {



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

        solarSystem
            .forEach(params => {
                //Create each planets 
                const planet = createPlanetFromParams(params)

                //And planet satellites 
                params.satellites.forEach(params => createPlanetFromParams(params, planet))
            })

        this.entityManager.updatePlanetsChildrens();
    }
}
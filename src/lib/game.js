import ECS from "./ecs/ecs";
import _ from "lodash";
//import { building, extractor, factory, planet, BuildingSystem, assemblages } from "./imports"
import { building, extractor, factory } from "./components/building";
import { planet } from "./components/planet";
import { position } from "./components/position";
import BuildingSystem from "./systems/building";
import MoveSystem from "./systems/move";
import DrawSystem from "./systems/draw";
import items from "./data/items";
import assemblages from "./assemblages/buildings"

class Observable {
    constructor() {
      this.observers = [];
    }
  
    subscribe(f) {
      this.observers.push(f);
    }
  
    unsubscribe(f) {
      this.observers = this.observers.filter(subscriber => subscriber !== f);
    }
  
    notify(event, data) {
      this.observers.forEach(observer => observer(event, data));
    }
  }

export default class Game extends Observable{

    constructor() {
        super();

        this.tick = 0;
        this.speed = 1;
        this.ecs = new ECS();
        this.systems = [];
        this.timeOld = 0;
    }

    /**
     * Initialize and start game
     */
    init() {
        this.registerComponents();
        this.createEntities();   
        this.createSystems();
        this.initSystems();

        requestAnimationFrame(this.update.bind(this))
    }

    initSystems() {
        this.systems.forEach(s => s.init());
    }

    /**
     * Update systems and draw app
     * @param {number} time 
     */
    update(time) {
        let dt = ( time - this.timeOld ) / 1000;
        this.timeOld = time;

        dt *= this.speed;
        
        //Update entities
        _.each(this.systems, system => {
            system.update(dt)
        });

        //Draw
        //if (this.tick % 5 === 0) {
            this.draw(dt);
        //}
        
        
        requestAnimationFrame(this.update.bind(this));

        this.tick++;

        if (this.tick > 10000) {
            this.tick = 0;
        }
    }


    getPlanets() {

        let planets = this.ecs.searchEntities("planet");
        let buildings = this.ecs.searchEntities("building");


        return _.map(planets, planetId => {
            let planet = this.ecs.get(planetId);


            let result = {
                _id: planetId,
                name: planet.planet.name,
                buildings: [],
                items: []
            };

            result.buildings = _.filter(_.map(buildings, id => {
                let building = this.ecs.get(id);

                switch(true) {
                    case _.has(building, "extractor"):
                        return {
                            _id: id,
                            planetId: building.building.planetId,
                            desc: building.building.desc,
                            workstep: building.extractor.workstep,
                            produce: items[building.extractor.resource].desc,
                            time: building.extractor.time
                        }

                    case _.has(building, "factory"):
                        return {
                            _id: id,
                            planetId: building.building.planetId,
                            desc: building.building.desc,
                            workstep: building.factory.workstep,
                            produce: items[building.factory.produce].desc,
                            time: building.factory.time
                        }
                }
            }), {'planetId': planetId});


            result.items = _.map(_.toPairs(planet.planet.items), a => {
                return { 
                    id:a[0], 
                    desc:items[a[0]].desc, 
                    count: a[1] 
                }
            });


            return result;
        })
    }

    draw(dt, time) {
        this.notify("planets", this.getPlanets());
    }

    createSystems() {
        this.systems.push(new BuildingSystem(this.ecs));
        this.systems.push(new MoveSystem(this.ecs));
        this.systems.push(new DrawSystem(this.ecs));
    }

    createPlanet(name, size, x, y) {
        let planet = this.ecs.createEntity(["planet", "position"]);

        this.ecs.set(name, planet, "planet", "name");
        this.ecs.set(size, planet, "planet", "size");

        this.ecs.set(x, planet, "position", "x");
        this.ecs.set(y, planet, "position", "y");

        return planet;
    }


    createExtractor(planet, resource) {
        const building = this.ecs.createFromAssemblage(assemblages.extractorMk1);

        const {id, time} = items[resource];

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
    }


    createEntities() {
        let planet;

        let sun = this.createPlanet("Sun", 90, 800, 400)

        let earth = this.createPlanet("Earth", 30, 400, 400);
        
        this.createExtractor(earth, "ironOre");
        this.createExtractor(earth, "ironOre");
        this.createExtractor(earth, "ironOre");
        this.createExtractor(earth, "copperOre");
        this.createFactory(earth, "ironBar");
        this.createFactory(earth, "copperBar");     
        this.createFactory(earth, "electricComponent");                      

        
        let moon = this.createPlanet("Moon", 10, 320, 400);
        this.createExtractor(moon, "ironOre");
        this.createExtractor(moon, "ironOre");
        this.createFactory(moon, "ironBar");          

        this.ecs.set(earth, moon, "planet", "parent");
        this.ecs.set(sun, earth, "planet", "parent");

        /*
        _.times(10, (i) => {
            planet = this.createPlanet("sattelite"+i);
            this.createExtractor(planet, "ironOre");
            this.createExtractor(planet, "ironOre");
            this.createFactory(planet, "ironBar");                 
        })*/
    }
}


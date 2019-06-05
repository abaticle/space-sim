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

        this.draw(dt);        
        
        requestAnimationFrame(this.update.bind(this));
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

        this.ecs.set(name, planet, "planet", "desc");
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


    updatePlanetsChildrens() {
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

    createSolarSystem() {
        let sun = this.createPlanet("Sun", 90, 800, 800);

        let nPlanets = _.random(5, 10);

        _.times(_.random(5, 10), (i) => {
            let size = _.random(15, 35);
            let speed = _.random(-2, 2);
            

            let p = this.createPlanet("Planet " + i, size, 800 - ((i + 1)*_.random(150, 200)), 800);

            this.ecs.set(sun, p, "planet", "parentId");
            this.ecs.set(speed, p, "planet", "speed");            
        });

        this.updatePlanetsChildrens();
    }


    createEntities() {
        
        let params = [
            //{name: "Sun", dist: 0, speed: 0, size: 695},
            {name: "Mercury", dist: 0.4, speed: 47, size: 2.4},
            {name: "Venus", dist: 0.7, speed: 35, size: 6},
            {name: "Earth", dist: 1, speed: 30, size: 6.3},
            {name: "Mars", dist: 1.5, speed: 24, size: 3.4},
            {name: "Jupiter", dist: 5.2, speed: 13, size: 70},
            {name: "Saturn", dist: 9.5, speed: 9.7, size: 58},
            {name: "Uranus", dist: 19.2, speed: 6.8, size: 25},
            {name: "Neptune", dist: 30.1, speed: 5.4, size: 24.6},
        ];

        let sun = this.createPlanet("Sun", 350, 0, 0);
        this.ecs.set("Sun", sun, "planet", "name");

        params.forEach(param => {
            let p = this.createPlanet(param.name, param.size * 2, 695 + (param.dist*1000), 0);

            this.ecs.set(param.name, p, "planet", "name");
            this.ecs.set(sun, p, "planet", "parentId");
            this.ecs.set(param.speed / 10, p, "planet", "speed");
        });

        this.updatePlanetsChildrens();

/*      

        Planet  | Distance | Speed
        -----------------------------------
        Mercury | 0.4   AU | 47     Km/s
        Venus   | 0.7   AU | 35     Km/s 
        Earth   | 1     AU | 30     Km/s
        Mars    | 1.5   AU | 24     Km/s
        Jupiter | 5.2   AU | 13     Km/s
        Saturn  | 9.5   AU | 9.7    Km/s
        Uranus  | 19.2  AU | 6.8    Km/s
        Neptune | 30.1  AU | 5.4    Km/s

*/




/*
        this.createSolarSystem();
        this.updatePlanetsChildrens();

    
        let sun = this.createPlanet("Sun", 90, 800, 400);
        let earth = this.createPlanet("Earth", 30, 400, 400); 
        let moon = this.createPlanet("Moon", 10, 320, 400);    
        let mars = this.createPlanet("Mars", 20, 600, 400);   

        console.log("sun id :", sun)
        console.log("earth id :", earth)
        console.log("moon id :", moon)
        console.log("mars id :", mars)

        this.createExtractor(earth, "ironOre");
        this.createExtractor(earth, "ironOre");
        this.createExtractor(earth, "ironOre");
        this.createExtractor(earth, "copperOre");
        this.createFactory(earth, "ironBar");
        this.createFactory(earth, "copperBar");     
        this.createFactory(earth, "electricComponent");     
        this.createExtractor(moon, "ironOre");
        this.createExtractor(moon, "ironOre");
        this.createFactory(moon, "ironBar");  
        
        
        this.ecs.set(earth, moon, "planet", "parentId");
        this.ecs.set(sun, earth, "planet", "parentId");
        this.ecs.set(sun, mars, "planet", "parentId");

        this.ecs.set(3, moon, "planet", "speed");
        this.ecs.set(0.1, earth, "planet", "speed");
        this.ecs.set(0.5, mars, "planet", "speed");

        this.updatePlanetsChildrens();
        */
    }
}


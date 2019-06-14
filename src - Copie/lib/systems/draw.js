import Tools from "./../modules/tools";
import { planet } from "./../../svelte/stores";
import { get } from 'svelte/store';

export default class DrawSystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.layer;
        this.stage;
        this.scaleBy = 1.3;
    }


    hidePannel() {
        //planet.set(undefined);
    }


    onClick(event) {
        let id = event.target.id();

        switch (true) {
            case id.startsWith("planet"):
                let planetId = parseInt(id.split("-")[1]);

                if (typeof planetId !== "number") {
                    throw new Error(`No entity found from id ${target.id()}`);
                }

                this.actions.addAction("displayPanel", {
                    type: "planet",
                    planetId
                })
                break;

            default:
                this.actions.addAction("removePanel")
        }
    }


    //TODO: utiliser une fonction de leasing pour l'animation
    onScroll(e) {

        const stage = this.stage;

        e.evt.preventDefault();

        const oldScale = stage.scaleX();

        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / this.scaleBy : oldScale * this.scaleBy;
       
        stage.scale({
            x: newScale,
            y: newScale
        });

        const newPos = {
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        };

        const texts = stage.find("Text");

        texts.forEach(text => {
            text.scale({
                x: 1 / newScale,
                y: 1 / newScale
            })
        });

        stage.position(newPos);
        stage.batchDraw();
    }

    initKonva() {

        //this.width = document.getElementById("map").offsetWidth;

        this.stage = new Konva.Stage({
            container: 'map',
            width: this.width,
            height: this.height,
            draggable: true
        });

        this.layer = new Konva.Layer({
            id: "planet-layer"
        });

        this.stage.on('wheel', this.onScroll.bind(this));
        this.stage.on("click", this.onClick.bind(this))

        this.stage.add(this.layer);

        //TODO:Remove for build
        window.stage = this.stage;
        window.layer = this.layer;
    }

    initPlanets() {
        let planets = this.ecs.searchEntities(["planet", "position"])

        planets.forEach(id => {
            let layer = this.layer;

            let {
                position,
                planet
            } = this.ecs.get(id);

            //Draw planet :
            let circle = new Konva.Circle({
                x: position.x,
                y: position.y,
                radius: planet.size,
                //stroke: "white",
                //strokeWidth: 2,
                id: "planet-" + id.toString(),
                name: "planet"
            });

            if (planet.desc === "Sun") {
                circle.fill("#fff5b1")
            } else {
                circle.fill("#f1f8ff")
                circle.stroke("white")
                circle.strokeWidth(2)
            }

            layer.add(circle);


            //Draw planet orbit
            if (planet.parentId !== undefined) {
                let positionParent = this.ecs.get(planet.parentId, "position")

                let radius = Tools.distance(position, positionParent)

                layer.add(new Konva.Circle({
                    x: positionParent.x,
                    y: positionParent.y,
                    radius: radius,
                    stroke: "white",
                    strokeWidth: 0.3,
                    id: "planet-orbite-" + id.toString(),
                    name: "planet-orbite",
                    listening: false
                }));
            }

            //Drawn planet name :
            let text = new Konva.Text({
                x: position.x,
                y: position.y + planet.size + 15,
                fontSize: 12,
                text: planet.desc,
                fill: "white",
                id: "planet-text-" + id.toString(),
                name: "planet-text",
                listening: false
            });

            text.offsetX(text.width() / 2)

            layer.add(text);
        });
    }

    initSpaceships() {

        let spaceships = this.ecs.searchEntities(["spaceship", "position", "spaceshipState"]);

        spaceships.forEach(id => {
            let layer = this.layer

            let {
                spaceship,
                position
            } = this.ecs.get(id)

            let shape = new Konva.Shape({
                x: position.x,
                y: position.y,
                id: "spaceship-" + id.toString(),
                name: "spaceship",
                fill: "#f1f8ff",
                stroke: "white",
                sceneFunc: (ctx, shape) => {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(5, 0);
                    ctx.lineTo(2.5, -7);

                    //ctx.quadraticCurveTo(150, 100, 260, 170);
                    ctx.closePath();
                    ctx.fillStrokeShape(shape);
                }
            })

            layer.add(shape)


            let text = new Konva.Text({
                x: position.x,
                y: position.y + 12,
                fontSize: 12,
                text: spaceship.desc,
                fill: "white",
                id: "spaceship-text-" + id.toString(),
                name: "spaceship-text",
                listening: false
            })

            text.offsetX(text.width() / 2)

            layer.add(text)



        })

    }

    init() {
        this.initKonva()
        this.initPlanets()
        this.initSpaceships()
    }



    updatePlanets(dt) {
        let planets = this.ecs.searchEntities(["planet", "position"]);

        planets.forEach(planetId => {

            let {
                position,
                planet
            } = this.ecs.get(planetId);


            //Move planet :
            let planetDraw = this.layer.findOne("#planet-" + planetId);

            planetDraw.setX(position.x)
            planetDraw.setY(position.y)


            //Move planet orbit :
            if (planet.parentId !== undefined) {
                let orbiteDraw = this.layer.findOne("#planet-orbite-" + planetId);
                let parentPosition = this.ecs.get(planet.parentId, "position");

                orbiteDraw.setX(parentPosition.x)
                orbiteDraw.setY(parentPosition.y)

                let scale = this.stage.getScale();

                orbiteDraw.setStrokeWidth(0.2 / scale.x);
            }


            //Move planet text: 
            let textDraw = this.layer.findOne("#planet-text-" + planetId);

            textDraw.setX(position.x)
            textDraw.setY(position.y + planet.size + 10)
            textDraw.offsetX(textDraw.width() / 2)
        });

    }

    updateSpaceships(dt) {
        let spaceships = this.ecs.searchEntities(["spaceship", "position", "spaceshipState"]);

        spaceships.forEach(id => {

            let {
                spaceship,
                position
            } = this.ecs.get(id)

            //Ship position
            let spaceshipDraw = this.layer.findOne("#spaceship-" + id);

            spaceshipDraw.setX(position.x)
            spaceshipDraw.setY(position.y)
            spaceshipDraw.rotation(position.angle + 90);


            //Ship text
            let textDraw = this.layer.findOne("#spaceship-text-" + id);

            textDraw.setX(position.x)
            textDraw.setY(position.y + 10)
            textDraw.offsetX(textDraw.width() / 2)

        });
    }



    updatePosition(dt) {
        let uiPlanet = get(planet);

        if (get(planet) !== undefined) {
       /*     this.stage.position({
                x: (uiPlanet.x ) * -1,
                y: (uiPlanet.y ) * -1
            })*/
        }


    }


    update(dt) {
        this.updatePlanets(dt);
        this.updateSpaceships(dt);
        this.updatePosition(dt);

        this.layer.batchDraw()

    }


}
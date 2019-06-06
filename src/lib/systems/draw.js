import {
    displayPlanet,
    planet
} from "../../svelte/stores.js"
import { get } from 'svelte/store';

export default class DrawSystem {

    constructor(ecs, payload) {
        this.ecs = ecs;
        this.payload = payload;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.layer;
        this.stage;
        this.scaleBy = 1.1;
    }


    distance(pointFrom, pointTo) {
        var xDist = pointFrom.x - pointTo.x;
        var yDist = pointFrom.y - pointTo.y;

        return Math.sqrt(xDist * xDist + yDist * yDist);
    }



    hidePannel() {
        displayPlanet.set(-1);
    }


    onClick(event) {
        let id = event.target.id();

        switch (true) {
            case id.startsWith("planet"):
                let entityId = parseInt(id.split("-")[1]);

                if (typeof entityId !== "number") {
                    throw new Error(`No entity found from id ${target.id()}`);
                }

                displayPlanet.set(entityId);
                break;

            default:
                this.hidePannel();
        }
    }


    //TODO: utiliser une fonction de leasing pour l'animation
    onScroll(e) {

        let stage = this.stage;

        e.evt.preventDefault();

        let oldScale = stage.scaleX();

        let mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        let newScale = e.evt.deltaY > 0 ? oldScale / this.scaleBy : oldScale * this.scaleBy;
        let newScaleText = e.evt.deltaY > 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy;

        stage.scale({
            x: newScale,
            y: newScale
        });

        let newPos = {
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        };

        let texts = stage.find("Text");

        texts.forEach(text => {
            text.scale({
                x: newScaleText,
                y: newScaleText
            })
        });

        let a = 1;

        stage.position(newPos);
        stage.batchDraw();
    }

    initKonva() {

        //this.width = document.getElementById("map").offsetWidth;

        let stage = new Konva.Stage({
            container: 'map',
            width: this.width,
            height: this.height,
            draggable: true
        });

        let layer = new Konva.Layer();

        stage.on('wheel', this.onScroll.bind(this));
        stage.on("click", this.onClick.bind(this))

        stage.add(layer);

        this.layer = layer;
        this.stage = stage;
    }

    initData() {
        this.planets = this.ecs.searchEntities(["planet", "position"]);
    }

    initPlanets() {

        this.planets.forEach(planetId => {
            let layer = this.layer;

            let {
                position,
                planet
            } = this.ecs.get(planetId);

            //Draw planet :
            let circle = new Konva.Circle({
                x: position.x,
                y: position.y,
                radius: planet.size,
                //stroke: "white",
                //strokeWidth: 2,
                id: "planet-" + planetId.toString(),
                name: "planet"
            });

            if (planet.name === "Sun") {
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

                let radius = this.distance(position, positionParent)

                layer.add(new Konva.Circle({
                    x: positionParent.x,
                    y: positionParent.y,
                    radius: radius,
                    stroke: "white",
                    strokeWidth: 0.3,
                    id: "planet-orbite-" + planetId.toString(),
                    name: "planet-orbite",
                    listening: false
                }));
            }

            //Drawn planet name :
            let text = new Konva.Text({
                x: position.x,
                y: position.y + planet.size + 10,
                fontSize: 12,
                text: planet.desc,
                fill: "white",
                id: "planet-text-" + planetId.toString(),
                name: "planet-text",
                listening: false
            });

            text.offsetX(text.width() / 2)

            layer.add(text);
        });
    }

    init() {
        this.initData()
        this.initKonva()
        this.initPlanets()
    }


    update(dt) {

        this.planets.forEach(planetId => {

            let {
                position,
                planet
            } = this.ecs.get(planetId);

            let planetDraw = this.layer.findOne("#planet-" + planetId);
            let orbiteDraw = this.layer.findOne("#planet-orbite-" + planetId);
            let textDraw = this.layer.findOne("#planet-text-" + planetId);


            if (!planetDraw) {
                throw new Error(`Error planet #planet-${planetId} doesn't exists in Konva`);
            }

            planetDraw.setX(position.x)
            planetDraw.setY(position.y)

            if (planet.parentId !== undefined) {
                let parentPosition = this.ecs.get(planet.parentId, "position");

                orbiteDraw.setX(parentPosition.x)
                orbiteDraw.setY(parentPosition.y)
            }

            textDraw.setX(position.x)
            textDraw.setY(position.y + planet.size + 10)
            textDraw.offsetX(textDraw.width() / 2)
        });


        if (get(displayPlanet) !== -1) {
            let id = get(planet).id;

            let position = this.ecs.get(id, "position");

            /*this.stage.move({
                x: position.x,
                y: position.y
            })*/

            window.stage = this.stage
        }


        this.layer.batchDraw()

    }
}
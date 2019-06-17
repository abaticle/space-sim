import Tools from "./../modules/tools";
import {
    planet
} from "./../ui/stores";
import {
    get
} from 'svelte/store';

export default class DrawSystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.layer;
        this.stage;
        this.scaleBy = 1.3;

        this.drawSelection = false;
        this.selectionFromX = 0;
        this.selectionFromY = 0;
        this.selectionToX = 0;
        this.selectionToY = 0;
    }

    /**
     * Click on planet : dispatch action to display it
     * @param {string} konvaId Konva object id
     */
    onDisplayPlanet(konvaId) {
        let planetId = parseInt(konvaId.split("-")[1]);

        if (typeof planetId !== "number") {
            throw new Error(`No entity found from id ${target.id()}`);
        }

        this.actions.addAction("displayPlanet", {
            planetId
        })
    }

    /**
     * Click on nothin : remove right panel
     */
    onRemovePanel() {
        this.actions.addAction("removePanel")
    }

    /**
     * Click on a planet/ship
     * @param {object} event Konva event
     */
    onClick(event) {
        let id = event.target.id();

        switch (true) {

            case id.startsWith("planet"):
                this.onDisplayPlanet(id);
                break;

            default:
                this.onRemovePanel();
                break;
        }
    }


    debug() {

        let text = new Konva.Text({
            x: 10,
            y: 40,
            fontSize: 12,
            text: "Scale: " + this.stage.getScale().x,
            fill: "white",
            listening: false
        });

        this.layer.add(text);
    }

    onMouseDown(event) {

        const isLeft = event.evt.button === 0;
        this.stage.draggable(!isLeft);        

        if (event.evt.button === 0) {

            const selection = this.layer.findOne("#selection");

            let scale = this.stage.getScale().x;

            //Start to draw selection
            if (!selection.getVisible()) {

                selection.setVisible(true)

                selection.setX(event.evt.offsetX / scale - this.stage.x() / scale)
                selection.setY(event.evt.offsetY / scale - this.stage.y() / scale)

                this.drawSelection = true;
            }

            else {

                selection.setWidth(100)
                selection.setHeight(100)

                //selection.setWidth(event.evt.offsetX / scale - this.stage.x() / scale - selection.getX())
                //selection.setHeight(event.evt.offsetY / scale - this.stage.y() / scale - selection.getY())
            }
        }

    }

    onMouseUp(event) {
        const selection = this.layer.findOne("#selection");

        selection.setVisible(false)
    }


    /**
     * Scroll 
     * TODO:Lease animation when zooming
     * @param {object} event Konva event
     */
    onScroll(event) {

        const stage = this.stage;

        event.evt.preventDefault();

        const oldScale = stage.scaleX();

        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = event.evt.deltaY > 0 ? oldScale / this.scaleBy : oldScale * this.scaleBy;

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

    /**
     * Init Konva canva
     * TODO:Update with and heigth when moving window
     */
    initKonva() {

        this.stage = new Konva.Stage({
            container: 'map',
            width: this.width,
            height: this.height
        });

        this.stage.on('contextmenu', event => {
            event.evt.preventDefault();
        })

        this.layer = new Konva.Layer({
            id: "planet-layer"
        });

        this.stage.on("mousedown", this.onMouseDown.bind(this))        
        this.stage.on("mouseup", this.onMouseUp.bind(this))
        this.stage.on('wheel', this.onScroll.bind(this));
        this.stage.on("click", this.onClick.bind(this))

        this.stage.add(this.layer);

        //TODO:Remove for build
        window.stage = this.stage;
        window.layer = this.layer;
    }

    /**
     * Draw planets
     */
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
                circle.shadowColor("#fff5b1")
                circle.shadowBlur(500)
            } else {
                circle.fill("#f1f8ff")
                //circle.stroke("white")
                //circle.strokeWidth(2)
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
                y: position.y + planet.size + 30,
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

    /**
     * Draw ships
     */
    initShips() {

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

    initSelection() {
        let selection = new Konva.Rect({
            id: "selection",
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            stroke: "white",
            strokeWidth: 1,
            visible: false
        })

        this.layer.add(selection)
    }

    /**
     * Init: draw everything
     */
    init() {
        this.initKonva()
        this.initPlanets()
        this.initShips()
        this.initSelection()
    }

    /**
     * Update planet/text/orbits positions
     * @param {number} dt 
     */
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
            textDraw.setY(position.y + (planet.size * 1.1))
            textDraw.offsetX(textDraw.width() / 2)
        });

    }

    /**
     * Update ships positions
     * @param {number} dt 
     */
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

    update(dt) {
        this.updatePlanets(dt)
        this.updateSpaceships(dt)

        this.layer.batchDraw()
    }


}
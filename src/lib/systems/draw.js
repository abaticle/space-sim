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

        //If selection, we can exit
        const selection = this.layer.findOne("#selection")

        if (!selection.getVisible()) {
            if (selection.getWidth() > 10) {
                return
            }
        }

        //Else 
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

    /**
     * Mouse move: update selection width and height
     * @param {object} event Konva event
     */
    onMouseMove(event) {
        const selection = this.layer.findOne("#selection");

        if (selection.getVisible()) {
            const scale = this.stage.getScale().x;

            selection.setWidth((event.evt.offsetX / scale - this.stage.x() / scale) - selection.getX())
            selection.setHeight((event.evt.offsetY / scale - this.stage.y() / scale) - selection.getY())

            this.layer.batchDraw()
        }
    }
    
    /**
     * Mouse down: 
     * - Start to draw selection
     * - Prevent from dragging
     * @param {object} event Konva event
     */
    onMouseDown(event) {

        const isLeft = event.evt.button === 0;

        this.stage.draggable(!isLeft);


        //Start to draw selection
        if (event.evt.button === 0) {

            const scale = this.stage.getScale().x;
            const selection = this.layer.findOne("#selection");
            
            if (!selection.getVisible()) {

                selection.setVisible(true)

                selection.setX(event.evt.offsetX / scale - this.stage.x() / scale)
                selection.setY(event.evt.offsetY / scale - this.stage.y() / scale)

                selection.setWidth(0)
                selection.setHeight(0)

            }

            this.layer.batchDraw()
        }

    }

    /**
     * Get selected entities 
     * @param {object} selection Selection rectangle
     */
    _getSelectedEntities(selection) {

        let shapes = [
            ...this.layer.find(".planet"),
            ...this.layer.find(".spaceship")
        ]

        return shapes
            .filter(shape => {
                const xInSelection = () => shape.getX() >= selection.getX() && shape.getX() <= (selection.getX() + selection.getWidth())
                const yInSelection = () => shape.getY() >= selection.getY() && shape.getY() <= (selection.getY() + selection.getWidth())

                return xInSelection() && yInSelection()
            })
            .map(shape => {
                const arr = shape.id().split("-");

                if (!arr[1]) {
                    throw new Error(`Error : shape ${shape.id()} should not be selected`)
                }
                return parseInt(arr[1], 0)
            })
    }

    /**
     * Mouse up: select entities within rectangle
     * @param {object} event Konva event
     */
    onMouseUp(event) {
        const selection = this.layer.findOne("#selection");

        if (selection.getVisible()) {
            const entities = this._getSelectedEntities(selection)

            if (entities.length > 0) {

                this.actions.addAction("selectedEntities", {
                    entities
                })
            }
        }

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
        this.stage.on("mousemove", this.onMouseMove.bind(this))
        this.stage.on("mouseup", this.onMouseUp.bind(this))
        this.stage.on('wheel', this.onScroll.bind(this));
        this.stage.on("click", this.onClick.bind(this))

        this.stage.add(this.layer);

        //TODO:Remove for build
        window.stage = this.stage;
        window.layer = this.layer;
    }

    /**
     * Draw planets:
     * - Each planet is a circle
     * - Each planet has an orbit
     * - Each planet has a text
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
     * - A ship is a triangle
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

    /**
     * Init selection rectangle (not visible)
     */
    initSelection() {
        let selection = new Konva.Rect({
            id: "selection",
            stroke: "white",
            visible: false,
            listening: false
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

            const {
                position,
                planet
            } = this.ecs.get(planetId);

            //Move planet :
            const planetDraw = this.layer.findOne("#planet-" + planetId);

            planetDraw.position({
                x: position.x,
                y: position.y
            })


            //Move planet orbit :
            if (planet.parentId !== undefined) {
                const orbiteDraw = this.layer.findOne("#planet-orbite-" + planetId);
                const parentPosition = this.ecs.get(planet.parentId, "position");

                orbiteDraw.position({
                    x: parentPosition.x,
                    y: parentPosition.y
                })

                const scale = this.stage.getScale();

                orbiteDraw.setStrokeWidth(0.2 / scale.x);
            }


            //Move planet text: 
            let textDraw = this.layer.findOne("#planet-text-" + planetId);

            textDraw.position({
                x: position.x,
                y: position.y + (planet.size * 1.1)
            })

            textDraw.offsetX(textDraw.width() / 2)
        });

    }

    /**
     * Update selection box
     * @param {number} dt 
     */
    updateSelection(dt) {
        
        const selection = this.layer.findOne("#selection")

        if (selection.getVisible()) {
            const scale = this.stage.getScale()

            selection.setStrokeWidth(0.5 / scale.x)
        }
    }

    /**
     * Update ships positions
     * @param {number} dt 
     */
    updateSpaceships(dt) {
        let spaceships = this.ecs.searchEntities(["spaceship", "position", "spaceshipState"]);

        spaceships.forEach(id => {

            const {
                spaceship,
                position
            } = this.ecs.get(id)

            //Ship position
            const spaceshipDraw = this.layer.findOne("#spaceship-" + id);

            spaceshipDraw.position({
                x: position.x,
                y: position.y
            })

            spaceshipDraw.rotation(position.angle + 90);


            //Ship text
            const textDraw = this.layer.findOne("#spaceship-text-" + id);

            textDraw.position({
                x: position.x,
                y: position.y + 10
            })

            textDraw.offsetX(textDraw.width() / 2)

        });
    }

    update(dt) {
        this.updatePlanets(dt)
        this.updateSpaceships(dt)
        this.updateSelection(dt)

        this.layer.batchDraw()
    }


}
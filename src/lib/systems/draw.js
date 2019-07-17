import Tools from "../modules/tools"
import constants from "../data/constants"
import {
    getAngleAsDegree
} from "../modules/vector"

export default class DrawSystem {

    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.layer
        this.stage
    }

    
    /**
     * Init: draw everything
     */
    init() {
        this.initKonva()
        this.initSelection()
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

        this.layer = new Konva.Layer({
            id: "planet-layer"
        });

        this.stage.on("mousedown", this.onMouseDown.bind(this))
        this.stage.on("mousemove", this.onMouseMove.bind(this))
        this.stage.on("mouseup", this.onMouseUp.bind(this))
        this.stage.on('wheel', this.onWheel.bind(this));
        this.stage.on("click", this.onClick.bind(this))
        this.stage.on('contextmenu', this.onContextmenu.bind(this))

        this.stage.add(this.layer);

        //TODO:Remove for build
        window.stage = this.stage;
        window.layer = this.layer;
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

    onContextmenu(event) {
        event.evt.preventDefault();
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

        let s = this.stage.getScale().x;
        window.mouseX = (event.evt.offsetX / s - this.stage.x() / s)
        window.mouseY = (event.evt.offsetY / s - this.stage.y() / s)

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


        let left, right, top, bottom;

        if (selection.getWidth() > 0) {
            left = selection.getX() - selection.getWidth()
            right = selection.getX()
        }
        else {
            left = selection.getX()
            right = selection.getX() - selection.getWidth()
        }

        console.log("left: ", left)
        console.log("right: ", right)

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

                this.onRemovePanel()

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
    onWheel(event) {

        const stage = this.stage;

        event.evt.preventDefault();

        const oldScale = stage.scaleX();

        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = event.evt.deltaY > 0 ? oldScale / constants.scaleBy : oldScale * constants.scaleBy;

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


    updateScales(oldScale = 1) {

    }

    /**
     * Draw a planet
     * - Each planet is a circle
     * - Each planet has an orbit
     * - Each planet has a text
     * @param {number} id  Planet id
     */
    drawPlanet(id) {
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
            id: "planet-" + id.toString(),
            name: "planet"
        });

        if (planet.desc === "Sun") {
            circle.fill("#fff5b1")
            circle.shadowColor("#fff5b1")
            circle.shadowBlur(500)
        } else {
            circle.stroke("white")
            circle.strokeWidth(8)
            //circle.fill("#f1f8ff")
        }

        layer.add(circle);


        //Draw planet orbit
        if (typeof planet.parentId === "number") {
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
    }

    /**
     * Draw a spaceship
     * - Each spaceship is a triangle
     * - Each spaceship has a text
     * @param {number} entityId 
     */
    drawSpaceship(entityId) {

        const size = constants.spaceshipSizeModifier
        const layer = this.layer
        const spaceship = this.ecs.get(entityId, "spaceship")

        let shape = new Konva.Shape({
            id: "spaceship-" + entityId.toString(),
            name: "spaceship",
            fill: "#f1f8ff",
            stroke: "black",
            offsetX: size / 2,
            offsetY: 0,
            sceneFunc: (ctx, shape) => {

                ctx.beginPath();
                ctx.moveTo(0, 0.5 * size);
                ctx.lineTo(size, 0);
                ctx.lineTo(0, -0.5 * size);
                ctx.closePath();
                ctx.fillStrokeShape(shape);

            }
        })

        layer.add(shape)


        let text = new Konva.Text({
            fontSize: 12,
            text: spaceship.desc,
            fill: "white",
            id: "spaceship-text-" + entityId.toString(),
            name: "spaceship-text",
            listening: false
        })

        text.offsetX(text.width() / 2)

        layer.add(text)
    }




    updatePlanet(id) {

        const {
            position,
            planet
        } = this.ecs.get(id);

        const scale = this.stage.getScale()


        //Move planet :
        const planetDraw = this.layer.findOne("#planet-" + id)

        planetDraw.position({
            x: position.x,
            y: position.y
        })

        planetDraw.setStrokeWidth(2 / scale.x)


        //Move planet text: 
        let textDraw = this.layer.findOne("#planet-text-" + id)

        textDraw.position({
            x: position.x,
            y: position.y + (planet.size * 1.1)
        })

        textDraw.offsetX(textDraw.width() / 2)


        //Move planet orbit :
        if (typeof planet.parentId === "number") {

            const orbiteDraw = this.layer.findOne("#planet-orbite-" + id)
            const parentPosition = this.ecs.get(planet.parentId, "position")

            orbiteDraw.position({
                x: parentPosition.x,
                y: parentPosition.y
            })            

            orbiteDraw.setStrokeWidth(0.2 / scale.x)
        }

    }


    /**
     * Update planet/text/orbits positions
     * @param {number} dt 
     */
    updatePlanets(dt) {
        let planets = this.ecs.searchEntities(["planet", "position"]);

        planets.forEach(id => {

            const planetDraw = this.layer.findOne("#planet-" + id)

            if (planetDraw === undefined) {
                this.drawPlanet(id)
            }

            else {
                this.updatePlanet(id)
            }
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


    updateSpaceship(id) {

        const {
            spaceship,
            position,
            velocity
        } = this.ecs.get(id)

        //Ship position and rotation
        const spaceshipDraw = this.layer.findOne("#spaceship-" + id)

        spaceshipDraw.position({
            x: position.x,
            y: position.y
        })

        spaceshipDraw.rotation(getAngleAsDegree(velocity))


        //Ship text
        const textDraw = this.layer.findOne("#spaceship-text-" + id)

        textDraw.position({
            x: position.x,
            y: position.y + constants.spaceshipSizeModifier + 10
        })

        textDraw.offsetX(textDraw.width() / 2)
    }

    /**
     * Update ships positions
     * @param {number} dt 
     */
    updateSpaceships(dt) {

        let spaceships = this.ecs.searchEntities(["spaceship", "position", "velocity"]);

        spaceships.forEach(id => {

            const spaceshipDraw = this.layer.findOne("#spaceship-" + id)

            if (spaceshipDraw === undefined) {
                this.drawSpaceship(id)
            }

            else {
                this.updateSpaceship(id)
            }

        });
    }

    /**
     * TODO:Tests vectors
     * @param {number} dt 
     */
    updateVectors(dt) {


        const vectors = this.ecs.searchEntities(["velocity", "position"])

        vectors.forEach(id => {

            const {
                position,
                velocity
            } = this.ecs.get(id)

            const size = 10;


            let shape = this.layer.findOne("#vector-" + id.toString())

            if (shape === undefined) {

                shape = new Konva.Shape({
                    id: "vector-" + id.toString(),
                    name: "vector",
                    fill: "#f1f8ff",
                    stroke: "white",
                    offsetX: (2 * size) / 2,
                    offsetY: 0,
                    x: position.x,
                    y: position.y,
                    //angle
                    sceneFunc: (ctx, shape) => {

                        ctx.beginPath();
                        ctx.moveTo(0, 1 * size);
                        ctx.lineTo(2 * size, 0);
                        ctx.lineTo(0, -1 * size);
                        ctx.closePath();
                        ctx.fillStrokeShape(shape);

                    }
                })

                layer.add(shape)
            } else {
                shape.position({
                    x: position.x,
                    y: position.y
                })

                shape.rotation(getAngleAsDegree(velocity))


            }
        })

    }

    update(dt) {

        this.updatePlanets(dt)
        this.updateSpaceships(dt)
        //this.updateVectors(dt)
        this.updateSelection(dt)

        this.layer.batchDraw()
    }


}
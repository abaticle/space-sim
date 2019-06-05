export default class DrawSystem {

    constructor(ecs) {
        this.ecs = ecs;
        
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

        let stage = new Konva.Stage({
            container: 'map',
            width: this.width,
            height: this.height,
            draggable: true
        });

        let layer = new Konva.Layer();        

        stage.on('wheel', this.onScroll.bind(this));
        
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
            layer.add(new Konva.Circle({
                x: position.x,
                y: position.y,
                radius: planet.size,
                stroke: "white",
                strokeWidth: 2,
                id: "planet-" + planetId.toString(),
                name: "planet"
            }));


            //Draw planet orbit
            if (planet.parentId !== undefined) {
                let positionParent = this.ecs.get(planet.parentId, "position")

                let radius = this.distance(position, positionParent)

                layer.add(new Konva.Circle({
                    x: positionParent.x,
                    y: positionParent.y,
                    radius: radius,
                    stroke: "white",
                    strokeWidth: 0.3    ,
                    id: "planet-orbite-" + planetId.toString(),
                    name: "planet"
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
                name: "planet-text"
            });

            text.offsetX(text.width() / 2);

            layer.add(text);
        });
    }

    init() {
        this.initData();
        this.initKonva();
        this.initPlanets();
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

        this.layer.batchDraw();
    }
}
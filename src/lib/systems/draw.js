export default class DrawSystem {

    constructor(ecs) {
        this.ecs = ecs;
        
        //this.canvas;
        //this.ctx;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    initKonva() {

        let stage = new Konva.Stage({
            container: 'map',   
            width: this.width,
            height: this.height
        });

        let layer = new Konva.Layer();

        let planets = this.ecs.searchEntities(["planet", "position"]);
        
        planets.forEach(planetId => {
            let { position, planet } = this.ecs.get(planetId);

            layer.add(new Konva.Circle({
                x: position.x,
                y: position.y,
                radius: planet.size,
                stroke: "white",
                strokeWidth: 2,
                id: planetId.toString()
            }));

            let text = new Konva.Text({                
                x: position.x,
                y: position.y + planet.size + 10,
                fontSize: 12,
                text: planet.desc,
                fill: "white"
            });
            
            text.offsetX(text.width() / 2);

            layer.add(text);
        });        
        
        stage.add(layer);

        this.layer = layer;
    }

    initData() {
        this.planets = this.ecs.searchEntities(["planet", "position"]);
    }

    init() {
        this.initKonva();
        this.initData();
    }


    update(dt) {         
        this.planets.forEach(planetId => {
            let { position, planet } = this.ecs.get(planetId);

            let circle = this.layer.findOne("#" + planetId);

            if (!circle) {
                throw new Error(`Error planet ${circle} doesn't exists in Konva`);
            }

            circle.setX(position.x)
            circle.setY(position.y)            
        });

        this.layer.draw();
    }

    /**
     * With vanilla canva :
     */
    initOld() {
        

        let canvas = document.createElement("canvas");
        let div = document.getElementById("map");
        let ctx = canvas.getContext("2d");

        this.canvas = canvas;
        this.ctx = ctx;

        canvas.width = this.width;
        canvas.height = this.height;
        div.appendChild(canvas);    
        
    }

    drawPlanetOld(x, y, size) {
        let ctx = this.ctx;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.stroke();
    }


    updateOld(dt) {
        let planets = this.ecs.searchEntities(["planet", "position"]);

        this.ctx.clearRect(0,0,this.width,this.height);

        planets.forEach(planetId => {

            let { position, planet } = this.ecs.get(planetId);

            this.drawPlanet(position.x, position.y, planet.size)

        })

        let ctx = this.ctx;


    }

}
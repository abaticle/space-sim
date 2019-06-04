export default class DrawSystem {

    constructor(ecs) {
        this.ecs = ecs;
        this.canvas;
        this.ctx;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }


    drawPlanet(x, y, size) {
        let ctx = this.ctx;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    init() {
        
        let canvas = document.createElement("canvas");
        let div = document.getElementById("map");
        let ctx = canvas.getContext("2d");

        this.canvas = canvas;
        this.ctx = ctx;

        canvas.width = this.width;
        canvas.height = this.height;
        div.appendChild(canvas);    

        /*
        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, 2 * Math.PI);
        ctx.stroke();
        */
    }

    update(dt) {
        let planets = this.ecs.searchEntities(["planet", "position"]);

        this.ctx.clearRect(0,0,this.width,this.height);

        planets.forEach(planetId => {

            let { position, planet } = this.ecs.get(planetId);

            this.drawPlanet(position.x, position.y, planet.size)

        })

        let ctx = this.ctx;


    }

}
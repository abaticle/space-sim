<script>
	import _ from "lodash";
	import Game from "./../lib/game";	
	import Planet from "./Planet.svelte";
 
	const game = new Game();
	let planets = [];

	game.init();

	game.subscribe((event, data) => {
		switch(event) {
			case "planets":
				planets = data;
				break;

			default:
				throw new Error(`event ${event} not handled`);
		}		
	})

	function handleMessage(event) {
		console.log(event);
	}

	window.game = game;
	window._ = _;
</script> 



<div class="container">
	{#each planets as planet} 
	<Planet planet={planet} on:message={handleMessage}></Planet>
	{/each}
</div>
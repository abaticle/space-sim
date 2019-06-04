<script>
	import _ from "lodash";
	import Game from "./../lib/game";	
	import Planet from "./Planet.svelte";
	import { onMount } from 'svelte';
 
	
	const game = new Game();
	let planets = [];

	function handleMessage(event) {
		console.log(event);
	}


	onMount(() => {
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
	})




	window.game = game;
	window._ = _;
</script> 

    <div class="columns"> 
    
        <div class="column is-one-third" id="map">
		</div>

	<!--
		<div class="column">
			{#each planets as planet} 
			<Planet planet={planet} on:message={handleMessage}></Planet>
			{/each}
		</div>
	-->
	
    </div>

<!--
<div class="container">
	{#each planets as planet} 
	<Planet planet={planet} on:message={handleMessage}></Planet>
	{/each}
</div>
-->
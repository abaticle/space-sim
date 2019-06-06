<script>
	import _ from "lodash";
	import Game from "./../lib/game";	
	import Planet from "./Planet.svelte";
	import { onMount } from 'svelte';
	import { displayPlanet } from "./stores"
 
	
	const game = new Game();

	function handleMessage(event) {
		console.log(event);
	}

	onMount(() => game.init());

	window.game = game;
	window._ = _;
	
</script> 


<style>
	.counter {
		position: fixed;
		top: 10px;
		left: 10px;
		color: white
	}
	.hidden {
		display: none;
	}
</style>


<div id="fpsCounter" class="counter"/>

<div class="columns"> 	

	<!-- Map -->
	<div class="column is-two-thirds" id="map"/>	


	<!-- Display planet -->
	{#if $displayPlanet !== -1}
	<div class="column">
		<Planet on:message={handleMessage}></Planet>
	</div>
	{/if}

</div>

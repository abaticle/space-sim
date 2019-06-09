<script>
	import _ from "lodash";
	import Game from "./../lib/game";	
	import Planet from "./Planet.svelte";
	import { onMount } from 'svelte';
	import { displayPlanet, planet } from "./stores"
	import { get } from 'svelte/store';
	import Tools from "./../lib/modules/tools";
 
	
	const game = new Game();

	function buyBuilding(payload) {
		const { planetId } = payload.detail;
		console.log(planetId);
	}

	onMount(() => game.init());

	window.game = game;
	window._ = _;
	window.planet = planet;
	window.get = get;
	window.Tools = Tools;
	
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
	.over-canvas {

	}
	.right-panel {
		z-index: 10;
		background-color: #1f2424;
		/*-webkit-box-shadow: 10px 11px 25px 0px rgba(0,0,0,0.75);
		-moz-box-shadow: 10px 11px 25px 0px rgba(0,0,0,0.75);
		box-shadow: 10px 11px 25px 0px rgba(0,0,0,0.75);*/
		position: fixed;
		right: 10px;
		top: 10px;
		border: 1px solid #8c9b9d;
		width: 40%;
    	padding: 1em;
		overflow: auto;
		max-height: 60%
	}
</style>


<div id="fpsCounter" class="counter"/>

<div class="columns"> 	

	<!-- Map -->
	<div id="map"/>	

	<!-- Display planet -->
	{#if $planet}
	<div class="right-panel"> 
		<Planet on:buyBuilding={buyBuilding}></Planet>
	</div>
	{/if}

</div>

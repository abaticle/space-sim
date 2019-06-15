<script>
	import _ from "lodash";
	import Game from "./../lib/game";	
	import Planet from "./Planet.svelte";
	import { onMount } from 'svelte';
	import { chooseBuilding, planet, speed } from "./stores"
	import { get } from 'svelte/store';
	import Tools from "./../lib/modules/tools";
	import ChooseBuilding from "./ChooseBuilding.svelte";
 
	
	const game = new Game();

	function buyBuilding(payload) {
		const { planetId } = payload.detail;
		
		chooseBuilding.set({
			planetId,
			visible: true
		})
	}

	speed.subscribe(value => {
		game.speed = value;
	})

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
	.right-panel {
		z-index: 10;
		position: fixed;
		right: 10px;
		top: 10px;
		width: 30%;
    	padding: 1em;
		overflow: auto;
		max-height: 60%
	}
	::-webkit-scrollbar{
		width:6px
	}
	::-webkit-scrollbar-track{
		background:#1f2424;
		border-radius:0px
	}
	::-webkit-scrollbar-thumb{
		background:#8c9b9d;
		border-radius:0px
	}
	.speed{
		padding-left: 1em;
		padding-right: 1em;
	}
</style>


<div id="fpsCounter" class="counter"/>

<div class="columns"> 	

	<!-- Map -->
	<div id="map"/>	

	<!-- Display planet -->
	
	<div class="right-panel"> 
		<div class="level">
            <div class="level-left">				
                <button class="button" on:click={() => $speed -= 5}>
					<span class="icon is-small">
						<i class="fas fa-backward"></i>
					</span>
				</button>			

				<h1 class="speed">{$speed}</h1>

                <button class="button" on:click={() => $speed += 5}>
					<span class="icon is-small">
						<i class="fas fa-forward"></i>
					</span>
				</button>
            </div>
        </div>
		{#if $planet}
			<Planet on:buyBuilding={buyBuilding}></Planet>
		{/if}
	</div>
	

</div>



<ChooseBuilding></ChooseBuilding>

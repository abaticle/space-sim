<script>
	import _ from "lodash"
	import Game from "./../game"
	import Planet from "./Planet.svelte"
	import { onMount } from 'svelte'
	import { chooseBuilding, planet, speed, entityList, spaceship } from "./stores"
	import { get } from 'svelte/store'
	import Tools from "./../modules/tools"
	import ChooseBuilding from "./ChooseBuilding.svelte"
	import ChooseProduction from "./ChooseProduction.svelte"
	import EntityList from "./EntityList.svelte"
	import Spaceship from "./Spaceship.svelte"
	import Debug from "./Debug.svelte"

	import { fly } from 'svelte/transition';
 
	const game = new Game()

	onMount(() => {
		game.init()

		/*speed.subscribe(value => {
			game.setSpeed(value);
		})*/
	});


	function entitySelected(event) {
		const { entity } = event.detail

		switch(entity.type) {
			case "planet":				
				game.actions.addAction("displayPlanet", {
					planetId: entity.entityId
				})
				break

			case "spaceship":			
				game.actions.addAction("displaySpaceship", {
					spaceshipId: entity.entityId
				})
				break
		}

	}



	function increaseSpeed() {
		game.actions.addAction("increaseSpeed")
	}
	function decreaseSpeed() {
		game.actions.addAction("decreaseSpeed")
	}
 
	function displayBuyBuilding(event) {
		game.actions.addAction("displayBuyBuilding", event.detail)
	}

	function displayChooseProduction(event) {
		game.actions.addAction("displayChooseProduction", event.detail)
	}

	function removeBuyBuilding() {
		game.actions.addAction("removeBuyBuilding")
	}

	function removeChooseProduction() {
		game.actions.addAction("removeChooseProduction")
	}

	function buyBuilding(event) {
		game.actions.addAction("buyBuilding", event.detail);
	}

	function chooseProduction(event) {
		game.actions.addAction("chooseProduction", event.detail);
	}
	

	window.game = game;
	window.ecs = game.ecs;
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
	
	.debug-panel {
		z-index: 10;
		position: fixed;
		left: 10px;
		bottom: 10px;		
    	padding: 1em;
		overflow: auto;
		max-height: 90%
	}
	.right-panel {
		z-index: 10;
		position: fixed;
		right: 10px;
		top: 10px;
    	padding: 1em;
		overflow: auto;
		max-height: 95%;
		max-width: 60%;
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


	<div class="debug-panel">
		<Debug></Debug>
	</div>

	<!-- right panel -->
	
	<div class="right-panel"> 
		<div class="level">
            <div class="level-left">
            </div>
            <div class="level-right">				
                <button class="button" on:click={() => decreaseSpeed()}>
					<span class="icon is-small">
						<i class="fas fa-backward"></i>
					</span>
				</button>			

				<h1 class="speed">{$speed}</h1>

                <button class="button" on:click={() => increaseSpeed()}>
					<span class="icon is-small">
						<i class="fas fa-forward"></i>
					</span>
				</button>
            </div>
        </div>


		{#if $planet}
		<Planet 
			on:displayBuyBuilding={displayBuyBuilding}
			on:displayChooseProduction={displayChooseProduction}>
		</Planet>
		{/if}	
	
		{#if $entityList.visible}
		<EntityList
			on:entitySelected={entitySelected}
		></EntityList>
		{/if}	

		{#if $spaceship}
		<Spaceship></Spaceship>
		{/if}
	</div>

		

		
</div>



<ChooseBuilding 
	on:removeBuyBuilding={removeBuyBuilding}
	on:buyBuilding={buyBuilding}>
</ChooseBuilding>

<ChooseProduction
	on:removeChooseProduction={removeChooseProduction}
	on:chooseProduction={chooseProduction}>
</ChooseProduction>
<script>
	import Game from "./../game"
	import Planet from "./game/Planet.svelte"
	import { onMount } from 'svelte'
	import { chooseBuilding, planet, speed, entityList, spaceship } from "./stores"
	import Tools from "./../modules/tools"
	import ChooseBuilding from "./game/ChooseBuilding.svelte"
	import ChooseProduction from "./game/ChooseProduction.svelte"
	import EntityList from "./game/EntityList.svelte"
	import Spaceship from "./game/Spaceship.svelte"
	import Debug from "./game/Debug.svelte"

 
	const game = new Game()

	onMount(() => {
		game.init()
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
	window.Tools = Tools;
	
</script> 


<div id="fpsCounter" class="counter"/>

<div class="columns"> 	

	<!-- Map -->
	<div id="map"/>	

	<div class="debug-panel">
		<Debug/>
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
			on:displayChooseProduction={displayChooseProduction}/>
		{/if}	
	
		{#if $entityList}
		<EntityList
			on:entitySelected={entitySelected}/>
		{/if}	

		{#if $spaceship}
		<Spaceship/>
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
<script>
	import _ from "lodash"
	import Game from "./../game"
	import Planet from "./Planet.svelte"
	import { onMount } from 'svelte'
	import { chooseBuilding, planet, speed, entityList } from "./stores"
	import { get } from 'svelte/store'
	import Tools from "./../modules/tools"
	import ChooseBuilding from "./ChooseBuilding.svelte"
	import ChooseProduction from "./ChooseProduction.svelte"
	import EntityList from "./EntityList.svelte"
 
	
	const game = new Game();

	function entitySelected(event) {
		//TODO
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

	speed.subscribe(value => {
		game.speed = value;
	})

	onMount(() => game.init());

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
	.right-panel {
		z-index: 10;
		position: fixed;
		right: 10px;
		top: 10px;
    	padding: 1em;
		overflow: auto;
		max-height: 90%
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

	<!-- right panel -->
	
	<div class="right-panel"> 
		<div class="level">
            <div class="level-left">
            </div>
            <div class="level-right">				
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
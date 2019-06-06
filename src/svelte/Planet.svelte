<script>
    import PlanetItems from "./PlanetItems.svelte";
    import PlanetBuildings from "./PlanetBuildings.svelte";

    export let planet = {};
</script>


<div class="section"> 
    <h1 class="title">{planet.name}</h1>

    <div class="columns">     
        <div class="column is-one-quarter">
            <h2 class="subtitle">Items</h2>
            <PlanetItems items={planet.items}></PlanetItems>	
        </div>

        <div class="column">
            <h2 class="subtitle">Buildings</h2>
            <PlanetBuildings on:message planet={planet._id} buildings={planet.buildings}></PlanetBuildings>
        </div>
    </div>
</div>
<script>
    import { createEventDispatcher } from 'svelte';
    import { chooseBuilding } from "./../stores"
    import items from "./../../data/items"

    const dispatch = createEventDispatcher();
</script>

{#if $chooseBuilding.visible}
<div class="modal is-active">
    <div class="modal-background"></div>
    <button class="modal-close is-large" aria-label="close" on:click={() => dispatch('removeBuyBuilding')}></button>
    <div class="modal-content">

        {#each $chooseBuilding.buildings as building} 
        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>{building.data.building.desc}</strong>
                            <br>
                            {building.data.building.longDesc}
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        {#each Object.keys(building.data.construction.price) as price}
                            {items[price].desc} : {building.data.construction.price[price]}<br>
                        {/each}
                    </nav>
                </div>
                {#if building.canConstruct}
                <div class="media-right">
                    <button class="button" on:click={() => dispatch('buyBuilding', {planetId: $chooseBuilding.planetId, buildingId: building.data.building.buildingId})}>Buy</button>
                </div>
                {/if}
            </article>
        </div>
        {/each}
        
    </div>
    
</div>
{/if}



<script>
    import { createEventDispatcher } from 'svelte';
    import { planet } from "./stores";
    import items from "./../data/items";

    const dispatch = createEventDispatcher();

    const workstepFormatter = (step, time) => {
        let percent = ((step * 100) / time) / 100;
        return percent.toFixed(2); 
    }    

    const numberFormatter = (number) => {
        //todo:à retirer / TEST
        return number

        if (number >= 1000) {
            return (number / 1000).toFixed(1) + " K"
        }
        else {
            return number
        }
    }

</script>

<style>
.alignRight{
    text-align: right
}
</style>


<h1 class="title alignRight">{$planet.desc}</h1>

{#if $planet.owned}
<div class="columns">    
    <div class="column">

        <!-- Planet items/resources :-->
        <h2 class="subtitle">Items</h2>
        {#if $planet.items.length === 0} 
            No item
        {:else}
        <table class="table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                {#each $planet.items as item}
                    <tr>
                        <td>{item.type}</td>
                        <td>{item.desc}</td>
                        <td class="alignRight">{numberFormatter(item.count)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>		
        {/if}
    </div>
</div>

<div class="columns">    
    <div class="column">
        <!-- Planet buildings -->
        <h2 class="subtitle">Buildings</h2>

        <!-- Buttons -->
        <div class="level">
            <div class="level-left">
                <button class="button is-primary" on:click={() => dispatch('displayBuyBuilding', {planetId:$planet.id})}>Buy new</button>
            </div>
        </div>

        {#if $planet.constructions.length > 0}
        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th>Building</th>
                    <th>Construction</th>
                </tr>
            </thead>
            <tbody>
                {#each $planet.constructions as construction}
                <tr>
                    <td>{construction.desc}</td>
                    <td><progress class="progress is-primary" value={workstepFormatter(construction.workstep, construction.time)}></progress></td>
                </tr>

                {/each}
            </tbody>
        </table>
        {/if}

        <!-- Building list-->
        {#if $planet.buildings.length === 0} 
            No buiding 
        {:else}
        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th>Building</th>
                    <th>Produce</th>
                    <th>Working</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>



            <!--
                TODO:Better choose production !
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" href="javascript:;">
                {building.produce}
                </a>

                <div class="navbar-dropdown">
                    <a class="navbar-item" href="javascript:;">
                        Iron ore
                    </a>
                    <a class="navbar-item" href="javascript:;">
                        Copper ore
                    </a>
                </div>
            </div>

            <button class="button is-text" on:click={() => dispatch('chooseBuildingProduction')}>
                {building.produce}
            </button>
            
            </td>
            -->
            

            {#each $planet.buildings as building}
                <tr>
                    <td>{building.desc}</td>
                    
                    <td>                    
                        <button class="button is-text" on:click={() => dispatch('displayChooseProduction', {buildingId: building.id})}>
                            {#if building.produce === ""} 
                            Nothing
                            {:else}
                            {building.produce}
                            {/if}                                
                        </button>
                    </td>
                        
                    <td>
                        {#if building.produce !== ""} 
                        <progress class="progress is-primary" value={workstepFormatter(building.workstep, building.time)}>
                        </progress>
                        {/if}
                    </td>
                    
                    <td><button class="button  is-text">Sell</button></td>
                </tr>
            {/each}
            </tbody>
        </table>	
        {/if}
    </div>
</div>
{/if}
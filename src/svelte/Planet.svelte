<script>
    import { createEventDispatcher } from 'svelte';
    import { planet } from "./stores";
    import items from "./../lib/data/items";

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


<h1 class="title">{$planet.desc}</h1>

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
                <button class="button is-primary" on:click={() => dispatch('buyBuilding', {planetId:$planet.id})}>Buy new</button>
            </div>
        </div>

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
            {#each $planet.buildings as building}
                <tr>
                    <td>{building.desc}</td>

                    {#if building.produce === ""} 
                    <td></td>
                    <td></td>
                    {:else}
                    <td>{building.produce}</td>
                    <td><progress class="progress is-primary" value={workstepFormatter(building.workstep, building.time)}></progress></td>
                    {/if}
                    <td><button class="button is-primary is-small">Sell</button></td>
                </tr>
            {/each}
            </tbody>
        </table>	
        {/if}
    </div>
</div>
{/if}
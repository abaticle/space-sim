<script>
    import { createEventDispatcher } from 'svelte';
    import { planet, displayPlanet } from "./stores";

    const dispatch = createEventDispatcher();

    const workstepFormatter = (step, time) => {
        let percent = ((step * 100) / time) / 100;
        return percent.toFixed(2); 
    }    
</script>

<style>
</style>


<h1 class="title">{$planet.desc}</h1>

<div class="columns">     

    <!-- Planet items :-->
    <div class="column is-one-quarter">
        <h2 class="subtitle">Items</h2>
        {#if $planet.items.length === 0} 
            No item
        {:else}
        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                {#each $planet.items as item}
                    <tr>
                        <td>{item.desc}</td>
                        <td>{item.count}</td>
                    </tr>
                {/each}
            </tbody>
        </table>		
        {/if}
    </div>

    <!-- Planet buildings -->
    <div class="column">
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
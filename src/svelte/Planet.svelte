<script>
    import { createEventDispatcher } from 'svelte';
    import { planet, displayPlanet } from "./stores";

    const dispatch = createEventDispatcher();

    const workstepFormatter = (step, time) => {
        let percent = ((step * 100) / time) / 100;
        return percent.toFixed(2); 
    }    
</script>


<div class="section"> 

    <h1 class="title">{$planet.name}</h1>

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
            <p>
                <!--<button class="button is-primary" on:click={() => dispatch('message', {planetId:planet})}>Buy new</button>-->
                <!--<ChooseBuilding></ChooseBuilding>-->
            </p>

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
                        <td>{building.produce}</td>
                        <td><progress class="progress is-primary" value={workstepFormatter(building.workstep, building.time)}></progress></td>
                        <td><button class="button is-primary is-small">Sell</button></td>
                    </tr>
                {/each}
                </tbody>
            </table>	
            {/if}
        </div>
    </div>
</div>
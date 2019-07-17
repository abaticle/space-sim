<script>
    import { createEventDispatcher } from 'svelte';
    import { planet } from "./../stores";

    const dispatch = createEventDispatcher();

    const workstepFormatter = (step, time) => {
        let percent = ((step * 100) / time) / 100;
        return percent.toFixed(2); 
    }    

    const numberFormatter = (number) => {
        switch (true) {
            case number >= 1000000:
                return (number / 1000000).toFixed(2) + "K"
            case number >= 1000:
                return (number / 1000).toFixed(2) + " K"
        
            default:
                return number
        }
    }

    const integerFormatter = (number) => {
        return number.toFixed(0)
    }

    const statFormatter = (stat) => {
        return stat.toFixed(2) + " /s"
    }

</script>

<style>
.alignRight{
    text-align: right
}
</style>

<div class="columns">    
    <div class="column ">
        <h2 class="title is-pulled-right">{$planet.desc}</h2>
    </div>
</div>

{#if $planet.owned}
<div class="columns">    
    <div class="column">

        <!-- Planet items/resources :-->
        <h2 class="subtitle is-pulled-right">Items</h2>
        {#if $planet.items.length === 0} 
            No item
        {:else}
        <table class="table is-pulled-right" width="100%">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Item</th>
                    <th class="alignRight">Count</th>
                    <th class="alignRight">Stats</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Electricity</td>
                    <td></td>
                    <td class="alignRight">{integerFormatter($planet.electricity)} / {$planet.maxElectricity}</td>
                    <td></td>
                </tr>
                {#each $planet.items as item}
                    <tr>
                        <td>{item.type}</td>
                        <td>{item.desc}</td>
                        <td class="alignRight">{numberFormatter(item.count)}</td>
                        <td class="alignRight">{statFormatter(item.stat)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>		
        {/if}
    </div>
</div>

<div class="columns">    
    <div class="column">
    
        <h2 class="subtitle is-pulled-right">Buildings</h2>

        <!-- Buttons -->
        <div class="level">
            <div class="level-left">
                <button class="button is-primary" on:click={() => dispatch('displayBuyBuilding', {planetId:$planet.id})}>Buy new</button>
            </div>
        </div>

        <!-- Constructions -->
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

        <!-- Buildings-->
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
                    
                    <td>               
                        {#if building.produce !== undefined}     
                            <a href="javascript:void(0)" on:click={() => dispatch('displayChooseProduction', {buildingId: building.id})}>
                            {#if building.produce === ""} 
                                Nothing
                            {:else}
                                {building.produce}
                            {/if}                                
                            </a>
                        {/if}
                    </td>
                        
                    <td>
                    {#if building.produce !== undefined}     
                        {#if building.produce !== ""} 
                            <progress class="progress is-primary" value={workstepFormatter(building.workstep, building.time)}>
                            </progress>
                        {/if}
                    {/if}
                    </td>
                    
                    <td>
                        <a href="javascript:void(0)">    
                            Sell
                        </a>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>	
        {/if}
    </div>
</div>
{/if}
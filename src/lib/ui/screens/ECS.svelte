<script>
    import { screen, ecs } from "./../stores"
    import { tick } from "svelte"
    
    export let game; 

    const displayGame = () => {
        screen.set("game")
    }
</script>

{#if $ecs}

<table class="table">
    <thead>
        <tr>
            <th>Entity</th>
            {#each Object.values($ecs.components) as component}
                <th>{component.name}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each $ecs.entities as id}
            <tr>
                <td>{id}</td>
                {#each Object.values($ecs.components) as component}
                    {#if $ecs.entitiesComponents[component.name][id] !== undefined}
                    <td>
                        {JSON.stringify($ecs.entitiesComponents[component.name][id])}
                    </td>
                    {:else}
                    <td>
                    </td>
                    {/if}
                {/each}                            
            </tr>
        {/each}
    </tbody>
</table>	
{/if}


<div class="debug-panel">
    <div class="columns"> 
        <div class="column">
            <div class="level">
                <div class="level-left">
                    <button class="button is-light" on:click={displayGame}>Game View</button>
                </div>
            </div>        
        </div>
    </div>
</div>
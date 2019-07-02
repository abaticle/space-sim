<script>
    import { screen, ecs } from "./../stores"
    import { tick } from "svelte"
    
    export let game; 

    const displayGame = () => {
        screen.set("game")
    }
</script>

{#if $ecs}

<div class="container">
    <h1 class="title">Components groups</h1>
    
    {#each Object.entries($ecs._cache) as [key, val] }
    <div class="notification">
        <h1 class="subtitle">{key.split("|").join(" / ")}</h1>
        <ul>
        {#each val as id}
            <li>{id}</li>
        {/each}
        </ul>
    
    </div>
    {/each}    
</div>
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
<script>
import { createEventDispatcher } from 'svelte'
import { debug, screen } from "./../stores"

const dispatch = createEventDispatcher();

const displayECS = () => {
    screen.set("ecs")
}


</script>



<div class="columns"> 
    <div class="column">
        {#each $debug.data as data}
        <b>{data.name}</b>: {data.value}
        <br>
        {/each}
    </div>
</div>
<div class="columns"> 
    <div class="column">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <button class="button is-light" on:click={displayECS}>ECS View</button>
                </div>
                <div class="level-item">
                    <button class="button is-light" on:click={() => dispatch("save")}>Save</button>
                </div>
                <div class="level-item">
                    <button class="button is-light" on:click={() => dispatch("load")}>Load</button>
                </div>
            </div>
        </div>        
    </div>
</div>
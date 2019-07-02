<script>
import { debug, screen } from "./../stores"

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
                <button class="button is-light" on:click={displayECS}>ECS View</button>
            </div>
        </div>        
    </div>
</div>
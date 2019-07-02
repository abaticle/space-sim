<script>
import { debug as debugStore } from "./../stores"

</script>



<div>
    DEBUG:
    <br>
    {#each $debugStore.data as data}
    <b>{data.name}</b>: {data.value}
    
    <br>
    {/each}

</div>
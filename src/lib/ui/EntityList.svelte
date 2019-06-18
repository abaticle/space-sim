<script>
    import { createEventDispatcher } from 'svelte'
    import { entityList } from "./stores"

    const dispatch = createEventDispatcher();

</script>


<div class="columns">    
    <div class="column">

        <h2 class="subtitle">Selected</h2>

        <table class="table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Desc</th>
                </tr>
            </thead>
            <tbody>
                {#each $entityList.entities as entity}
                    <tr>
                        <td>{entity.type}</td>
                        <td>{entity.desc}</td>
                    </tr>
                {/each}
            </tbody>
        </table>	
    </div>
</div>
<script>
    import { createEventDispatcher } from 'svelte'
    import { entityList } from "./../stores"

    const dispatch = createEventDispatcher();
</script>

<div class="columns">    
    <div class="column ">
        <h2 class="subtitle is-pulled-right">Selected</h2>
    </div>
</div>

<div class="columns">    
    <div class="column">
        <table class="table is-pulled-right">
            <thead>
                <tr>
                    <th>Desc</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {#each $entityList.entities as entity}
                    <tr>
                        <td>
                            <a href="javascript:void(0)" on:click={() => dispatch("entitySelected", {entity})}>
                                {entity.desc}
                            </a>
                        </td>
                        <td>{entity.type}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
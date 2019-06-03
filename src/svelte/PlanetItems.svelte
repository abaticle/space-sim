<script>
    export let items = [];
</script>



{#if items.length === 0} 
    No items 
{:else}
<table class="table is-fullwidth">
    <thead>
        <tr>
            <th>Item</th>
            <th>Count</th>
        </tr>
    </thead>
    <tbody>
        {#each items as item}
            <tr>
                <td>{item.desc}</td>
                <td>{item.count}</td>
            </tr>
        {/each}
    </tbody>
</table>		
{/if}
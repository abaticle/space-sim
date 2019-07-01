<script>
    import { createEventDispatcher } from 'svelte';
    import { spaceship } from "./stores";

    const dispatch = createEventDispatcher();    
</script>

<div class="columns">    
    <div class="column ">
        <h2 class="title is-pulled-right">{$spaceship.spaceship.desc}</h2>
    </div>
</div>  


<h2 class="subtitle">Speed: {$spaceship.spaceship.speed}</h2>


<div class="columns">    
    <div class="column ">
        <h2 class="subtitle is-pulled-right">Orders</h2>

        <table class="table is-pulled-right" width="100%">
            <thead>
                <tr>
                    <th></th>
                    <th>State</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each $spaceship.orders as order, index}
                    <tr class="{$spaceship.stateIndex === index ? 'is-selected' : ''}">
                        <td>{index + 1}</td>
                        <td>{order.state}</td>
                        <td>{order.desc}</td>
                    </tr>
                {/each}
            </tbody>        
        </table>
    </div>
</div>  

<div class="columns">    
    <div class="column">

        <!-- Planet items/resources :-->
        <h2 class="subtitle is-pulled-right">Items</h2>

        {#if $spaceship.items.length === 0} 
            No item
        {:else}
        
        <table class="table is-pulled-right" width="100%">
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="alignRight">Count</th>
                </tr>
            </thead>
            <tbody>
                {#each $spaceship.items as item}
                    <tr>
                        <td>{item.desc}</td>
                        <td class="alignRight">{item.count}</td>
                    </tr>
                {/each}
            </tbody>
        </table>		
        {/if}
    </div>
</div>


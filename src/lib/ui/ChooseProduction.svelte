<script>
    import { createEventDispatcher } from 'svelte';
    import { chooseProduction } from "./stores"
    import items from "./../data/items"

    const dispatch = createEventDispatcher();
</script>



{#if $chooseProduction.visible}
<div class="modal is-active">
    <div class="modal-background"></div>
    <button class="modal-close is-large" aria-label="close" on:click={() => dispatch('removeChooseProduction')}></button>
    <div class="modal-content">


        <div class="box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Nothing</strong>
                        </p>
                    </div>
                </div>
                <div class="media-right">
                    <button class="button" on:click={() => dispatch('chooseProduction', {buildingId: $chooseProduction.buildingId, produce: ""})}>Choose</button>
                </div>
            </article>
        </div>        

        {#each $chooseProduction.items as item} 
        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>{item.desc}</strong>
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        {#each Object.keys(item.recipe) as recipe}
                            {items[recipe].desc} : {item.recipe[recipe]}<br>
                        {/each}
                    </nav>
                </div>
                <div class="media-right">
                    <button class="button" on:click={() => dispatch('chooseProduction', {buildingId: $chooseProduction.buildingId, produce: item.id})}>Choose</button>
                </div>
            </article>
        </div>
        {/each}
        
    </div>
    
</div>
{/if}
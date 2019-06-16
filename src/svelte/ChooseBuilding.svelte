<script>
    import buildings from "../lib/data/buildings";
    import { chooseBuilding } from "./stores"
</script>

{#if $chooseBuilding.visible}
<div class="modal is-active">
    <div class="modal-background"></div>
    <button class="modal-close is-large" aria-label="close" on:click={() => chooseBuilding.set({planetId: undefined, visible: false})}></button>
    <div class="modal-content">

        {#each buildings as building} 
        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>{building.desc}</strong>
                            <br>
                            Used to extract resource from planet, and can extract 1 resource per seconds.
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        5 Iron bar<br>
                        10 Copper bar
                    </nav>
                </div>
            </article>
        </div>
        {/each}
        
    </div>
    
</div>
{/if}



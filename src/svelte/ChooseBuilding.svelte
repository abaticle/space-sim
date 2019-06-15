<script>
    import buildings from "../lib/data/buildings";
    import { chooseBuilding } from "./stores"
</script>

{#if $chooseBuilding.visible}
<div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
        
        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Extractor MK1</strong>
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


        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Extractor MK2</strong>
                            <br>
                            Used to extract resource from planet, and can extract 2 resource per seconds.
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        50 Iron bar<br>
                        100 Copper bar
                    </nav>
                </div>
            </article>
        </div>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Extractor MK1</strong>
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


        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Extractor MK2</strong>
                            <br>
                            Used to extract resource from planet, and can extract 2 resource per seconds.
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        50 Iron bar<br>
                        100 Copper bar
                    </nav>
                </div>
            </article>
        </div>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Extractor MK1</strong>
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


        <div class="box">
            <article class="media">
                <div class="media-left">
                    img
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>Extractor MK2</strong>
                            <br>
                            Used to extract resource from planet, and can extract 2 resource per seconds.
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        50 Iron bar<br>
                        100 Copper bar
                    </nav>
                </div>
            </article>
        </div>

    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => chooseBuilding.set({planetId: undefined, visible: false})}></button>
</div>
{/if}



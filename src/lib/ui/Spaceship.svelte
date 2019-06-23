<script>
    import { createEventDispatcher } from 'svelte';
    import { spaceship } from "./stores";

    const dispatch = createEventDispatcher();    
</script>


<h1 class="title alignRight">{$spaceship.spaceship.desc}</h1>

<h2 class="subtitle">Speed: {$spaceship.spaceship.speed}</h2>

{#if $spaceship.spaceshipState.length}
    <h2 class="subtitle">State: {$spaceship.spaceshipState.states[0].state}</h2>
{/if}



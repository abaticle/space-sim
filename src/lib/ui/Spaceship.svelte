<script>
    import { createEventDispatcher } from 'svelte';
    import { spaceship } from "./stores";

    const dispatch = createEventDispatcher();


</script>


<h1 class="title alignRight">{$spaceship.desc}</h1>

<h2 class="subtitle">Speed: {$spaceship.speed}</h2>



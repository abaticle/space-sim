<script>
    import ScreenGame from "./screens/Game.svelte"
    import ScreenECS from "./screens/ECS.svelte"
    import { screen as screenStore } from "./stores"
    import Game from "./../game"
	import { onMount } from 'svelte'



    const game = new Game()

    onMount(() => {
		game.init()
	});

</script>

{#if $screenStore === "game"}
<ScreenGame game={game}/>
{:else if $screenStore === "ecs"}
<ScreenECS/>
{/if}
<script>
    import ScreenGame from "./screens/Game.svelte"
    import ScreenECS from "./screens/ECS.svelte"
    import { screen } from "./stores"
    import Game from "./../game"
	import { onMount } from "svelte"



    const game = new Game()

    onMount(() => {
		game.init()
	});

</script>

<div id="game" class="{ $screen !== 'game' ? 'hidden' : '' }">
    <ScreenGame game={game} />
</div>

<div id="ecs" class="{ $screen !== 'ecs' ? 'hidden' : '' }">
    <ScreenECS game={game}/>
</div>


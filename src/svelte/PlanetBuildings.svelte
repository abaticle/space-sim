<script>
    import { createEventDispatcher } from 'svelte';
    import ChooseBuilding from "./ChooseBuilding.svelte";

    export let buildings = [];
    export let planet = 0;

    const dispatch = createEventDispatcher();

    const formatter = (step, time) => {
        let percent = ((step * 100) / time) / 100;
        return percent.toFixed(2); 
    }

</script>

<style>
</style>


<p>
    <button class="button is-primary" on:click={() => dispatch('message', {planetId:planet})}>Buy new</button>
    <ChooseBuilding></ChooseBuilding>
</p>

<table class="table is-fullwidth">
    <thead>
        <tr>
            <th>Building</th>
            <th>Produce</th>
            <th>Working</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    {#each buildings as building}
        <tr>
            <td>{building.desc}</td>
            <td>{building.produce}</td>
            <td><progress class="progress is-primary" value={formatter(building.workstep, building.time)}></progress></td>
            <td><button class="button is-primary is-small">Sell</button></td>
        </tr>
    {/each}
    </tbody>
</table>
import App from './svelte/App.svelte';
import _ from "lodash"

window._ = _;


var app = new App({
	target: document.body
});



export default app;
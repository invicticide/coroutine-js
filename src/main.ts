// Basic demonstration of a realtime update + simple nestable coroutine implementation
;(function() {

	// Create a default page element that will show a realtime timer, for verifying
	// the realtime update loop
	let timerElement : Element = document.createElement("p");
	document.body.appendChild(timerElement);

	// Helper function to log messages to the document, instead of just the js console
	function log(text : string)
	{
		let p : Element = document.createElement("p");
		p.textContent = text;
		document.body.appendChild(p);
		console.log(text);
	}

	// Create the coroutine stack and start the initial coroutine instance
	let tasks : Array<Generator> = [ waitForSeconds(5) ];

	// Implementation of the coroutine
	function* waitForSeconds(seconds : number)
	{
		log(`Begin waitForSeconds(${seconds})`);
		
		let waitUntil : number = window.performance.now() + (seconds * 1000);
		while(window.performance.now() < waitUntil) { yield; }
		
		log(`First wait done, now invoking chained wait`);

		yield waitForMilliseconds(seconds * 1000);

		log(`End waitForSeconds`);
	}

	// A different coroutine, for verifying nesting
	function* waitForMilliseconds(ms : number)
	{
		log(`Begin waitForMilliseconds(${ms})`);

		let waitUntil : number = window.performance.now() + ms;
		while(window.performance.now() < waitUntil) { yield; }

		log(`End waitForMilliseconds`);
	}

	// Realtime update (60 fps or whatever the browser can handle). This just updates
	// a timer element on the page to show that we're refreshing in realtime.
	function update(dt : number)
	{
		timerElement.textContent = `dt: ${dt}\nnow: ${window.performance.now()}`;
	}

	// Main "application" loop
	let lastMainTime : number = window.performance.now();
	function main(now : number)
	{
		// Queue the next main loop iteration
		requestAnimationFrame(main);

		// Calculate delta time since last main loop iteration
		let dt : number = now - lastMainTime;

		// Realtime update (60 fps or whatever the browser can handle)
		update(dt);

		// Pump coroutines. We keep a "stack" to support nesting coroutine instances,
		// and we only pump the most recent (innermost nested) coroutine on the stack.
		if(tasks.length > 0)
		{
			let result = tasks[tasks.length - 1].next();
			if(result.done) { tasks.pop(); }
			else if(result.value) { tasks.push(result.value); }
		}

		// TODO: Sleep for vsync. This loop uses max cpu right now!

		lastMainTime = now;
	}
	main(window.performance.now());

})();

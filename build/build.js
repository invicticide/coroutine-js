require("source-map-support").install(); // Generate source maps

var cp = require("child_process"); // Run commands in a separate process
var fs = require("fs"); // File system API
var path = require("path"); // File system path manipulation
var rimraf = require("rimraf"); // Recursive directory deletion
var clc = require("cli-color"); // Debug console text formatting

const { performance } = require("perf_hooks"); // Access to high-performance timer
let startTime = performance.now();

// True on Windows, false on Mac/Linux, for platform-specific calls
var isWindows = /^win/.test(process.platform);

/**
 * Compiles the engine files. Typings files should've been built before this.
 */
function BuildScripts()
{
	let result = cp.spawnSync(
		(isWindows ? `node_modules\\.bin\\tsc.cmd` : `node_modules/.bin/tsc`),
		[], { env : process.env }
	);
	
	// If result.error is set, then node failed launching the process or the process timed out. This isn't a tsc error.
	if(result.error)
	{
		console.error(clc.red(`\n${result.error}`));
		process.exit(1); // result.status is not valid in this case
	}
	
	// I've never seen tsc write to stderr, but node might, so we need to at least echo it.
	if(result.stderr !== null)
	{
		let s = result.stderr.toString();
		if(s.length > 0) { console.error(clc.red(`\n${s}`)); }
	}

	// tsc return codes: https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts (search `enum ExitStatus`)
	// Currently both 0 and 2 produce outputs (0 is clean, 2 has warnings) and only 1 is actually an error result.
	if(result.status === 1)
	{
		// tsc doesn't write to stderr; its errors are all on stdout, because... reasons?
		if(result.stdout !== null)
		{
			let s = result.stdout.toString();
			if(s.length > 0) { console.error(clc.red(`\n${s}`)); }
		}
		process.exit(result.status);
	}
	else
	{
		// tsc may emit error messages but still succeed if those error types are disabled in the tsconfig.
		// We'll rewrite those as warnings here, for clarity.
		if(result.stdout !== null)
		{
			let s = result.stdout.toString();
			if(s.length > 0) { console.log(clc.yellow(`\n${s.split(": error TS").join(": warning TS")}`)); }
		}
	}
}

/**
 * Deletes the given directory and everything in it. It's basically "rm- rf".
 * @param {string} path The directory path to clean
 */
function CleanDirectory(dir)
{
	if(path.relative(".", dir).startsWith(".."))
	{
		console.error(clc.red(`Refusing to clean directory '${path.resolve(dir)}' since it lies outside the project (${path.resolve(".")})`));
		return;
	}
	if(fs.existsSync(dir)) { rimraf.sync(dir, {}); }
	fs.mkdirSync(dir);
	console.log(`  ${dir}/**`);
}

/**
 * Main entry point
 */
;(function() {
	console.log("Removing old build artifacts...");
	var tsconfig = JSON.parse(fs.readFileSync("tsconfig.json"));
	CleanDirectory(tsconfig.compilerOptions.outDir); // Clean scripts
	CleanDirectory(tsconfig.compilerOptions.declarationDir); // Clean type declarations

	console.log("Building scripts...");
	BuildScripts();

	console.log("Copying assets...");
	fs.copyFileSync("src/index.html", path.resolve(tsconfig.compilerOptions.outDir, "index.html"));
	
	let duration = (performance.now() - startTime) / 1000;
	let durationString = duration.toLocaleString(undefined, { useGrouping: true, maximumFractionDigits: 2 });
	console.log(clc.green(`\nBuild finished in ${durationString} seconds\n`));
})();

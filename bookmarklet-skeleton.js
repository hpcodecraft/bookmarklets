/*
 * jQuery Bookmarklet - version 1.0
 * Originally written by: Brett Barros
 * Heavily modified by: Paul Irish
 * Again modified by: Volker Wieban
 *
 * If you use this script, please link back to the source
 *
 * Copyright (c) 2010 Latent Motion (http://latentmotion.com/how-to-create-a-jquery-bookmarklet/)
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 *
 */

if( !window.bookmarklet ) {

	window.bookmarklet = {
		opts: {
			css : ['http://absolute/path/to/stylesheet.css'],
			js  : [] // extra js files go here
	  	//jqpath : 'myCustomjQueryPath.js', <-- option to include your own jquery
		},

		init: function() {
			// YOUR INIT CODE (e.g. append HTML)
			// executed ONCE at first run
			console.log('bookmarklet init');
		},
		run: function() {
			// YOUR RUN CODE
			// executed every time user calls the bookmarklet
			console.log('bookmarklet run');
		},

		// setup function
		// no need to touch this, usually
		domagic: function() { // expelliamus!
			opts = this.opts;
			// User doesn't have to set jquery, we have a default.
			opts.jqpath = opts.jqpath || "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
			function getjQuery(filename) {
				// Create jQuery script element
				var fileref = document.createElement('script');
				fileref.type = 'text/javascript';
				fileref.src =  filename;
				// Once loaded, trigger other scripts and styles
				fileref.onload = function(){
					getCSS(opts.css); // load CSS files
					getJS(opts.js); // load JS files
				};
				document.body.appendChild(fileref);
			}
			// Synchronous loop for css files
			function getCSS(csfiles){
				$.each(csfiles, function(i, val){
					$('<link>').attr({
						href: val,
						rel: 'stylesheet'
					}).appendTo('body');
				});
			}
			function getJS(jsfiles){
				// Check if we've processed all of the JS files (or if there are none)
				if (jsfiles.length === 0) {
					window.bookmarklet.init();
					window.bookmarklet.run();
					return false;
				}
				// Load the first js file in the array
				$.getScript(jsfiles[0], function(){
					// When it's done loading, remove it from the queue and call the function again
					getJS(jsfiles.slice(1));
				});
			}
			getjQuery(opts.jqpath); // kick it off
		}
	};
	window.bookmarklet.domagic();
}
else window.bookmarklet.run();

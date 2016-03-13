/*
 * jQuery Bookmarklet - version 1.0
 * Originally written by: Brett Barros
 * Heavily modified by: Paul Irish
 *
 * If you use this script, please link back to the source
 *
 * Copyright (c) 2010 Latent Motion (http://latentmotion.com/how-to-create-a-jquery-bookmarklet/)
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 *
 */

window.bookmarklet = function(opts){fullFunc(opts)};

// These are the styles, scripts and callbacks we include in our bookmarklet:
window.bookmarklet({

  css : ['http://localhost:8888/hpcodecraft.me/subdomains/bookmarklets.hpcodecraft.me/rulr/Rulr.css'],
  js  : ['http://localhost:8888/hpcodecraft.me/subdomains/bookmarklets.hpcodecraft.me/rulr/ZeroClipboard.min.js'],
  swf : ['http://localhost:8888/hpcodecraft.me/subdomains/bookmarklets.hpcodecraft.me/rulr/ZeroClipboard.swf'],
  ready : function( swf ) {
    if($('#Rulr-Container').length > 0) return false;

    var MODE_NOOP   = 0,
        MODE_SELECT = 1,
        MODE_COPY   = 2,
        mode        = MODE_NOOP,
        clip;

		var Selection = {
			start: { x: 0, y: 0 },
			end  : { x: 0, y: 0 },
			visible: false
		}

		var Mouse = {
			x: 0,
			y: 0,
			get: function( e ) {
				this.x = e.pageX;
				this.y = e.pageY;
			}
		}

		function scrollHandler() {
			if(Selection.visible) {
				$('#Rulr-Data-top').html( ( Selection.start.y + window.scrollY )+'px' );
				$('#Rulr-Data-left').html( ( Selection.start.x + window.scrollX )+'px' );
				setClipText();
			}
			else {
				$('#Rulr-Data-top').html( ( Mouse.y + window.scrollY )+'px' );
				$('#Rulr-Data-left').html( ( Mouse.x + window.scrollX )+'px' );
			}
		}

		function setClipText() {
			var cliptext = 'top: '+$('#Rulr-Data-top').text()+";\n"+
										 'left: '+$('#Rulr-Data-left').text()+";\n"+
										 'width: '+$('#Rulr-Data-width').text()+";\n"+
										 'height: '+$('#Rulr-Data-height').text()+";";
			clip.setText( cliptext );
		}

    function getInfoHTML( top, left, width, height ) {
      return '<p>\
      <label>top:</label><span id="Rulr-Data-top">'+top+'px</span>\
      <label>left:</label><span id="Rulr-Data-left">'+left+'px</span>\
      <label>width:</label><span id="Rulr-Data-width">'+width+'px</span>\
      <label>height:</label><span id="Rulr-Data-height">'+height+'px</span>\
      </p>';
    }

		function closeRulr() {
      $('#Rulr-Container').fadeOut(250, function(){
        $(this).remove();
        $('#global-zeroclipboard-html-bridge').remove();
      });
		}


    // Zeroclipboard handlers
    function clipOver(client, args) {
      if( Selection.visible && mode == MODE_NOOP ) mode = MODE_COPY;
      $('#Rulr-Helper-x,#Rulr-Helper-y').hide();
      return false;
    }

    function clipOut(client, args) {
      if( mode == MODE_COPY ) mode = MODE_NOOP;
      $('#Rulr-Helper-x,#Rulr-Helper-y').show();
      return false;
    }

    function clipComplete(client, args) {
      if( mode == MODE_COPY ) {
        $('#Rulr-Copy-Success').addClass('animated');
        setTimeout(function() {
          $('#Rulr-Copy-Success').removeClass('animated');
        }, 500);
      }
      return false;
    }

    function clipDatarequested(client, args) {
      if( mode == MODE_COPY ) setClipText();
    }


		// append Bookmarklet HTML to website
    $('body').append('<div id="Rulr-Container">\
				<div id="Rulr-Tutorial">Click and drag to draw a selection.</div>\
				<div id="Rulr-Copy-Success">&#10004;</div>\
        <div id="Rulr-Close">&#215;</div>\
        <div id="Rulr-Data">'+getInfoHTML(0,0,0,0)+'</div>\
				<div id="Rulr-Copy-Hint">Click to copy &rarr;</div>\
        <div id="Rulr-Selection"></div>\
        <div id="Rulr-Helper-x"></div>\
        <div id="Rulr-Helper-y"></div>\
      </div>'
    );

    $('#Rulr-Close').click(closeRulr);

		// setup ZeroClipBoard
    ZeroClipboard.setDefaults({
      moviePath: swf,
      trustedOrigins: [window.location.protocol + "//" + window.location.host]
    });

    clip = new ZeroClipboard();
		clip.on('complete', clipComplete);
    clip.on('dataRequested', clipDatarequested);
    clip.on('mouseover',clipOver);
    clip.on('mouseout',clipOut);

    clip.on( 'noflash', function ( client, args ) {
      alert("Flash is not installed. Click-to-copy will not work.");
    });
    clip.on( 'wrongflash', function ( client, args ) {
      alert("Your installed Flash version is too old. Click-to-copy will not work.");
    });

    clip.glue(document.getElementById('Rulr-Data'));

    // window handlers
    $(window)
      .scroll( scrollHandler )
      .bind('keydown', function(e) {
        if( e.which == 27) closeRulr();
      });

    // mousemove handlers
    $('#Rulr-Container')
      .mousemove(function(e) {

        $('#Rulr-Tutorial').fadeOut(1500);

        if( mode == MODE_COPY ) return true;
				Mouse.get( e );

        $('#Rulr-Helper-x').css('top', (e.pageY-window.scrollY)+'px');
        $('#Rulr-Helper-y').css('left', (e.pageX-window.scrollX)+'px');

				var sTop    = Selection.start.y,
			      sLeft   = Selection.start.x,
            sWidth  = 0,
            sHeight = 0,
            sqTop   = sTop - window.scrollY,
            sqLeft  = sLeft - window.scrollX;

				if( 'undefined' == typeof sqTop || isNaN( sqTop )) sqTop = 0;
				if( 'undefined' == typeof sqLeft || isNaN( sqLeft )) sqLeft = 0;

        if( mode == MODE_SELECT ) {

					var dTop  = Selection.start.y + window.scrollY,
              dLeft = Selection.start.x + window.scrollX;

					if( 'undefined' == typeof dTop || isNaN( dTop )) dTop = 0;
					if( 'undefined' == typeof dLeft || isNaN( dLeft )) dLeft = 0;

					Selection.end.x = e.pageX;
					Selection.end.y = e.pageY;

					if( Selection.start.x <= Selection.end.x && Selection.start.y <= Selection.end.y ) { // normal: top left -> bottom right
						sWidth = Selection.end.x - Selection.start.x;
						sHeight = Selection.end.y - Selection.start.y;
					}
					else if( Selection.start.x >= Selection.end.x && Selection.start.y <= Selection.end.y ) { // inverted x
						sWidth = Selection.start.x - Selection.end.x;
						sHeight = Selection.end.y - Selection.start.y;

						sqLeft = sqLeft - sWidth;
						dLeft = dLeft - sWidth;
					}
					else if( Selection.start.x <= Selection.end.x && Selection.start.y >= Selection.end.y ) { // inverted y
						sWidth = Selection.end.x - Selection.start.x;
						sHeight = Selection.start.y - Selection.end.y;

						sqTop = sqTop - sHeight;
						dTop = dTop - sHeight;
					}
					else if( Selection.start.x >= Selection.end.x && Selection.start.y >= Selection.end.y ) { // all inverted
						sWidth = Selection.start.x - Selection.end.x;
						sHeight = Selection.start.y - Selection.end.y;

						sqLeft = sqLeft - sWidth;
						sqTop = sqTop - sHeight;

						dLeft = dLeft - sWidth;
						dTop = dTop - sHeight;
					}

					if( 'undefined' == typeof sWidth || isNaN( sWidth )) sWidth = 0;
					if( 'undefined' == typeof sHeight || isNaN( sHeight )) sHeight = 0;

					$('#Rulr-Selection').css({
  			    'top'   : sqTop + 'px',
				    'left'  : sqLeft + 'px',
				    'width' : sWidth + 'px',
				    'height': sHeight + 'px'
					});

					$('#Rulr-Data').html(getInfoHTML(dTop, dLeft, sWidth, sHeight));
        }
				else { // MODE_NOOP
					if( !Selection.visible ) {

						var dTop  = e.pageY + window.scrollY,
								dLeft = e.pageX + window.scrollX;

						if( 'undefined' == typeof dTop || isNaN( dTop )) dTop = 0;
						if( 'undefined' == typeof dLeft || isNaN( dLeft )) dLeft = 0;

            $('#Rulr-Data').html(getInfoHTML(dTop, dLeft, 0, 0));
					}
				}
        return false;
      })
      .mousedown(function(e){

        if( mode == MODE_COPY ) return true;
        mode = MODE_SELECT;

				Selection.visible = true;
				Selection.start.x = e.pageX;
				Selection.start.y = e.pageY;

        $('#Rulr-Selection').css({
          'top': ( Selection.start.y )+'px',
          'left': ( Selection.start.x )+'px',
          'width': '0px',
          'height': '0px',
          'display': 'block'
        });

				$('#Rulr-Copy-Hint').fadeIn('slow');
        return false;
      })
      .mouseup(function(e){

        if( mode == MODE_COPY ) return true;
        mode = MODE_NOOP;

        if( e.pageX == Selection.start.x && e.pageY == Selection.start.y ) {
          // reset
          $('#Rulr-Selection').css('display','none');
          Selection.visible = false;
          $('#Rulr-Data').html(getInfoHTML((e.pageY + window.scrollY), (e.pageX + window.scrollX), 0, 0));
          $('#Rulr-Copy-Hint').fadeOut('slow');
        }
        return false;
      });
  }
});

// default bookmarklet mumbo-jumbo
function fullFunc(opts) {

  // User doesn't have to set jquery, we have a default.
  opts.jqpath = opts.jqpath || "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";

  function getJS(jsfiles){
    // Check if we've processed all of the JS files (or if there are none)
    if (jsfiles.length === 0) {
      opts.ready( opts.swf );
      return false;
    }

    // Load the first js file in the array
    $.getScript(jsfiles[0], function(){
      // When it's done loading, remove it from the queue and call the function again
      getJS(jsfiles.slice(1));
    });
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

  function getjQuery(filename) {

    // Create jQuery script element
    var fileref = document.createElement('script')
    fileref.type = 'text/javascript';
    fileref.src =  filename;

    // Once loaded, trigger other scripts and styles
    fileref.onload = function(){
      getCSS(opts.css); // load CSS files
      getJS(opts.js); // load JS files
    };

    document.body.appendChild(fileref);
  }

	getjQuery(opts.jqpath); // kick it off

}; // end of bookmarklet();
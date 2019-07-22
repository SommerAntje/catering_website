/*************
Jquery Plugin 
Slide Content
02.04.2013
Version 1.0
**************/
(function ($){ // shell
	"use strict";
	$.fn.contentSlide = function(options) {
		// default settings
		var settings = {
			init : 0 // optional Index für die Seite, welche beim start angezeigt werden soll
		};
		var option = $.extend(settings, options);
		
		return this.each(function() {
			// element auf welches das Plugin angewendet wird
			// beinhaltet alle Seiten
			var $tilesContainer = $(this), 
			    currentPage = option.init,
			    nextPage = null;
			 
			// Ausgelagerte Funktion mit den optionalen Übergabeparametern
			// index: übergibt die aktuelle Seite, von welcher die Koordinaten ermittelt werden
			// das hauptelement'wrapper' wird zu den jew. koordinaten mit einer bestimmten Geschwindigkeit geschoben
			// speed in ms

			 var updateAnimation = function(index, speed){
			 	// um einen loop der animation zu verhindern, wenn man mehrere menupunkte hintereinander klickt
			 	// soll die animation beendet werden, wenn der indexwert den wert der seite hat, welche als nächstes geklickt wird
			 	if(index === nextPage){return;}
			 	nextPage = index;
			   
				// eventhandling: führt, wenn das plugin initialsiert ist, events aus
				// events werden nur beim verlassen der jeweils aktuellen seite ausgeführt
				$tilesContainer.trigger('pageLeave', {pageIndLeft: currentPage, pageIndEnter: index, container: $tilesContainer}); 
			
				// eigentliche animationsfunktion zum Bewegen des 'wrappers'
				var $nextTile = $tilesContainer.children().eq(index);
			
				$tilesContainer.animate({
					left: '-'+ $nextTile.css('left'),
					top: '-'+ $nextTile.css('top')
				}, speed, function(){
					// wenn die bewegungsanimation durchgelaufen ist, sollen events getriggert werden, 
					// die nur beim 'eintreten' der aktuellen seite ausgeführt werden sollen
					$tilesContainer.trigger('pageEnter',{pageIndLeft: currentPage, pageIndEnter: index, container: $tilesContainer}); 
					currentPage = index;
				}); 
			};		
			// startsituation
			// wrapper steht auf den koordinaten der ersten seite mit dem index option.init und wird mit 0ms animiert 
			updateAnimation(option.init, 0);
			
			// eventhandling plugin von außen steuern
			// beim klicken auf die linkelemente der navigation 'option.selector' 
			// wird der wrapper zu der seite verschoben, die analog zum link ist 
			$tilesContainer.on('showByIndex.contentSlide', function(evt, slideIndex){
				evt.stopPropagation();
				updateAnimation(slideIndex, 800);
			});
		});
	};
})(jQuery); 
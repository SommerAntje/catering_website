/****
JQuery Plugin
Image Gallery
15.04.2013
1.0
*****/
(function ($){
	"use strict"
	$.fn.imageGallery = function(options){
		var settings = {
			// index zum auswählen des startbildes
			init : 0
		};
		 var option = $.extend(settings, options);
		 return this.each(function(){
		 	// auswahl der ul als imagecontainer 
		 	var $imageContainer = $(this),
		 	// listitems mit bild und bildbeschreibung
		 		$listItems = $imageContainer.find('li'),
		 	// anzahl der bilder ermitteln, die in der ul enthalten sind
		 		itemLength = $listItems.length,
		 	
		 	// ausgangssituation:
		 	// inital index des items aktuelles bild
		 		currentImg = option.init;

		 	// alle anderen listitems sind nicht sichtbar Reihenfolge BEACHTEN!
		 		$listItems.not(currentImg).hide();
			// erstes bild und bildbeschreibung sind sichtbar
				$listItems.eq(currentImg).show();
			
			// next und preview funktionalität wird zusammengefasst von außen gesteuert
			// dazu wird ein namespace hier 'imageGallery'hinzugefügt um konflikt mit anderen plugins zu vermeiden
			// und an showByRelativeIndex gekoppelt
			// eventhandling: von außen wird dann ein optionaler wert übergeben, um den die bilder weiter, oder zurückgeblättert werden sollen
			// eventhandling erwartet als ersten parameter immer ein event!
			$imageContainer.on('showByRelativeIndex.imageGallery', function(evt, wert){
				evt.stopPropagation();
				$listItems.eq(currentImg).fadeOut(200);
				currentImg += wert;
				if(currentImg == itemLength || currentImg == -itemLength){
				   currentImg = 0;
				} 
				$listItems.eq(currentImg).fadeIn(500);
			});
			// plugin zurücksetzten von außen steuern 
			 $imageContainer.on('showByIndex.imageGallery', function(evt, Index){
			 	evt.stopPropagation();
			// setze das aktuelle bild auf den wert des Index
				currentImg = Index;
			// verberge das bild welches nicht dem aktuellem reset index entspricht
				$listItems.not(this).fadeOut(200);
			// blende bild mit aktuellem reset index ein
				$listItems.eq(currentImg).fadeIn(500);
			});
		});
	};
})(jQuery);
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
			init : 0
		};
		 var option = $.extend(settings, options);
		 return this.each(function(){
		 	var $imageContainer = $(this),
		 		$listItems = $imageContainer.find('li'),
		
		 		itemLength = $listItems.length,
		 	
		  		currentImg = option.init;

		 		$listItems.not(currentImg).hide();
		
				$listItems.eq(currentImg).show();
			
			$imageContainer.on('showByRelativeIndex.imageGallery', function(evt, wert){
				evt.stopPropagation();
				$listItems.eq(currentImg).fadeOut(200);
				currentImg += wert;
				if(currentImg == itemLength || currentImg == -itemLength){
				   currentImg = 0;
				} 
				$listItems.eq(currentImg).fadeIn(500);
			});
			
			 $imageContainer.on('showByIndex.imageGallery', function(evt, Index){
			 	evt.stopPropagation();
				currentImg = Index;
				$listItems.not(this).fadeOut(200);
				$listItems.eq(currentImg).fadeIn(500);
			});
		});
	};
})(jQuery);
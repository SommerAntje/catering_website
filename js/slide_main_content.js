/*************
Jquery Plugin 
Slide Content
02.04.2013
Version 1.0
**************/
(function ($){ 
	"use strict";
	$.fn.contentSlide = function(options) {
		var settings = {
			init : 0
		};
		var option = $.extend(settings, options);
		
		return this.each(function() {
			var $tilesContainer = $(this), 
			    currentPage = option.init,
			    nextPage = null;
	
			var updateAnimation = function(index, speed){
			 	if(index === nextPage){return;}
			 	nextPage = index;
			
				$tilesContainer.trigger('pageLeave', {pageIndLeft: currentPage, pageIndEnter: index, container: $tilesContainer}); 
			
				var $nextTile = $tilesContainer.children().eq(index);
			
				$tilesContainer.animate({
					left: '-'+ $nextTile.css('left'),
					top: '-'+ $nextTile.css('top')
				}, speed, function(){
					$tilesContainer.trigger('pageEnter',{pageIndLeft: currentPage, pageIndEnter: index, container: $tilesContainer}); 
					currentPage = index;
				}); 
			};		
			updateAnimation(option.init, 0);
			$tilesContainer.on('showByIndex.contentSlide', function(evt, slideIndex){
				evt.stopPropagation();
				updateAnimation(slideIndex, 800);
			});
		});
	};
})(jQuery); 
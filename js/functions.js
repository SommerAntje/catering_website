(function() {
    if (!("onhashchange" in window)) {
        var oldHash = location.hash;
 		setInterval(function() {
            if(oldHash !== location.hash) {
                oldHash = location.hash;
                $(window).trigger('hashchange');
            }
        }, 20);
    }
})();
$(function(){
	if(location.hash){
		var bookmark ='#page_'+ location.hash.substring(1);
		var bookmarkIndex  = $(bookmark).index();
	} else {
		location.hash = '#Start';
		bookmarkIndex = 0; 
		
	};
	$(window).on('hashchange', function(e, hashIndex){
		var hash = '#page_'+location.hash.substring(1);
		var hashIndex = $(hash).index();
		$('#wrapper').trigger('showByIndex.contentSlide',hashIndex);
	});

	$('#wrapper').contentSlide({init: bookmarkIndex }); 

	$('#nav a').on('click', function(e){
		e.preventDefault();
		
		var menuIndex = $(this).parent().index(); 
		location.hash = $('#wrapper > div').eq(menuIndex).attr('id').substring(5); 
		$('#wrapper > div').eq(menuIndex).find('.slides').trigger('showByIndex.contentSlide', 0);
		$('#wrapper > div').eq(menuIndex).find('.slide_menu a').removeClass('active');
	});
	$('#wrapper').on('pageEnter', function(evt, params){
	 	if (params.container.get(0) != this){return false;}
	 	$('#wrapper > div').eq(params.pageIndLeft).find('.slides').trigger('showByIndex.contentSlide', 0);
	 	$('#wrapper > div').eq(params.pageIndLeft).find('.slide_menu a').removeClass('active');
		$('#wrapper > div').eq(params.pageIndLeft).find('.slide_menu li:first-child').siblings().hide();
	 	$('#wrapper > div').eq(params.pageIndLeft).find('.gallery').trigger('showByIndex.imageGallery', 0);
		$('#wrapper > div').eq(params.pageIndEnter).find('img[data-src]').each(function(){
			var $this = $(this);
			$this.attr('src', $this.attr('data-src'));
			$this.removeAttr('data-src');
		});
	});

	/****page_Food****/

	$('.slides').contentSlide({init: 0});
	
	$('#wrapper > div').find('.slide_menu li:first-child').siblings().hide();

	$('.slide_menu a , .slides div.rubrik > a ').on('click', function(evt){
		evt.preventDefault();
		var index = $(this).parent().index();
		
		if($(this).parent().is('div.rubrik')){index += 1}

		$(this).closest('#wrapper > div').find('.slides').trigger('showByIndex.contentSlide', index)
			   .end().find('.slide_menu a').removeClass('active')
								    .eq(index).addClass('active');
		$(this).closest('#wrapper > div').find('.slide_menu li:first-child').siblings().fadeIn('slow');
	});
	
	$('#wrapper').on('pageEnter', function(evt, params){
	 	if (params.container.get(0) != this){return false;}

	 	if($('#page_Team').index() == params.pageIndEnter){
				
			var galleryInterval = function(selectGallery){
				var galleryItems = $(selectGallery + ' li');
				var ImgLength = galleryItems.length,
				    indImg = galleryItems.filter(':visible').index()+1;
				
					if(indImg == ImgLength){indImg = 0;}
				
					$(selectGallery).trigger('showByIndex.imageGallery',indImg);
			};
				var pageTeamInterval = setInterval(function(){
					galleryInterval("#cuisine .gallery ul");   
					galleryInterval("#noir .gallery ul");
				},5000);
		};

		if($('#page_Team').index() == params.pageIndLeft){
			clearInterval(pageTeamInterval);
		}
	});
	
	/***Navigation images hover: page_Food // page_Beverages***/
	$('.slides div.rubrik a img').hover(
		function(){
		    $(this).css({opacity:'1.0'});
		},
		function(){
			$(this).css({opacity:'0.8'});
		}
	);

	/****page_clients****/
	// IE8
	if($('html').hasClass('ie8')){
		$('.ie8 #page_Kunden p').css({"visibility":"hidden"}); 
		$('.ie8 #page_Kunden span').hover(
			function(){
				$(this).next().css({"visibility":"visible"});
			},
			function(){
				$(this).next().css({"visibility":"hidden"});
			}
		);
	} else {
	//!IE8
		$('#page_Kunden p').animate({opacity:0.01}); 
		$('#page_Kunden span').hover(
			function(){
				$(this).next().animate({opacity:1.0});
			},
			function(){
				$(this).next().animate({opacity:0.01});
			}
		);
	};
	
	/****page_Jobs****/
	$('.scrollable').slimScroll({
		height: '250px',
		width: '670px',
		color: '#900',
		alwaysVisible: 'true'
	});

	$('#nav h1 a img').css({left:-500}).animate({left:-75},1000);
	$('#nav').css({bottom:-50}).animate({bottom:20},1500);
	$('#nav li').on('click',function(){
	 	$(this).addClass('active')
	 		   .siblings().removeClass('active');
	});

	$('.gallery > ul').imageGallery();

	$('.button_next').on('click', function(){
	 	$(this).prevAll('ul').trigger('showByRelativeIndex.imageGallery', 1);
	}); 
	$('.button_prev').on('click', function(){
	 	$(this).prevAll('ul').trigger('showByRelativeIndex.imageGallery', -1);
	});
	var $mascs = $('.email-masc');
	$mascs.each( function(){
		$(this).html( $(this).attr('data-content').replace('($)', '@').replace(/_xRz_/g,'') );
	} );
	return;
});

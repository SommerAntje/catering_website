// wenn der browser ein IE ist soll das hashchange event getriggert  werden 
// in einem Intervall von 20ms wird geprüft ob sich der hash ändert
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
	// wenn ein bookmarklink aufgerufen wird, soll die entsprechende seite angezeigt werden
	if(location.hash){
		// location.hash wird um 'page_' erweitert = id der seite im html
		var bookmark ='#page_'+ location.hash.substring(1);
		// index der 'bookmarkseite' ermitteln, um diesen beim contentslide initialisieren zu übergeben
		var bookmarkIndex  = $(bookmark).index();
		
	} else {
		// usability: beim ersten aufruf der seite, soll die index.html den hash 'start' besitzen
		location.hash = '#Start';
		// und die startseite soll angezeigt werden
		bookmarkIndex = 0; 
		
	};
	// wenn sich der hash ändert bspw. beim zurückblättern in der history
	// zeige analog die entsprechende seite an
	$(window).on('hashchange', function(e, hashIndex){
		// location.hash wird um 'page_' erweitert = id der seite im html
		var hash = '#page_'+location.hash.substring(1);
		// index der aktuell angezeigten seite im hash ermitteln
		var hashIndex = $(hash).index();
		// das hashchange event,  wird über die navigation getriggert
		// über die navigation wird das contentslideplugin gesteuert
		$('#wrapper').trigger('showByIndex.contentSlide',hashIndex);
	});

	// contentslide plugin initialisieren
	$('#wrapper').contentSlide({init: bookmarkIndex }); 
	
	/*********das contentslideplugin soll von außen über die navigation gesteruert werden********/
	$('#nav a').on('click', function(e){
		e.preventDefault();
		
		var menuIndex = $(this).parent().index(); // ermittelt den index des geklickten linkitems
		// contentslide wird über hash gesteuert
		location.hash = $('#wrapper > div').eq(menuIndex).attr('id').substring(5); 
		// beim Klick auf den Menupunkt der aktuellen Seite 'Hauptnavigation' sollen die 'Slider' zurückgesetzt werden
		$('#wrapper > div').eq(menuIndex).find('.slides').trigger('showByIndex.contentSlide', 0);
		$('#wrapper > div').eq(menuIndex).find('.slide_menu a').removeClass('active');
	});
		// #wrapper wird durch contentSlide zu den koordinaten der unterseiten 'geschoben'
	$('#wrapper').on('pageEnter', function(evt, params){
	 	if (params.container.get(0) != this){return false;}
		
		// beim verlassen der aktuellen seite sollen die 'Slider' zurückgesetzt werden
	 	$('#wrapper > div').eq(params.pageIndLeft).find('.slides').trigger('showByIndex.contentSlide', 0);
	 	// highlighting der Untermenus wird entfernt, wenn auf eine  andere Seite geklickt wird
	 	$('#wrapper > div').eq(params.pageIndLeft).find('.slide_menu a').removeClass('active');

	 	// beim verlassen der seite sollen untermenus verborgen sein
		$('#wrapper > div').eq(params.pageIndLeft).find('.slide_menu li:first-child').siblings().hide();
	 	
	 	// Bildergalerien der Untermenus werden bei der jew. aktivierten Seite 
		// auf einen optionalen Index 'showByIndex' gesetzt. 
		// Eventhandling: der Index ist in der show function() des image_gallery Plugin definiert
	 	// beim verlassen der aktuellen seite werden 'Bildergalerien' auf optionalen index zurückgesetzt
	 	$('#wrapper > div').eq(params.pageIndLeft).find('.gallery').trigger('showByIndex.imageGallery', 0);
		
		// beim eintritt jeder aktuellen seite sollen die bilder der bildergalerien nachgeladen werden
		// finde alle bilder auf der aktuellen seite 
		$('#wrapper > div').eq(params.pageIndEnter).find('img[data-src]').each(function(){
			// wenn das bild über das attribut data-src verfügt 'wobei src die referenz zu einem platzhalter gif enthält'
			// hole referenz vom inhalt des attributs data-src
			// und tausche diesen gegen die referenz von src 
			var $this = $(this);
			$this.attr('src', $this.attr('data-src'));
			// lade den inhalt zu der ausgetauscheten referenz von src
			$this.removeAttr('data-src');
			// entferne das attr data-src mit ausgetauschtem inhalt
		});
	});

	/****page_Food****/
	// contentSlide Plugin wird initialisiert
	$('.slides').contentSlide({init: 0});
	
	// beim aufruf der seite sollen untermenus verborgen sein
	$('#wrapper > div').find('.slide_menu li:first-child').siblings().hide();

	$('.slide_menu a , .slides div.rubrik > a ').on('click', function(evt){
		evt.preventDefault();
		// ermittelt den index des geklickten linkitems
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
			// beim Eintritt der page_Team 
			// soll die Bildergalerie 'cuisine_gallery' in einem Interval ablaufen
				
			var galleryInterval = function(selectGallery){
				// anzahl der Bilder
				var galleryItems = $(selectGallery + ' li');
				var ImgLength = galleryItems.length,
				// index des aktuell angezeigten bildes
				// hoch zählen
				    indImg = galleryItems.filter(':visible').index()+1;
				// zurücksetzen 'loop' wenn letztes bild erreicht ist
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
	
	/***Navigationimages hover: page_Food // page_Beverages***/
	$('.slides div.rubrik a img').hover(
		function(){
		    $(this).css({opacity:'1.0'});
		},
		function(){
			$(this).css({opacity:'0.8'});
		}
	);

	/****page_Kunden****/
	// Bedingung für den IE8
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
	// Bedingung für alle anderen Browser, wenn nicht IE8
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
		// scrollbar
	$('.scrollable').slimScroll({
		height: '250px',
		width: '670px',
		color: '#900',
		alwaysVisible: 'true'
	});

	/****allgemein****/
	$('#nav h1 a img').css({left:-500}).animate({left:-75},1000);
	$('#nav').css({bottom:-50}).animate({bottom:20},1500);
	$('#nav li').on('click',function(){
	 	$(this).addClass('active')
	 		   .siblings().removeClass('active');
	});

	/****initialisieren der einzelnen Bildergalerien****/
	$('.gallery > ul').imageGallery();

	/****Vor- und Zurückbutton der einzelnen Bildergalerien****/
		// click weiter
	$('.button_next').on('click', function(){
	 	$(this).prevAll('ul').trigger('showByRelativeIndex.imageGallery', 1);
	});
		// click zurück 
	$('.button_prev').on('click', function(){
	 	$(this).prevAll('ul').trigger('showByRelativeIndex.imageGallery', -1);
	});
	// e-mail adresse maskieren
	// klasse an jqueryobjekt übergeben
	var $mascs = $('.email-masc');
	// austausch des textes in jeder e-mail mit dem attribut data-content 
	$mascs.each( function(){
		$(this).html( $(this).attr('data-content').replace('($)', '@').replace(/_xRz_/g,'') );
	} );
	return;
});

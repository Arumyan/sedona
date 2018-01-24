function initMap() {
	var map;
	var uluru = {lat: 34.869497, lng: -111.760186};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		scrollwheel: false,
		center: uluru,
		gestureHandling: 'cooperative'
	});
	var image = '../images/icon-map-marker.svg';
	var castomMarker = new google.maps.Marker({
		position: uluru,
		map: map,
		icon: image
	});
}


(function(){
	$('.nav-btn-close').on('click', function(){
		$('.nav-items').slideUp(300);
		$('.nav-btn-close').hide();
		$('.nav-btn-menu').show();
	});

	$('.nav-btn-menu').on('click', function(){
		$('.nav-items').slideDown(300);
		$('.nav-btn-close').show();
		$('.nav-btn-menu').hide();
	});

	$(window).on('resize', function(){
		var width = $(window).width()
		if(width >= 768){
			$('.nav-items').removeAttr('style');
			$('.nav-btn-menu').hide();
			$('.nav-btn-close').removeAttr('style');
		}
})

})();
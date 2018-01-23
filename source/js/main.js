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

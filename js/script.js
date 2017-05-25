var festivals = {}
festivals.todayDate = (new Date()).toJSON().split('').slice(0, 10).join('');
festivals.thumbImagesUrl = 'http://app.toronto.ca';
festivals.features = {
	'Paid Parking' : '',
	'Onsite Food and Beverages': '',
	'Free Parking': '',
	'Public Washrooms': '',
	'Bike Racks': ''
}

$(function(){
	festivals.init();
});

// initializing the functions on load
festivals.init = function(){
	festivals.getData();
}

//getting data from api
festivals.getData = function(){
	$.ajax({
		url: 'http://app.toronto.ca/cc_sr_v1_app/data/edc_eventcal_APR?',
		method: 'GET',
		data: {
			limit: 403
		}
	}).then(function(res){
		festivals.getItemsToDisplayData(res);
	});
}

//get items from the ajax request
festivals.getItemsToDisplayData = function(res){
	var counter = 0;
	res.forEach(function(e){
		var event = e.calEvent;
		var datesArray = event.dates;
		datesArray.forEach(function(date){
			if( date.hasOwnProperty('startDateTime') ){
				var eventDate = (date.startDateTime).split('')
													.slice(0, 10)
													.join('');
				if(festivals.todayDate === eventDate){
					var eventName = event.eventName;
					var isFree = event.freeEvent;
					var cost = event.otherCostInfo;
					var longEventDescription = event.description;
					var shortEventDescription = longEventDescription.split(' ')
																	.slice(0, 15)
																	.join(' ') + '...';
					var accessibility = event.accessibility;
					var features = event.features;
					var featuresArray = [];
					var categories = event.categoryString;
					if(event.image !== undefined){
						var thumbImage = event.image.url;
					}
					counter++;
					console.log(counter);
					console.log(eventName);
					// console.log('Cost: ' + event.otherCostInfo);
					for(var feature in features){
						if(features[feature])
							featuresArray.push(feature);
					}
					console.log(categories);
					console.log(featuresArray);
					console.log(thumbImage);
					festivals.displayToIndex(thumbImage, eventName, isFree, cost, shortEventDescription, featuresArray, accessibility, categories)
				} 
			}
		});
	});
}

festivals.displayToIndex = function(thumbImage, eventName, isFree, cost, shortEventDescription, featuresArray, accessibility, categories){
	var image = $('<img>').attr({
		src: `${festivals.thumbImagesUrl + thumbImage}`,
		alt: 'Event thumbnail'
	}).css('width', '200px');
	var titleElement = $('<h2>').html(eventName);
	var dateElement = $('<p>').html(festivals.todayDate);
	var isFreeElement = $('<p>').html(`Free: ${isFree}`);
	var shortEventDescriptionElement = $('<p>').html(shortEventDescription);
	$('main').append(image, titleElement, dateElement, isFreeElement, shortEventDescriptionElement);
}
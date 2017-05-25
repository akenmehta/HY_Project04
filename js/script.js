var festivals = {}
festivals.todayDate = (new Date()).toJSON().split('').slice(0, 10).join('');
festivals.imagesUrl = 'http://app.toronto.ca';
festivals.eventsArray = [];
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
		var datesArray = event.dates; // array of dates in calEvent

		datesArray.forEach(function(date){
			if ( date.hasOwnProperty('startDateTime') ){
				var eventDate = (date.startDateTime).split('')
													.slice(0, 10)
													.join('');
//checks to see whether event date matches todays date
				if (festivals.todayDate === eventDate){
					var features = event.features;
					var featuresArray = [];
					var image;
					for(var feature in features){
						if(features[feature])
							featuresArray.push(feature); //inserting the feature in the featureArray
					}

					if(event.image !== undefined){
						image = festivals.imagesUrl + event.image.url;
					} else{
						image = '../assets/toronto.jpeg';
					}
					console.log(image);
					festivals.eventsArray.push({
						id: counter,
						accessibility: event.accessibility,
						categories: event.categoryString,
						cost: event.otherCostInfo,
						endDate: event.endDate.split('')
											  .slice(0, 10)
											  .join(''),
						eventName: event.eventName,
						eventWebsite: event.eventWebsite,
						features: featuresArray,
						image: image,
						isFree: event.freeEvent,
						location: event.locations[0].locationName,
						address: event.locations[0].address,
						longEventDescription: event.description,
						phone: event.orgPhone,
						shortEventDescription: event.description.split(' ')
																   .slice(0, 15)
																   .join(' ') + '...',
						startDate: event.startDate.split('')
												  .slice(0, 10)
												  .join(''),										 
					});

					festivals.displayOnHtml(festivals.eventsArray[counter], counter);
					counter++;
					console.log(counter);
				} 
			}
		});
	});
}


festivals.displayOnHtml = function(festivalsObject, counter){
	var eventTemplate = $('#event').html();
	var compileEventTemplate = Handlebars.compile(eventTemplate);
	var finalTemplate = compileEventTemplate(festivalsObject);
	$('ul').append(finalTemplate);
	$('h2 span').text(counter + 1);
}
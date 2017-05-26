var festivals = {}
festivals.todayDate = (new Date()).toJSON().split('').slice(0, 10).join('');
festivals.imagesUrl = 'http://app.toronto.ca';
festivals.eventsArray = [];
festivals.finalArray = [];
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
	festivals.displayModal();
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
	var firstObjectOfArray = true;

	res.forEach(function(e){
		var event = e.calEvent;
		var datesArray = event.dates; // array of dates in calEvent

		datesArray.forEach(function(date){
			if(date.hasOwnProperty('startDateTime')){
				var eventDate = (date.startDateTime).split('')
													.slice(0, 10)
													.join('');
				
				//checks to see whether event date matches todays date
				if(festivals.todayDate === eventDate){
					var features = event.features;
					var featuresArray = [];
					var image;

					for(var feature in features){
						if(features[feature])
							featuresArray.push(feature); //inserting the feature in the featureArray
					}
					// check for image and if no image is found, pass the placeholder
					if(event.image !== undefined){
						image = festivals.imagesUrl + event.image.url;
					} else{
						image = './assets/toronto.jpg';
					}
					// push the first object into the array by setting firstObjectOfArray = true 
					if(firstObjectOfArray){
						festivals.eventsArray.push({
						id: counter,
						accessibility: event.accessibility,
						categories: event.categoryString,
						cost: event.otherCostInfo,
						email: event.orgEmail,
						endDate: event.endDate.split('')
											  .slice(0, 10)
											  .join(''),
						eventName: event.eventName,
						website: event.eventWebsite,
						features: featuresArray,
						image: image,
						isFree: event.freeEvent,
						location: event.locations[0].locationName,
						address: event.locations[0].address,
						longEventDescription: event.description,
						phone: event.orgPhone,
						partnerType: event.partnerType,
						shortEventDescription: event.description.split(' ')
																   .slice(0, 15)
																   .join(' ') + '...',
						startDate: event.startDate.split('')
												  .slice(0, 10)
												  .join(''),										 
						});

						festivals.displayOnHtml(festivals.eventsArray[counter], counter);
						counter++;
						firstObjectOfArray = false;
					} 
					// if the event name of the previous object is not equal to the event name of the next object, then push into array
					else if(festivals.eventsArray[counter - 1].eventName !== event.eventName){

						festivals.eventsArray.push({
						id: counter,
						accessibility: event.accessibility,
						categories: event.categoryString,
						cost: event.otherCostInfo,
						email: event.orgEmail,
						endDate: event.endDate.split('')
											  .slice(0, 10)
											  .join(''),
						eventName: event.eventName,
						website: event.eventWebsite,
						features: featuresArray,
						image: image,
						isFree: event.freeEvent,
						location: event.locations[0].locationName,
						address: event.locations[0].address,
						longEventDescription: event.description,
						phone: event.orgPhone,
						partnerType: event.partnerType,
						shortEventDescription: event.description.split(' ')
																   .slice(0, 15)
																   .join(' ') + '...',
						startDate: event.startDate.split('')
												  .slice(0, 10)
												  .join(''),										 
						});

						festivals.displayOnHtml(festivals.eventsArray[counter]);
						counter++;
					}
				} // if statement checking todays date and event date
			}
		});
	});
}

//displays content to the display page using handlebars
festivals.displayOnHtml = function(festivalsObject){
	var eventTemplate = $('#event').html();
	var compileEventTemplate = Handlebars.compile(eventTemplate);
	var finalTemplate = compileEventTemplate(festivalsObject);
	$('ul').append(finalTemplate);
	$('h2 span').text(festivals.eventsArray.length);
}

//displays content of the modal using handlebars, festival is an object passed from the festivals.displayModal method
festivals.displayModalOnHtml = function(festival){
	var eventTemplate = $('#eventModal').html();
	var compileEventTemplate = Handlebars.compile(eventTemplate);
	var finalTemplate = compileEventTemplate(festival);
	$('.modal').html(finalTemplate);
}

// diplays and fades the modal, called in the init function
festivals.displayModal = function(){
	// When user clicks on the h3, display the modal
	$('main').on('click', 'h3', function(event){
		 event.preventDefault();
		 event.stopPropagation();
		 $('.modal').fadeIn(400).css('display', 'block');

		 //sends the festival object, based on the id, id obtained from the data-id attribute
		 festivals.displayModalOnHtml( festivals.eventsArray[$(this).attr('data-id')] );
	});

	// When the user clicks on <span> (x), close the modal
	$('.modal').on('click', 'span', function(){
		$('.modal').fadeOut(400, function(){
			$('.modal').css('display', 'none')
		});
	});

	// When user clicks anywhere on the body, other than he modal, fade out the modal
	$('body').click(function() {
		$('.modal').fadeOut(400, function(){
			$('.modal').css('display', 'none')
		});
	});
}

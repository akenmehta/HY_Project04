var festivals = {}


//getting data from api
festivals.getData = function(){
	$.ajax({
		url: 'http://app.toronto.ca/cc_sr_v1_app/data/edc_eventcal_APR?limit=3',
		method: 'GET',
		data: {
			limit: 3,
			format: 'json'
		}
	}).then(function(res){
		console.log(res);
	});
}

// initializing the functions on load
festivals.init = function(){
	festivals.getData();
}

$(function(){
	festivals.init();
});

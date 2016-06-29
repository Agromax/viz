function register(name, uname, cb) {
	$.post('/user/', {
		name: name,
		username: uname
	}, function(data) {
		cb(data);
	});
}


(function() {
	$(document).ready(function() {
		var name = prompt("Please enter your name");
		console.log("Your name is " + name);

		var uname = prompt("Please choose a username");
		console.log('You choosed ' + uname);

		register(name, uname, function(data) {
			if(data.code !== 0) {
				console.error(data.msg);
				alert(data.msg);
				location.reload();
			} else {
				console.log('Good to go');
			}
		});
	});
})();

function appMain(user) {
	if(!user || !user.name || !user.username) {
		alert("Invalid state of the app");
		console.error('Invalid state of the app. User object is invalid', user);
		location.reload();
	}

	setInterval(function() {
		$.get('/user/', function(data) {
			if(data && data.code === 0) {
				$('#user-list').html(data.msg);
			} else {
				console.log('Something went wrong while fetching users list', data);
			}
		});
	}, 2000);

}
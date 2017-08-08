var buttonClicksApp = angular.module('buttonClicksApp', ['ngRoute']);

buttonClicksApp.config(function($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl: 'index.html',
		controller: 'mainController'
	});
});




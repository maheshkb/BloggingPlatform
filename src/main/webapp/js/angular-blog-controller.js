(function(){
	var module = angular.module('BlogApp',[ 'ngRoute' ]);
	module.config(['$routeProvider',function($routeProvider){
		$routeProvider.when('/login', {
			templateUrl : 'login.html',
			controller : 'loginController'
		}).when('/register',{
			templateUrl : 'register.html',
			controller : 'registerController'
		}).when('/postBlog', {
			templateUrl :'create_blog.html',
			controller : 'blogPostController'
		}).when('/blogList', {
			templateUrl : 'blog_list.html',
			controller : 'blogListController'
		}).when('/contact', {
			templateUrl : 'contact.html',
			controller : 'contactController'
		}).when('/about', {
			templateUrl : 'about.html',
			controller : 'aboutUsController'
		}).when('/blogSyn', {
			templateUrl : 'blog.html',
			controller : 'blogSynopsisController'
		}).otherwise({
			redirectTo : '/login'
		});
	}]);
	
	
	module.controller('loginController', function($http, $log, $scope, $location){
		$scope.login =  function(user) {
			 var postData = $.param({
		            	"email": $scope.user.username,
		                "password": $scope.user.password
		        });
				$http({
					"url" : 'http://localhost:8080/Blog/rest/user/login',
					"headers": {'Content-Type': 'application/x-www-form-urlencoded'},
					"method" : "POST",
					"data" : postData			
				}).success( function(data, textStatus, jqXHR) {
					if(typeof(Storage) !== "undefined") {
						sessionStorage.setItem('token', data.token);
						}
					$location.path('/blogList');
					$scope.$apply();
				}).error(function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.responseText);
				});
		};
	});
	
	
	module.controller('registerController', function($http, $scope, $log, $location) {
		$scope.register = function(newuser){
		var postData = $.param({
         	'firstName':  $scope.newuser.firstName,
            'lastName': $scope.newuser.lastName,
            'emailAddress': $scope.newuser.email,
            'password': $scope.newuser.password
		});
		$http({
			"url" : 'http://localhost:8080/Blog/rest/user',
			"headers": {'Content-Type': 'application/x-www-form-urlencoded'},
			"method" : 'POST',
			"data" : postData,
		}).success(function(data, textStatus, jqXHR) {
			var json = data; //JSON.parse(data);
			if (typeof (Storage) !== "undefined") {
				sessionStorage.token = json.token;
			}
			$location.path('/blogList');
			$scope.$apply();
		}).error(function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR.responseText);
		});
		$scope.newuser ='';
		};
	});
	
	
	module.controller('Mymessages', function(){
	var  cacheMessage = "";
	//	cache.Data
		return cacheMessage;
	});
	
	
	module.service('messages', function() {
		var cacheMessage="";
		this.setText = function(inputText) {
			cacheMessage=inputText
		        }
		    this.getText = function() {
		            return cacheMessage;
		        }
		});
	
	module.controller('blogPostController', function($scope, $http, $log, $location){
		
		$scope.blogPost = function(){	
			var dataToSend = $.param({
				"title": $scope.blog.title,
				"content": $scope.blog.content
				});
			var token = "Basic " + sessionStorage.getItem('token');
			$http({
		        "url" : "http://localhost:8080/Blog/rest/blog",
		        "method" : "POST",
		        "headers" : {"Content-Type" : "application/x-www-form-urlencoded",
		        	"Authorization" : token },
		        "data" : dataToSend	        
		    }).success(function(data, textStatus, jqXHR) {
            	$location.path('/blogList');
				$scope.$apply();
            }).error(function (data, textStatus, jqXHR){
	             console.log('Error');
	         });
		};				
		
		$scope.logout =  function(){
			var token = "Basic " + sessionStorage.getItem('token');
			$http({
				"url" : 'http://localhost:8080/Blog/rest/user/logout',
				"method" : 'POST',
				"headers" : {"Content-Type" : "application/x-www-form-urlencoded",
		        "Authorization" : token }}).success(function(data, textStatus, jqXHR) {
	            	$location.path('/login');
					$scope.$apply();
				}).error(function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.responseText);
				});
		};
	});
	
	
	module.controller('blogListController', function($scope, $http, $log, $location, messages){
		var searchString = messages.getText();
		
		$http({
			"url" : 'http://localhost:8080/Blog/rest/blog',		
			"headers" :{'Authorization' : "Basic " + sessionStorage.getItem('token')},
			"method" : 'GET'}).success(function(data, textStatus, jqXHR) {
				$scope.blogs =  data; //JSON.stringify(data); 
			}).error(function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
			});
		
		$scope.search = function(){
			var text = $scope.searchText; 
			var url = 'http://localhost:8080/Blog/rest/blog/search/'+text;
			
			$http({
				"url" : url,
				"method": "GET",
				"headers":{"Content-Type" : "application/x-www-form-urlencoded",
						"Authorization" : "Basic " + sessionStorage.getItem('token')
						}		
			}).success(function(data, textStatus, jqXHR){
					$scope.blogs =  data; //JSON.stringify(data); 
				}).error(function(jqXHR, textStatus, errorThrown){
					console.log(jqXHR.responseText);
				});
		};
		
		$scope.logout = function(){
			var token = "Basic " + sessionStorage.getItem('token');
			$http({
				"url" : 'http://localhost:8080/Blog/rest/user/logout',
				"method" : 'POST',
				"headers" : {"Content-Type" : "application/x-www-form-urlencoded",
		        "Authorization" : token }}).success(function(data, textStatus, jqXHR) {
				$location.path('/login');
				$scope.$apply();
			}).error(function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.responseText);
			});
		};
		
		$scope.cacheData = function(text){
			messages.setText(text);
		};
	});
	
	
	module.controller('blogSynopsisController',function($scope, $log, $http, $location, messages){
		var searchString = messages.getText();
		var url = 'http://localhost:8080/Blog/rest/blog/'+searchString;
		
	$http({
		"url" : url,
		"method": "GET",
		"headers":{"Content-Type" : "application/x-www-form-urlencoded",
				"Authorization" : "Basic " + sessionStorage.getItem('token')
				}		
	}).success(function(data, textStatus, jqXHR){
			$scope.blog = data;
		}).error(function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR.responseText);
		});
	});
	
	
	module.controller('contactController', function($http, $scope, $location){
		$scope.logout =  function(){
			var token = "Basic " + sessionStorage.getItem('token');
			$http({
				"url" : 'http://localhost:8080/Blog/rest/user/logout',
				"method" : 'POST',
				"headers" : {"Content-Type" : "application/x-www-form-urlencoded",
		        "Authorization" : token }}).success(function(data, textStatus, jqXHR) {
	            	$location.path('/login');
					$scope.$apply();
				}).error(function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.responseText);
				});
		};
	});
	
	
	module.controller("aboutUsController", function($http, $scope, $location){
		$scope.logout =  function(){
			var token = "Basic " + sessionStorage.getItem('token');
			$http({
				"url" : 'http://localhost:8080/Blog/rest/user/logout',
				"method" : 'POST',
				"headers" : {"Content-Type" : "application/x-www-form-urlencoded",
		        "Authorization" : token }}).success(function(data, textStatus, jqXHR) {
	            	$location.path('/login');
					$scope.$apply();
				}).error(function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR.responseText);
				});
		};
	});
	
	
})();
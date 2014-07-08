var appModule = angular.module('app', [ 'ngRoute' ]);

appModule.config([ '$routeProvider',
		function($routeProvider, $locationProvider) {
			
			$routeProvider.when('/', {
				templateUrl : 'login.html',
				controller : 'ExercicioController'
			}).when('/home', {
				templateUrl : 'home.html',
				controller : 'UsuarioController'
			}).when('/exercicio', {
				templateUrl : 'exercicios.html',
				controller : 'ExercicioController'
			}).otherwise({
				redirectTo : '/home'
			});
			
			// remove o # da url use the HTML5 History API
			//$locationProvider.html5Mode(true);
		} ]);

appModule.controller('UsuarioController', function($scope, $http) {
	$http.get('http://localhost:8080/TCC-GamificationJava/usuario')
			.success(function(data) {
				$scope.usuario = data;
			});
});

appModule.controller('ExercicioController', function($scope) {
	$scope.titulo = "Exercicio Olá Mundo";
	$scope.descricao = "Escreva Olá Mundo!";

});

appModule.controller('CodigoController', function($scope, $http) {

	// $scope.retorno = {mensagem: ">>"};
	var codigo = "System.out.println(pá);";
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/eclipse");
	editor.getSession().setMode("ace/mode/java");

	editor.setValue(codigo);

	$scope.reposta;
	$scope.enviarExercicio = function() {
		codigo = editor.getSession().getValue();
		$scope.reposta = {
			"codigo" : codigo
		};

		var data = $scope.reposta;
		$http.post('http://localhost:8080/TCC-GamificationJava/codigo00',
				data).success(function(data) {
			// $scope.retorno = data;
			$scope.retorno = data;
			console.log(data.mensagem);
			// alert(data.mensagem);
		});
	};

});
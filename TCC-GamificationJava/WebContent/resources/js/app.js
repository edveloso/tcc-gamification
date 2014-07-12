var appModule = angular.module('app', [ 'ngRoute' ]);

appModule.config([ '$routeProvider',
		function($routeProvider, $locationProvider) {

			$routeProvider.when('/', {
				templateUrl : 'login.html',
				controller : 'LoginController'
			}).when('/home', {
				templateUrl : 'home.html',
				controller : 'UsuarioController'
			}).when('/cadastro', {
				templateUrl : 'cadastro.html',
				controller : 'CadastroController'
			}).when('/exercicio', {
				templateUrl : 'exercicios.html',
				controller : 'ExercicioController'
			}).when('/sair', {
				templateUrl : 'login.html',
				controller : 'LoginController'
			}).otherwise({
				redirectTo : '/home'
			});

			// remove o # da url use the HTML5 History API
			// $locationProvider.html5Mode(true);
		} ]);

appModule.controller('LoginController', function($scope, $http) {
	
});

appModule.controller('UsuarioController', function($scope, $http) {
	$http.get('http://localhost:8080/TCC-GamificationJava/usuario').success(
			function(data) {
				$scope.usuario = data;
			});
});

appModule.controller('ExercicioController', function($scope) {
	$scope.titulo = "Exercicio Olá Mundo";
	$scope.descricao = "Escreva Olá Mundo!";

});

appModule.controller('CadastroController', function($scope, $http) {
	$scope.usuario = {
		"nome" : "",
		"login" : "",
		"senha" : ""
	};
	$scope.mensagem = "";
	$scope.status;
	
	$scope.cadastrarUsuario = function() {
		var data = $scope.usuario;
		$http.post('http://localhost:8080/TCC-GamificationJava/novoUsuario',
				data).success(function(data) {
			var cadastro = data;
			if (cadastro == "true") {
				$scope.mensagem = "Cadastrado com sucesso";
				$scope.status = "success";
				
			} else {
				$scope.mensagem = "Usuário já existe";
				$scope.status = "warning";
			}
			//$scope.mensagem = data;
		});
	};

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
		$http.post('http://localhost:8080/TCC-GamificationJava/codigo00', data)
				.success(function(data) {
					// $scope.retorno = data;
					$scope.retorno = data;
					console.log(data.mensagem);
					// alert(data.mensagem);
				});
	};

});

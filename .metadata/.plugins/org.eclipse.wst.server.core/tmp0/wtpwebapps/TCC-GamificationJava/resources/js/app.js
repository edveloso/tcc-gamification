'use strict';
var appModule = angular.module('app', [ 'ngResource', 'ui.bootstrap', 'route']);

var appModule = angular.module('app').factory('Usuario', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/usuario/:login', {}, {
        query: { method: "GET", isArray: true },
        'update': { method: 'PUT'}
    });

});

var appModule = angular.module('app').factory('Login', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/usuario/login');
});

var appModule = angular.module('app').factory('Progresso', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/progresso/:progresso/nivel/:nivel');
});

var appModule = angular.module('app').factory('Modulo', function ($resource) {
    return $resource('http://localhost:8080/TCC-GamificationJava/modulo/:modulo/assunto/:assunto/exercicio/:exercicio', {}, {
        query: { method: "GET", isArray: true }
    });
});

appModule.factory('usuario', function () {

    var data = {};

    return {
        getUsuario: function () {
            return data;
        },
        setUsuario: function (usuario) {
            data = usuario;
        },
    };
});

appModule.controller('LoginController', function ($rootScope, $scope, $location, usuario, breadcrumbs, Login) {
	$rootScope.breadcrumbs = breadcrumbs;
	$rootScope.activetab = $location.path();
    $scope.usuario = {
        "login": "",
        "senha": ""
    };
    $scope.mensagem = "";

    $scope.logarUsuario = function () {
        var data = $scope.usuario;
        Login.save(data, function (response) {
            var status = response.retorno;
            if (status === true) {
                usuario.setUsuario($scope.usuario);
                $location.path('/home/');
            } else {
                $scope.mensagem = "Usuário ou senha incorreto";
                console.log(status);
            }
        });

    };
});

appModule.controller('UsuarioController', function ($rootScope, $location, $scope, $http, usuario, breadcrumbs, Usuario, Progresso) {
	$scope.breadcrumbs = breadcrumbs;
	$rootScope.activetab = $location.path();
    $rootScope.usuarioLogado = usuario.getUsuario().login;
    $scope.usuario = {};
    Usuario.query(function (data) {
        $scope.usuariosTop = data;
    });

    Usuario.get({ login: usuario.getUsuario().login }, function (data) {
        $scope.usuario = data;
        usuario.setUsuario($scope.usuario);
        
        Progresso.get({ nivel: $scope.usuario.nivel.id }, function (data) {
            var proxNivel = data;
            if(proxNivel != null){
	            var percentMaxima =  proxNivel.pontos - $scope.usuario.nivel.pontos;
	            var percentAtual = $scope.usuario.pontos - $scope.usuario.nivel.pontos;
	            var resultPercent = (percentAtual / percentMaxima) * 100;
	            $scope.percentNivel = parseInt(resultPercent.toFixed(0));
            }else{
            	$scope.percentNivel = 100;
            }
        });
    });
    
    

});

appModule.controller('ModuloController', function ($rootScope, $location, $scope, Modulo, ExerciciosFactory, usuario, breadcrumbs) {
	$scope.breadcrumbs = breadcrumbs;
	$rootScope.activetab = $location.path();
	$scope.conquistado = [];
    var progressos = usuario.getUsuario().progressos;
    $scope.progresso = progressos[progressos.length - 1];
    progressos = progressos.sort();
    
    var badges = [];
    var contadorExercicio = 0;
    var contadorAssunto = 0;
    var contExercicioPorAssunto = [];
    var contAssuntoPorModulo = [];
    for(var p in progressos){
    	var progresso = progressos[p];
    	contadorExercicio += 1;
    	var progr = progressos[contadorExercicio];
    	if(progr != undefined){
    		if(progresso.exercicio.assunto.id != progr.exercicio.assunto.id){
        		contExercicioPorAssunto.push({'assuntoId': progresso.exercicio.assunto.id, 'totalExercicios': contadorExercicio});
        		contadorExercicio = 0;
        	}
    	}
    	
    }
    for(var p in progressos){
    	var progresso = progressos[p];
    	contadorAssunto += 1;
    	var progr = progressos[contadorAssunto];
    	if(progr != undefined){
    		if(progresso.exercicio.assunto.modulo.id != progr.exercicio.assunto.modulo.id){
        		contAssuntoPorModulo.push({'moduloId': progresso.exercicio.assunto.modulo.id, 'totalAssuntos': contadorAssunto});
        		contadorAssunto = 0;
        	}
    	}
    }
    
    $scope.percentualAssunto = [];
    $scope.percentualModulo = [];
    
    Modulo.query()
    .$promise.then(function(data) {
    	$scope.modulos = data;
        var modulos = data;
        for(var index in modulos){
        	var modulo = modulos[index];
        	$scope.percentualModulo[modulo.id] = 0;
        	for(var a in modulo.assuntos){
        		var assunto = modulo.assuntos[a];
        		badges = badges.concat(assunto.conquistas);
        		$scope.percentualAssunto[assunto.id] = 0;
        		for(var e in contExercicioPorAssunto){
    				var assuntoProgresso = contExercicioPorAssunto[e];
    				var moduloProgresso = contAssuntoPorModulo[e];
    				
    				if(modulo.id == moduloProgresso.moduloId){
    					if(modulo.assuntos.length !== 0)
    						$scope.percentualModulo[modulo.id] = (moduloProgresso.totalAssuntos / modulo.assuntos.length) * 100;
    					else
    						$scope.percentualModulo[modulo.id] = 100;
    				}
    				
    				if(assunto.id == assuntoProgresso.assuntoId){
    					if(assunto.exercicios.length !== 0)
    						$scope.percentualAssunto[assunto.id] = (assuntoProgresso.totalExercicios / assunto.exercicios.length) * 100;
    					else
    						$scope.percentualAssunto[assunto.id] = 100;
    				}
    			}
        	}
        }
        $scope.badges = badges;
        $scope.badgesConquistados = usuario.getUsuario().badges;
    });
    
    $scope.escolherAssunto = function (assunto, index) {
    	
        if (assunto.modulo.nome == "UML") {
            Modulo.query({ assunto: assunto.id }, function (data) {
                ExerciciosFactory.setExercicios(data);
                ExerciciosFactory.setBadges(assunto.conquistas);
                ExerciciosFactory.setProxEx(0);
                $location.path("/home/modulos/uml/exercicios");
            });
        } else {
            Modulo.query({ assunto: assunto.id }, function (data) {
                ExerciciosFactory.setExercicios(data);
                ExerciciosFactory.setBadges(assunto.conquistas);
                ExerciciosFactory.setProxEx(0);
                $location.path("/home/modulos/java/exercicios");
            });
        }

    };

});

appModule.controller('CadastroController', function ($scope, $http, Usuario, breadcrumbs) {
	$scope.breadcrumbs = breadcrumbs;
	$scope.usuario = {
        "nome": "",
        "login": "",
        "senha": ""
    };
    $scope.mensagem = "";
    $scope.status = "";

    $scope.cadastrarUsuario = function () {
        var data = $scope.usuario;
        Usuario.save(data, function (response) {
            //data saved. do something here.
        }); //saves an entry. Ass
    };

});


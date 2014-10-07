'use strict';
var appModule = angular.module('app', [ 'ngRoute', 'ngResource', 'ui.bootstrap' ]);

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

appModule.controller('LoginController', function ($rootScope, $scope, $http, $location, usuario, Login) {
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
                $location.path('/home');
                $location.replace();
            } else {
                $scope.mensagem = "Usuário ou senha incorreto";
                console.log(status);
            }
        });

    };
});

appModule.controller('UsuarioController', function ($rootScope, $location, $scope, $http, usuario, Usuario, Progresso) {
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

appModule.controller('ModuloController', function ($rootScope, $location, $scope, Modulo, ExerciciosFactory, usuario) {
    $rootScope.activetab = $location.path();
    var progressos = usuario.getUsuario().progressos;
    $scope.progresso = progressos[progressos.length - 1];
    
    Modulo.query(function(data) {
    	$scope.modulos = data;
    });

    $scope.escolherAssunto = function (assunto) {
        if (assunto.modulo.nome == "UML") {
            Modulo.query({ assunto: assunto.id }, function (data) {
                ExerciciosFactory.setExercicios(data);
                ExerciciosFactory.setBadges(assunto.conquistas);
                ExerciciosFactory.setProxEx(0);
                $location.path("/uml/exercicios");
            });
        } else {
            Modulo.query({ assunto: assunto.id }, function (data) {
                ExerciciosFactory.setExercicios(data);
                ExerciciosFactory.setBadges(assunto.conquistas);
                ExerciciosFactory.setProxEx(0);
                $location.path("/java/exercicios");
            });
        }

    };

});

appModule.controller('CadastroController', function ($scope, $http, Usuario) {
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


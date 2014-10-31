'use strict';
var appRoute = angular.module('route', ['ngRoute', 'ng-breadcrumbs']);

appRoute.config([ '$routeProvider',
    function ($routeProvider, $locationProvider) {
        // remove o # da url use the HTML5 History API
        // $locationProvider.html5Mode(true);
        $routeProvider.when('/', {
            templateUrl: 'login.html',
            controller: 'LoginController',
            label: 'Login'
        }).when('/home/', {
            templateUrl: 'home.html',
            controller: 'UsuarioController',
            label: 'Home'
        }).when('/home/modulos', {
            templateUrl: 'modulos.html',
            controller: 'ModuloController',
            label: 'Modulos'
        }).when('/cadastro', {
            templateUrl: 'cadastro.html',
            controller: 'CadastroController',
            label: 'Cadastro'
        }).when('/home/modulos/java/exercicios', {
            templateUrl: 'java/exercicios.html',
            controller: 'JavaController',
            label: 'Exercicios'
        }).when('/home/modulos/uml/exercicios', {
            templateUrl: 'uml/exercicios.html',
            controller: 'UmlController',
            label: 'Exercicios'
        }).when('/home/sair', {
            templateUrl: 'login.html',
            controller: 'LoginController',
            label: ''
        }).otherwise({
            redirectTo: '/'
        });

    } ]);
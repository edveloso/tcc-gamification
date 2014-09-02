'use strict';
var appController = angular.module('app');

appController.controller('JavaController', function ($scope, $http, Usuario) {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/java");

    $scope.exercicioJava = {};
    var codigo = "";
    $scope.dica1 = {"status": true, "id": 1};
    $scope.dica2 = {"status": true, "id": 2};
    $scope.dica3 = {"status": true, "id": 3};

    $scope.dicas = function (dica) {
        if (dica.status === true && dica.id === 1) {
            $scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 10;
            $scope.dica1.status = false;
        }
        if (dica.status === true && dica.id === 2) {
            $scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 10;
            $scope.dica2.status = false;
        }
        if (dica.status === true && dica.id === 3) {
            $scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 10;
            $scope.dica3.status = false;
        }
    };

    $http.get('http://localhost:8080/TCC-GamificationJava/java/exercicio/get')
        .success(function (data) {
            $scope.exercicioJava = data;
            $scope.modulo = data.assunto.modulo;
            codigo = $scope.exercicioJava.codigoReferencia;
            editor.setValue(codigo);
        });

    $scope.resposta = {"codigo": ""};
    $scope.enviarExercicio = function () {
        codigo = editor.getSession().getValue();
        $scope.resposta.codigo = codigo;


        var data = $scope.resposta;
        $http.post('http://localhost:8080/TCC-GamificationJava/java/exercicio/post', data)
            .success(function (data) {
                $scope.retornoJava = data;
                var retorno = data.resposta;
                var resposta = $scope.exercicioJava.respostaJava;
                $scope.mensagem = verificarReposta(retorno, resposta);
                $('#javaModal').modal();

            });
    };

    function verificarReposta(retorno, resposta) {
        var mensagem = "";
        if (retorno === resposta) {
            mensagem = "Parabéns você acertou!";
            if ($scope.exercicioJava.tentativas === 0) {
                $scope.exercicioJava.pontos = $scope.exercicioJava.pontos - 20;
            }
            var pontuacao = {"login": Usuario.getLogin(), "pontos": $scope.exercicioJava.pontos};
            $http.post('http://localhost:8080/TCC-GamificationJava/usuario/pontos/put', pontuacao)
                .success(function (data) {
                    console.log("Enviado");
                });
            console.log("Acertou!!!");
        } else {
            if ($scope.exercicioJava.tentativas !== 0) {
                $scope.exercicioJava.tentativas = $scope.exercicioJava.tentativas - 1;
            }
            mensagem = "Você errou, tente novamente";
            console.log("Errou!!!");
        }
        return mensagem;
    }

});

appController.controller('UmlController', function ($scope, $http) {

    $scope.exercicio = {};
    $scope.alternativa = {};
    $scope.resposta = "";
    $scope.respostaUml = {};

    $http.get('http://localhost:8080/TCC-GamificationJava/uml/exercicio/get')
        .success(function (data) {
            $scope.exercicio = data;
            $scope.alternativa = data.alternativas;
            $scope.modulo = data.assunto.modulo;
        });

    $scope.enviarResposta = function () {
        $scope.mensagem = verificarReposta($scope.resposta, $scope.exercicio.respostaUml);
        $('#umlModal').modal();

    };

    function verificarReposta(resposta, respostaCorreta) {
        var mensagem = "";
        if (resposta === respostaCorreta) {
            mensagem = "Parabéns você acertou!";
            if ($scope.exercicio.tentativas === 0) {
                $scope.exercicio.pontos = $scope.exercicio.pontos - 20;
            }
            var pontuacao = {"pontos": $scope.exercicio.pontos};
            $http.post('http://localhost:8080/TCC-GamificationJava/usuario/pontos/put', pontuacao)
                .success(function (data) {
                    console.log("Foi e voltou");
                });
        } else {
            if ($scope.exercicio.tentativas !== 0) {
                $scope.exercicio.tentativas = $scope.exercicio.tentativas - 1;
            }
            mensagem = "Que pena você errou! Tente novamente";
        }
        return mensagem;
    }
});
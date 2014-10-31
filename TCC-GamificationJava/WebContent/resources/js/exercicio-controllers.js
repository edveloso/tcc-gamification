'use strict';
var appController = angular.module('app');

appController.factory('ExerciciosFactory', [ 'Modulo', 'Usuario',
    function (Modulo, Usuario) {

        var dataEx = {
            exercicios: {},
            qtd: 0,
            proxEx: 0,
            badges: []
        };

        return {
            getExercicios: function () {
                return dataEx.exercicios;
            },
            setExercicios: function (exercicios) {
                dataEx.exercicios = exercicios;
            },
            getQuantidade: function () {
                var x;
                for (x in dataEx.exercicios) {
                    dataEx.qtd = +1;
                }
                return dataEx.qtd;
            },
            getProxEx: function () {
                return dataEx.proxEx;
            },
            setProxEx: function (reset) {
                dataEx.proxEx = reset;
            },
            setBadges: function (conquistas) {
                dataEx.badges = conquistas;
            },
            getBadges: function () {
                return dataEx.badges;
            },
            salvarConquista: function () {
                dataEx.proxEx = dataEx.proxEx + 1;
                if (dataEx.exercicios[dataEx.proxEx] == undefined) {
                    var badge = dataEx.badges[0];
                    if(badge != undefined){
                    	Usuario.getUsuario().update({}, { id: badge.id });
                    }
                    return true;
                } else {
                    return false;
                }
            }
        };
    } ]);

appController.factory('RespostaFactory', function () {
    var data = {
        resposta: false,
        tentativas: 0,
        pontos: 0
    };

    return {
        verificarResposta: function (resposta, respostaCorreta) {
            if (resposta === respostaCorreta) {
                data.resposta = true;
                return data.resposta;
            } else {
                data.resposta = false;
                return data.resposta;
            }
        },
        verificarTentativa: function (tentativa) {
            if (tentativa !== 0) {
                return data.tentativas = tentativa - 1;
            } else {
                return data.tentativas;
            }
        },
        verificarPontos: function (pontos) {
            if (data.tentativas === 0 && pontos !== data.pontos) {
                data.pontos = pontos - 20;
                return data.pontos;
            } else {
                return pontos;
            }
        }
    };
});

appController.service('DicasService', function () {
    var data = [];
    var dicas = [];
    var pontosDicas = [ 10, 10, 10 ];
    
        this.setDicas = function (dica) {
            data = dica;
            pontosDicas[0] = 10;
            pontosDicas[1] = 10;
            pontosDicas[2] = 10;
            dicas = [];
        };
        this.getDicas = function () {
            return data;
        };
        this.tirarPontos = function (index) {
            var pontos = 0;
            if (index === 0 && pontosDicas[0] === 10) {
                pontos = pontosDicas[0];
                pontosDicas[0] = 0;
                return pontos;
            }
            if (index === 1 && pontosDicas[1] === 10) {
                pontos = pontosDicas[1];
                pontosDicas[1] = 0;
                return pontos;
            }
            if (index === 2 && pontosDicas[2] === 10) {
                pontos = pontosDicas[2];
                pontosDicas[2] = 0;
                return pontos;
            }
            return pontos;
        };
        this.getDica = function (tentativas) {
            switch (tentativas) {
                case 3:
                    dicas[0] = data[0];
                    return dicas;
                    break;
                case 2:
                    dicas[0] = data[0];
                    dicas[1] = data[1];
                    return dicas;
                    break;
                case 1:
                    dicas[0] = data[0];
                    dicas[1] = data[1];
                    dicas[2] = data[2];
                    return dicas;
                    break;
                default:
                    return data;
            }
        };
    
});

appController.controller('JavaController', function ($scope, $modal, $log, breadcrumbs, Modulo, Usuario, ExerciciosFactory, RespostaFactory, DicasService) {
	$scope.breadcrumbs = breadcrumbs;
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/java");

    $scope.exercicioJava = {};
    var codigo = "";

    var exercicio = ExerciciosFactory.getExercicios();
    var ex = ExerciciosFactory.getProxEx();
    Modulo.get({modulo: 'java', exercicio: exercicio[ex].id}, function (data) {
        $scope.exercicioJava = data;
        $scope.assunto = data.assunto;
        codigo = $scope.exercicioJava.codigoReferencia;
        editor.setValue(codigo);
        DicasService.setDicas($scope.exercicioJava.dicas);
    });
    
    $scope.enviarResposta = function (size) {
        codigo = editor.getSession().getValue();
        Modulo.save({
            modulo: 'java',
            exercicio: exercicio[ex].id
        }, {
            codigo: codigo
        }).$promise.then(function (data) {
                // success
                $scope.retornoJava = data;

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalInstanceCtrlJava,
                    size: size,
                    resolve: {
                        respostaEx: function () {
                            return $scope.retornoJava.resposta;
                        },
                        exercicio: function () {
                            return $scope.exercicioJava;
                        }
                    }
                });

                modalInstance.result.then(function (resultado) {
                	if (resultado.fim === true) {
                    	ExerciciosFactory.setProxEx(0);
                        resultado.location.path('home/modulos');
                    } else {
                    	resultado.route.reload();
                    }

                }, function (pontos) {
                    $scope.exercicioJava.tentativas = RespostaFactory
                        .verificarTentativa($scope.exercicioJava.tentativas);
                    $scope.exercicioJava.pontos = RespostaFactory
                        .verificarPontos($scope.exercicioJava.pontos);
                    $scope.exercicioJava.pontos -= pontos;
                });
            }, function (errResponse) {
                // fail
            });

    };
});

var ModalInstanceCtrlJava = function ($scope, $location, $route, $position, $modalInstance, Usuario, Progresso, RespostaFactory, ExerciciosFactory, respostaEx, exercicio, DicasService) {
	$scope.conquistas = ExerciciosFactory.getBadges();
    $scope.resultado = {
        fim: false,
        erro: false,
        status: "",
        location: $location,
        route: $route
    };
    $scope.modal = {
        alert: "",
        mensagem: ""
    };
    $scope.exercicio = exercicio;
    $scope.exercicio.dicas = DicasService.getDica(exercicio.tentativas);

    var pontos = 0;
    var retorno = RespostaFactory.verificarResposta(exercicio.respostaJava, respostaEx);
    if (retorno === true) {
        Usuario.getUsuario().save( {exercicioId: $scope.exercicio.id}, {pontos: exercicio.pontos});
        if (ExerciciosFactory.salvarConquista()) {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns! você chegou ao fim dos exercicios";
            $scope.resultado.fim = true;
        } else {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns você acertou!";
            $scope.resultado.fim = false;
        }
    } else {

        $scope.resultado.erro = true;
        $scope.modal.alert = "danger";
        $scope.modal.mensagem = "Que pena você errou!";

    }
    $scope.tirarPontos = function (index) {
        pontos += DicasService.tirarPontos(index, $scope.exercicio.pontos);
    };

    $scope.ok = function () {
        $modalInstance.close($scope.resultado);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss(pontos);
    };
};

appController.controller('UmlController', function ($scope, $modal, $log,  breadcrumbs, Modulo, Usuario, ExerciciosFactory, RespostaFactory, DicasService) {
	$scope.breadcrumbs = breadcrumbs;
    $scope.usuario = Usuario.getUsuario().get();
    $scope.resposta = "";
    $scope.respostaUml = {};
    var exercicio = ExerciciosFactory.getExercicios();
    var ex = ExerciciosFactory.getProxEx();
    Modulo.get({
        modulo: 'uml',
        exercicio: exercicio[ex].id
    }, function (data) {
        $scope.exercicio = data;
        $scope.alternativa = data.alternativas;
        $scope.assunto = data.assunto;
        $scope.exercicio.dicas = [ "Teste1", "Teste2", "Teste3" ];
        DicasService.setDicas($scope.exercicio.dicas);
    });
    
    
    $scope.enviarResposta = function (size) {    
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrlUml,
            size: size,
            resolve: {
                respostaEx: function () {
                    return $scope.resposta;
                },
                exercicio: function () {
                    return $scope.exercicio;
                }
            }
        });

        modalInstance.result.then(function (resultado) {
            if (resultado.fim === true) {
            	ExerciciosFactory.setProxEx(0);
                resultado.location.path('home/modulos');
            } else {
            	resultado.route.reload();
            }

        }, function (pontos) {
            $scope.exercicio.tentativas = RespostaFactory
                .verificarTentativa($scope.exercicio.tentativas);
            $scope.exercicio.pontos = RespostaFactory
                .verificarPontos($scope.exercicio.pontos);
            $scope.exercicio.pontos -= pontos;
        });
    };

});

var ModalInstanceCtrlUml = function ($scope, $location, $route, $position, $modalInstance, Usuario, Progresso,
                                      RespostaFactory, ExerciciosFactory, respostaEx, exercicio, DicasService) {
	
	$scope.conquistas = ExerciciosFactory.getBadges();
    $scope.resultado = {
        fim: false,
        erro: false,
        status: "",
        location: $location,
        route: $route
    };
    $scope.modal = {
        alert: "",
        mensagem: ""
    };
    $scope.exercicio = exercicio;
    $scope.exercicio.dicas = DicasService.getDica(exercicio.tentativas);

    var pontos = 0;
    var retorno = RespostaFactory.verificarResposta(exercicio.respostaUml, respostaEx);
    if (retorno === true) {
        Usuario.getUsuario().save({exercicioId: $scope.exercicio.id}, {pontos: exercicio.pontos});
        if (ExerciciosFactory.salvarConquista()) {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns! você chegou ao fim dos exercicios";
            $scope.resultado.fim = true;
            $scope.resultado.status = "fim";
        } else {
            $scope.modal.alert = "success";
            $scope.modal.mensagem = "Parabéns você acertou!";
            $scope.resultado.fim = false;
            $scope.resultado.status = "proximo";
        }
    } else {

        $scope.resultado.erro = true;
        $scope.modal.alert = "danger";
        $scope.modal.mensagem = "Que pena você errou!";
        $scope.resultado.status= "erro";
    }
    $scope.tirarPontos = function (index) {
        pontos += DicasService.tirarPontos(index, $scope.exercicio.pontos);
    };

    $scope.ok = function () {
        $modalInstance.close($scope.resultado);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss(pontos);
    };
};
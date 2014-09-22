'use strict';
var appController = angular.module('app');

appModule.factory('exercicios',['Modulo', 'Usuario', 'usuario', function (Modulo, Usuario, usuario) {

    var dataEx = {exercicios: {}, qtd: 0, proxEx: 0, badges: []};
    
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
    	    	dataEx.qtd =+ 1;
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
    	salvarConquista: function () {
    		dataEx.proxEx = dataEx.proxEx + 1;
    		if (dataEx.exercicios[dataEx.proxEx] == undefined) {
    			var badge = dataEx.badges[0];
	     	    Usuario.update({login: usuario.getLogin()}, {id: badge.id});
    			
    			return true;
    		}else{
    			return false;
    		}
    	},
    };
}]);

appModule.factory('resposta', function () {
	var data = {resposta: false, tentativas: 0, pontos: 0};

    return { 
    	verificarResposta: function (resposta, respostaCorreta) {
    		if (resposta === respostaCorreta) {
    			data.resposta = true;
    			return data.resposta;
    		}else{
    			data.resposta = false;
    			return data.resposta;
    		}
    	},verificarTentativa: function (tentativa) {
    		if (tentativa !== 0) {
    			return data.tentativas = tentativa - 1;
    		}else{
    			return data.tentativas;
    		}
    	},verificarPontos: function (pontos) {
    		if (data.tentativas === 0 && pontos !== data.pontos) {
    			data.pontos = pontos - 20;
    			return data.pontos;
    		}else{
    			return pontos;
    		}
    	},
    };
});

appController.controller('JavaController', function ($scope, $http, $location, usuario, exercicios, resposta, Modulo, Usuario) {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/java");

    $scope.exercicioJava = {};
    var codigo = "";
    
    var exercicio = exercicios.getExercicios();
    var ex = exercicios.getProxEx();
    Modulo.get({ modulo:'java', exercicio: exercicio[ex].id }, function(data) {
            $scope.exercicioJava = data;
            $scope.modulo = data.assunto.modulo;
            codigo = $scope.exercicioJava.codigoReferencia;
            editor.setValue(codigo);
        });

    $scope.enviarExercicio = function () {
        codigo = editor.getSession().getValue();
        Modulo.save({ modulo:'java', exercicio: exercicio[ex].id }, {codigo: codigo}, function(data) {
                $scope.retornoJava = data;
                var retorno = resposta.verificarResposta(data.resposta, $scope.exercicioJava.respostaJava);
            	if(retorno === true){    		
            		Usuario.save({login: usuario.getLogin()}, {pontos: $scope.exercicioJava.pontos});
            		if(exercicios.salvarConquista() == true){
                		$('#javaModalFim').modal();
            		}else{
                		$('#javaModalAcerto').modal();
            		}
            		
            	}else{
            		$scope.exercicioJava.tentativas = resposta.verificarTentativa($scope.exercicioJava.tentativas);
            		$scope.exercicioJava.pontos = resposta.verificarPontos($scope.exercicioJava.pontos);
            		$('#javaModalErro').modal();
            	}

            });
    };
    
    $scope.dica1 = {"status": true, "id": 1, "hidden": false};
    $scope.dica2 = {"status": true, "id": 2, "hidden": false};
    $scope.dica3 = {"status": true, "id": 3, "hidden": false};

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
    
    $scope.voltarModulos = function() {
    	exercicios.setProxEx(0);
    };
    $scope.enviarResposta = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            },
            respostaEx: function () {
              return $scope.resposta;
            },
            respostaCerta: function () {
              return $scope.exercicio.respostaUml;
            },
            tentativas: function () {
              return $scope.exercicio.tentativas
            },
            pontos: function () {
              return $scope.exercicio.pontos;
            },
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
});

appController.controller('UmlController', function ($scope, $modal, $log, usuario, Modulo, Usuario, exercicios, resposta) {

    $scope.resposta = "";
    $scope.respostaUml = {};
    var exercicio = exercicios.getExercicios();
    var ex = exercicios.getProxEx();
    Modulo.get({ modulo:'uml', exercicio: exercicio[ex].id }, function(data) {
    	$scope.exercicio = data;
    	$scope.alternativa = data.alternativas;
    	$scope.modulo = data.assunto.modulo;
    });

    $scope.enviarRespostaT = function () {
       
    	var retorno = resposta.verificarResposta($scope.resposta, $scope.exercicio.respostaUml);
    	if(retorno === true){
    		Usuario.save({login: usuario.getLogin()}, {pontos: $scope.exercicioJava.pontos});
    		if(exercicios.salvarConquista() == true){
        		$('#umlModalFim').modal();
    		}else{
        		$('#umlModalAcerto').modal();
    		}
    	}else{
    		$scope.exercicio.tentativas = resposta.verificarTentativa($scope.exercicio.tentativas);
    		$scope.exercicio.pontos = resposta.verificarPontos($scope.exercicio.pontos);
    		$('#javaModalErro').modal();
    	}

    };
    $scope.dica1 = {"status": true, "id": 1, "hidden": false};
    $scope.dica2 = {"status": true, "id": 2, "hidden": false};
    $scope.dica3 = {"status": true, "id": 3, "hidden": false};

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
    
    $scope.voltarModulos = function() {
    	exercicios.setProxEx(0);
    };
    
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.enviarResposta = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        size: size,
        resolve: {
          respostaEx: function () {
            return $scope.resposta;
          },
          exercicio: function () {
            return $scope.exercicio;
          },
        }
      });

      modalInstance.result.then(function (resultado) {
    	if(resultado.fim === true){
    		resultado.location.path('/modulos');
    	 }else{
    		resultado.location.path('/uml/exercicios');
    	 }
         
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
        $scope.exercicio.tentativas = resposta.verificarTentativa($scope.exercicio.tentativas);
		$scope.exercicio.pontos = resposta.verificarPontos($scope.exercicio.pontos);
      });
    };
    
});

var ModalInstanceCtrl = function ($scope, $location, $modalInstance, Usuario, usuario, resposta, exercicios, respostaEx, exercicio) {
	  
	  $scope.resultado = {fim: false, erro: false, location: $location};
	  $scope.modal = {alert: "", mensagem: ""};
	  var retorno = resposta.verificarResposta(exercicio.respostaUml, respostaEx);
  	  if(retorno === true){
  		Usuario.save({login: usuario.getUsuario().login}, {pontos: exercicio.pontos});
  		if(exercicios.salvarConquista){
  			$scope.modal.alert = "success";
  			$scope.modal.mensagem = "Parabéns! você chegou ao fim dos exercicios";
  			$scope.resultado.fim = true;
  		}else{
  			$scope.modal.alert = "success";
  			$scope.modal.mensagem = "Parabéns você acertou!";
  			$scope.resultado.fim = false;
  		}
  	  }else{
  		$scope.resultado.erro = true;
  		$scope.modal.alert = "danger";
  		$scope.modal.mensagem = "Que pena você errou!";
  		
  	  }

	  $scope.ok = function () {
	    $modalInstance.close($scope.resultado);
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	};
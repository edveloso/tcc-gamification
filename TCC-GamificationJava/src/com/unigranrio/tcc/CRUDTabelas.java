package com.unigranrio.tcc;

import java.util.ArrayList;
import java.util.List;

import com.unigranrio.tcc.dao.AssuntoDAO;
import com.unigranrio.tcc.dao.ModuloDAO;
import com.unigranrio.tcc.dao.NivelDAO;
import com.unigranrio.tcc.dao.UsuarioDAO;
import com.unigranrio.tcc.model.entity.Assunto;
import com.unigranrio.tcc.model.entity.Modulo;
import com.unigranrio.tcc.model.entity.Nivel;
import com.unigranrio.tcc.model.entity.Usuario;

public class CRUDTabelas {

	public static void main(String[] args) {
		
		//inserirModulo();
		inserirAssunto();
		alterarModulo();
		buscarModulo();
	}

	public static void inserirNivel() {
		Nivel nivel0 = new Nivel();
		nivel0.setNome("Novato");
		nivel0.setPontos(0);
		nivel0.setNomeImagem("novato.png");

		Nivel nivel1 = new Nivel();
		nivel1.setNome("Programador");
		nivel1.setPontos(500);
		nivel1.setNomeImagem("programador.png");

		Nivel nivel2 = new Nivel();
		nivel2.setNome("Ninja");
		nivel2.setPontos(1000);
		nivel2.setNomeImagem("ninja.png");

		Nivel nivel3 = new Nivel();
		nivel3.setNome("Experiente");
		nivel3.setPontos(2000);
		nivel3.setNomeImagem("experiente.png");

		Nivel nivel4 = new Nivel();
		nivel4.setNome("Javaman");
		nivel4.setPontos(2500);
		nivel4.setNomeImagem("javaman.png");

		NivelDAO nivelDAO = new NivelDAO();
		nivelDAO.gravarNivel(nivel0);
		nivelDAO.gravarNivel(nivel1);
		nivelDAO.gravarNivel(nivel2);
		nivelDAO.gravarNivel(nivel3);
		nivelDAO.gravarNivel(nivel4);
	}

	public static void inserirUsuario() {
		NivelDAO nivelDAO = new NivelDAO();
		Nivel nivel = nivelDAO.buscarNivelByNome("Novato");

		Usuario usuario = new Usuario();
		usuario.setNome("Igor Marcelo");
		usuario.setLogin("igmarcelo");
		usuario.setSenha("123456");
		usuario.setPontos(0);
		usuario.setNivel(nivel);
		usuario.setBadges(null);

		UsuarioDAO usuarioDAO = new UsuarioDAO();
		usuarioDAO.gravarUsuario(usuario);
	}

	public static void buscarNivel() {
		NivelDAO nivelDAO = new NivelDAO();
		Nivel nivel = nivelDAO.buscarNivelByNome("Novato");

		System.out.println("Nivel nome: " + nivel.getNome());
	}

	public static void inserirModulo() {
		Modulo modulo0 = new Modulo();
		modulo0.setNome("Aprofundando em Java");
		
		Modulo modulo1 = new Modulo();
		modulo1.setNome("UML");
		
		Modulo modulo2 = new Modulo();
		modulo2.setNome("Conceitos de Orienta��o a Objeto com Java");

		ModuloDAO moduloDAO = new ModuloDAO();
		moduloDAO.gravarModulo(modulo0);
		moduloDAO.gravarModulo(modulo1);
		moduloDAO.gravarModulo(modulo2);

	}

	public static void buscarModulo() {
		ModuloDAO moduloDAO = new ModuloDAO();
		Modulo modulo0 = moduloDAO.buscarModuloByNome("Aprofundando em Java");
		for (Assunto assunto : modulo0.getAssuntos()) {
			System.out.println("ID: " + assunto.getId());
			System.out.println("Nome: " + assunto.getNome());
		}
	}

	public static void alterarModulo() {
		ModuloDAO moduloDAO = new ModuloDAO();
		AssuntoDAO assuntoDAO = new AssuntoDAO();
		
		Modulo modulo0 = moduloDAO.buscarModuloByNome("Aprofundando em Java");
		List<Assunto> assuntos = assuntoDAO.listarAssuntosByModulo(modulo0);
		
		modulo0.setAssuntos(assuntos);

		moduloDAO.alterarModulo(modulo0);
	}

	public static void inserirAssunto() {
		ModuloDAO moduloDAO = new ModuloDAO();
		AssuntoDAO assuntoDAO = new AssuntoDAO();

		Modulo modulo0 = moduloDAO.buscarModuloByNome("Aprofundando em Java");

		ArrayList<Assunto> assuntos = new ArrayList<Assunto>();

		Assunto assunto0 = new Assunto();
		assunto0.setNome("Cria��o de packages");
		assunto0.setModulo(modulo0);
		assuntos.add(assunto0);

		assuntoDAO.gravarAssunto(assunto0);
		

	};
}

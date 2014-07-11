package com.unigranrio.tcc;

import com.unigranrio.tcc.dao.NivelDAO;
import com.unigranrio.tcc.dao.UsuarioDAO;
import com.unigranrio.tcc.model.entity.Nivel;
import com.unigranrio.tcc.model.entity.Usuario;

public class Teste {
	
	public static void main(String[] args) {
		//inserirNivel();
		inserirUsuario();
	}

	public static void inserirNivel(){
		Nivel nivel = new Nivel();
		nivel.setNome("Novato");
		nivel.setPontos(0);
		nivel.setCaminhoImagem("image/novato.png");
		
		NivelDAO nivelDAO = new NivelDAO();
		nivelDAO.gravarNivel(nivel);
	}
	
	public static void inserirUsuario(){
		Usuario usuario = new Usuario();
		usuario.setNome("Teste");
		usuario.setLogin("teste");
		usuario.setSenha("123456");
		usuario.setPontos(0);
		usuario.setNivel(null);
		usuario.setAssuntos(null);
		usuario.setBadges(null);
		
		UsuarioDAO usuarioDAO = new UsuarioDAO();
		usuarioDAO.gravarUsuario(usuario);
	}
}

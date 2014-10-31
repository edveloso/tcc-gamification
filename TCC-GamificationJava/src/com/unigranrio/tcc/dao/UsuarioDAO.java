package com.unigranrio.tcc.dao;

import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.unigranrio.tcc.model.entity.Conquista;
import com.unigranrio.tcc.model.entity.Progresso;
import com.unigranrio.tcc.model.entity.Usuario;

@Repository
public class UsuarioDAO {

	@PersistenceContext
	private EntityManager manager;

	public void gravarUsuario(Usuario usuario) {

		manager.persist(usuario);
	}

	public Usuario buscarUsuarioByLogin(String login) {

		Usuario usuario = manager.find(Usuario.class, login);

		return usuario;
	}

	public void atualizarPontosUsuario(Usuario usuario) {
		Query query = manager.createNamedQuery("Usuario.updatePontos");
		query.setParameter("pontos", usuario.getPontos());
		query.setParameter("login", usuario.getLogin());
		query.executeUpdate();
	}


	public void atualizarProgressoUsuario(Usuario usuario) {
		manager.merge(usuario);
	}
	
	public void deletarUsuario(Usuario usuario){
		manager.remove(usuario);
	}

	public List<Usuario> listarUsuarios() {

		Query query = manager.createNamedQuery("Usuario.findAll");
		List<Usuario> usuarios = query.getResultList();

		return usuarios;
	}

	public List<Usuario> listarUsuariosPorPontuacao() {

		Query query = manager.createNamedQuery("Usuario.listByPontuacao");
		List<Usuario> usuarios = query.getResultList();

		return usuarios;
	}

	public List<Conquista> listarBadgesUsuario(String login) {

		Query query = manager.createNamedQuery("Usuario.allBadges");
		query.setParameter("login", login);
		List<Conquista> badges = query.getResultList();
		return badges;
	}
	
	public List<Progresso> listarProgressosUsuario(String login) {

		Query query = manager.createNamedQuery("Usuario.allProgressos");
		query.setParameter("login", login);
		List<Progresso> progresso = query.getResultList();
		return progresso;
	}

	public long buscarPosicaoUsuario(int pontos) {

		Query query = manager.createNamedQuery("Usuario.getPosicao");
		query.setParameter("pontos", pontos);
		long posicao = (long) query.getSingleResult();
		posicao = posicao + 1;
		return posicao;
	}

}

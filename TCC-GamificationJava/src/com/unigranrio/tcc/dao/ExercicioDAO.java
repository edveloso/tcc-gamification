package com.unigranrio.tcc.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.unigranrio.tcc.model.entity.Assunto;
import com.unigranrio.tcc.model.entity.Exercicio;
import com.unigranrio.tcc.model.entity.ExercicioJava;
import com.unigranrio.tcc.model.entity.ExercicioUml;
import com.unigranrio.tcc.model.entity.ImagemExercicio;

@Repository
public class ExercicioDAO {

	@PersistenceContext
	private EntityManager manager;

	public void gravarImagemExercicio(ImagemExercicio imgExercicio) {

		manager.persist(imgExercicio);

	}

	public void gravarExercicio(Exercicio exercicio) {

		manager.persist(exercicio);

	}

	public void gravarExercicioJava(Exercicio exercicioJava) {

		manager.persist(exercicioJava);

	}

	public void gravarExercicioUml(ExercicioUml exercicioUml) {

		manager.persist(exercicioUml);

	}

	public void alterarExercicioJava(ExercicioJava exJava) {

		manager.merge(exJava);

	}

	public void alterarExercicioUml(ExercicioUml exUml) {

		manager.merge(exUml);

	}

	public ExercicioJava buscarExercicioJavaById(long id) {

		Query query = manager.createNamedQuery("ExercicioJava.findById");
		query.setParameter("id", id);
		ExercicioJava exJava = (ExercicioJava) query.getSingleResult();

		return exJava;
	}

	public ExercicioUml buscarExercicioUmlById(long id) {

		Query query = manager.createNamedQuery("ExercicioUml.findById");
		query.setParameter("id", id);
		ExercicioUml exUml = (ExercicioUml) query.getSingleResult();

		return exUml;
	}

	public List<Exercicio> buscarExerciciosByAssunto(Assunto assunto) {

		Query query = manager.createNamedQuery("Exercicio.ExercicioByAssunto");
		query.setParameter("assunto", assunto);
		List<Exercicio> exercicios = query.getResultList();

		return exercicios;
	}
	
	public List<Exercicio> buscarTodosExercicios() {

		Query query = manager.createNamedQuery("Exercicio.ExercicioAll");
		List<Exercicio> exercicios = query.getResultList();

		return exercicios;
	}
	

	public Exercicio buscarExercicioById(long id) {

		Query query = manager.createNamedQuery("Exercicio.ExercicioById");
		query.setParameter("id", id);
		Exercicio exercicio = (Exercicio) query.getSingleResult();

		return exercicio;
	}
}

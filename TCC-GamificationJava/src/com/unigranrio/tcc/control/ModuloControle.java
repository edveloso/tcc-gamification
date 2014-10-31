package com.unigranrio.tcc.control;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.unigranrio.tcc.dao.ExercicioDAO;
import com.unigranrio.tcc.dao.ModuloDAO;
import com.unigranrio.tcc.model.AssuntoBean;
import com.unigranrio.tcc.model.ExercicioBean;
import com.unigranrio.tcc.model.ModuloBean;
import com.unigranrio.tcc.model.entity.Assunto;
import com.unigranrio.tcc.model.entity.Exercicio;
import com.unigranrio.tcc.model.entity.Modulo;

@Transactional
@Controller
public class ModuloControle {

	private ModuloDAO moduloDAO;
	private ExercicioDAO exercicioDAO;

	@Autowired
	public void setModuloDAOeExercicioDAO(ModuloDAO moduloDAO, ExercicioDAO exercicioDAO) {
		this.moduloDAO = moduloDAO;
		this.exercicioDAO = exercicioDAO;
	}

	@RequestMapping(value = "/modulo/assunto/exercicio", method = RequestMethod.GET)
	public @ResponseBody List<ModuloBean> listarModulos() {

		List<ModuloBean> modulosBean = new LinkedList<ModuloBean>();
		for (Modulo modulo : moduloDAO.listarModulos()) {
			ModuloBean moduloBean = modulo.getModuloBean();
			List<AssuntoBean> assuntosBean = new ArrayList<AssuntoBean>();
			for(Assunto assunto : modulo.getAssuntos()){
				AssuntoBean assuntoBean = assunto.getAssuntoBean();
				assuntoBean.setExercicios(assunto.getExerciciosBean());
				assuntoBean.setConquistas(assunto.getConquistasBean());
				assuntosBean.add(assuntoBean);
			}
			moduloBean.setAssuntos(assuntosBean);

			modulosBean.add(moduloBean);
		}

		return modulosBean;
	}
	
	@RequestMapping(value = "/modulo/assunto/{assunto}/exercicio", method = RequestMethod.GET)
	public @ResponseBody List<ExercicioBean> listarExercicios(@PathVariable long assunto) {
		List<ExercicioBean> exerciciosBean = new ArrayList<ExercicioBean>();
		Assunto assunto1 = new Assunto();
		assunto1.setId(assunto);
		for(Exercicio exercicio : exercicioDAO.buscarExerciciosByAssunto(assunto1)){
			ExercicioBean exercicioBean = exercicio.getExercicioBean();
			exerciciosBean.add(exercicioBean);
		}
		return exerciciosBean;
	}
	
	

}

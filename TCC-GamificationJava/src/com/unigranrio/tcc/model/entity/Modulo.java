package com.unigranrio.tcc.model.entity;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;



import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.unigranrio.tcc.model.AssuntoBean;
import com.unigranrio.tcc.model.ModuloBean;
import com.unigranrio.tcc.model.ProgressoBean;


@Entity
@NamedQueries ({
@NamedQuery(name = "Modulo.findByNome", query = "SELECT m FROM Modulo m LEFT JOIN FETCH m.assuntos WHERE m.nome = :nome"),
@NamedQuery(name = "Modulo.listAll", query = "SELECT DISTINCT (m) FROM Modulo m, Assunto a LEFT JOIN FETCH m.assuntos")
})
public class Modulo {
	
	@Id
	@GeneratedValue
	private Long id;
	private String nome;
	
	@OneToMany
	private List<Assunto> assuntos;
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public List<Assunto> getAssuntos() {
		return assuntos;
	}

	public void setAssuntos(List<Assunto> assuntos) {
		this.assuntos = assuntos;
	}
	
	public List<AssuntoBean> getAssuntosBean(){
		List<AssuntoBean> assuntosBean = new LinkedList<AssuntoBean>();
		for(Assunto assunto : assuntos){
			AssuntoBean assuntoBean = assunto.getAssuntoBean();
			assuntoBean.setExercicios(assunto.getExerciciosBean());
			assuntoBean.setConquistas(assunto.getConquistasBean());
			assuntosBean.add(assuntoBean);
		}
		
		return assuntosBean;
	}
	
	
	public ModuloBean getModuloBean(){
		ModuloBean modulo = new ModuloBean();
		modulo.setId(id);
		modulo.setNome(nome);
		
		return modulo;
	}
}

package com.unigranrio.tcc.model.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;

import com.unigranrio.tcc.model.ExercicioBean;
import com.unigranrio.tcc.model.ProgressoBean;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@NamedQueries({
		@NamedQuery(name = "Exercicio.ExercicioByAssunto", query = "SELECT e FROM Exercicio e WHERE e.assunto = :assunto ORDER BY e.id ASC"),
		@NamedQuery(name = "Exercicio.ExercicioById", query = "SELECT e FROM Exercicio e WHERE e.id = :id"),
		@NamedQuery(name = "Exercicio.ExercicioAll", query = "SELECT e FROM Exercicio e"),})
public class Exercicio {

	@Id
	@GeneratedValue
	private Long id;

	private String nome;
	private String descricao;
	private int tentativas;
	private int pontos;

	@ElementCollection(fetch = FetchType.EAGER)
	private List<String> dicas;

	// @ManyToOne(optional = false)
	@ManyToOne
	private Assunto assunto;
	
	@OneToMany
	private List<Progresso> historico;
	
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

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public int getTentativas() {
		return tentativas;
	}

	public void setTentativas(int tentativas) {
		this.tentativas = tentativas;
	}

	public int getPontos() {
		return pontos;
	}

	public void setPontos(int pontos) {
		this.pontos = pontos;
	}

	public List<String> getDicas() {
		return dicas;
	}

	public void setDicas(List<String> dicas) {
		this.dicas = dicas;
	}

	public Assunto getAssunto() {
		return assunto;
	}

	public void setAssunto(Assunto assunto) {
		this.assunto = assunto;
	}
	
	public List<Progresso> getHistorico() {
		return historico;
	}

	public void setHistorico(List<Progresso> historico) {
		this.historico = historico;
	}

	public List<ProgressoBean> getProgressosBean(){
		List<ProgressoBean> progressosBean = new ArrayList<ProgressoBean>();
		for(Progresso progresso : historico){
			ProgressoBean progressoBean = progresso.getProgressoBean();
			
			progressosBean.add(progressoBean);
		}
		
		return progressosBean;
	}
	public ExercicioBean getExercicioBean() {
		ExercicioBean exercicioBean = new ExercicioBean();
		exercicioBean.setId(id);
		exercicioBean.setNome(nome);
		exercicioBean.setDescricao(descricao);
		exercicioBean.setTentativas(tentativas);
		exercicioBean.setPontos(pontos);
		exercicioBean.setAssunto(assunto.getAssuntoBean());

		return exercicioBean;
	}

}

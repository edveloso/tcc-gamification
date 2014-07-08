package com.unigranrio.tcc.model.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;


@Entity
public class Usuario {

	private String nome;
	
	@Id
	private String login;
	@Column (nullable = false)
	private String senha;
	
	//@Column (nullable = false)
	//private Nivel nivel;
	
	@Column (nullable = false)
	private int pontos;
	
	private ArrayList<Assunto> assuntos;
	private ArrayList<Conquista> badges;
	

	public Usuario() { 

	}


	public String getNome() {
		return nome;
	}


	public void setNome(String nome) {
		this.nome = nome;
	}


	public String getLogin() {
		return login;
	}


	public void setLogin(String login) {
		this.login = login;
	}


	public String getSenha() {
		return senha;
	}


	public void setSenha(String senha) {
		this.senha = senha;
	}


//	public Nivel getNivel() {
//		return nivel;
//	}
//
//
//	public void setNivel(Nivel nivel) {
//		this.nivel = nivel;
//	}


	public int getPontos() {
		return pontos;
	}


	public void setPontos(int pontos) {
		this.pontos = pontos;
	}


	public List<Assunto> getAssuntos() {
		return assuntos;
	}


	public ArrayList<Conquista> getBadges() {
		return badges;
	}


	public void setBadges(ArrayList<Conquista> badges) {
		this.badges = badges;
	}


	public void setAssuntos(ArrayList<Assunto> assuntos) {
		this.assuntos = assuntos;
	}
	
	
}
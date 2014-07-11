package com.unigranrio.tcc.control;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.unigranrio.tcc.dao.UsuarioDAO;
import com.unigranrio.tcc.exercicio.Programa;
import com.unigranrio.tcc.model.CodigoBean;
import com.unigranrio.tcc.model.RespostaExercicioBean;
import com.unigranrio.tcc.model.UsuarioBean;
import com.unigranrio.tcc.model.entity.Usuario;


@Controller
public class UsuarioControle {
	
	private UsuarioDAO dao = new UsuarioDAO();
	private Programa programa = new Programa();
	private Usuario usuario = new Usuario();
		
	@RequestMapping(value = "/usuario", method = RequestMethod.GET)
	public @ResponseBody
	Usuario getUsuario() {
		Usuario usuario = dao.buscarUsuarioByLogin("");
		return usuario;
	}
	
	@RequestMapping(value = "/codigo00", method = RequestMethod.POST)
	public @ResponseBody
	RespostaExercicioBean receberRespostaExercicio(@RequestBody CodigoBean codigo){
		System.out.println("Codigo Recebido: " + codigo.getCodigo());
		
		String respostaConsole = programa.executar(codigo.getCodigo());
		System.out.println("Resposta da Compilação: " + respostaConsole);
		RespostaExercicioBean retorno = new RespostaExercicioBean(respostaConsole);
		return retorno;
	}
	
	@RequestMapping(value = "/novoUsuario", method = RequestMethod.POST)
	public @ResponseBody
	String CadastrarUsuario(@RequestBody UsuarioBean usuarioBean){
		System.out.println("Chegou!!!");
		usuario.setNome(usuarioBean.getNome());
		usuario.setLogin(usuarioBean.getLogin());
		usuario.setSenha(usuarioBean.getSenha());
		dao.gravarUsuario(usuario);
		
		return "Cadastrado";
	}

}

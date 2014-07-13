package com.unigranrio.tcc.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class AutorizacaoInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object controller) throws Exception {

		String uri = request.getRequestURI();
		if (uri.endsWith("resources/html/")) {
			return true;
		}

		if (request.getSession().getAttribute("usuarioLogado") != null) {
			return true;
		}

		response.sendRedirect("resources/html/");
		return false;
	}
}

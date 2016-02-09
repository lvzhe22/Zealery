package com.revoemag.user.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;

import com.revoemag.user.bean.User;
import com.revoemag.user.factory.UserFactory;
import com.sun.jersey.api.NotFoundException;

@Path("login/{uid}/{pass}")
public class UserService {
	
	@Context
	UriInfo uinfo;
	
	@Context
	Request request;
	
	@GET
	@Produces({MediaType.APPLICATION_ATOM_XML, MediaType.APPLICATION_JSON})
	public User getUser(@PathParam("uid") String uid, @PathParam("pass") String pass) {
		User u = UserFactory.getUserById(uid);
		if(u==null) throw new NotFoundException("There is no such User.");
		if(!pass.equals(u.getPassword())) throw new NotFoundException("Password is wrong.");
		return u;
	}
}

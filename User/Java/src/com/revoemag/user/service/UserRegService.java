package com.revoemag.user.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.revoemag.user.factory.UserFactory;

@Path("register/{uid}/{pass}/{fname}/{lname}")
public class UserRegService {
	
	@GET
	@Produces({MediaType.APPLICATION_ATOM_XML, MediaType.APPLICATION_JSON})
	public String doScore(@PathParam("uid") String uid, @PathParam("pass") String pass, @PathParam("fname") String fname, @PathParam("lname") String lname) {
		int ret = -1;
		if(checkEmpty(uid) || checkEmpty(pass) || checkEmpty(fname) || checkEmpty(lname)) ret = 0;
		else ret = UserFactory.registerUser(uid, pass, fname, lname);
		return new Integer(ret).toString();
	}
	
	private boolean checkEmpty(String s) {
		return (null == s) || (s.isEmpty());
	}

}

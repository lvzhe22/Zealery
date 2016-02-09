package com.revoemag.user.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.revoemag.user.factory.UserFactory;

@Path("scores/{uid}")
public class UserScoreListService {
	
	@GET
	@Produces({MediaType.APPLICATION_ATOM_XML, MediaType.APPLICATION_JSON})
	public String doScore(@PathParam("uid") String uid) {
		if(null == uid || uid.isEmpty()) return "{}";
		return UserFactory.getScoreList(uid);
	}

}

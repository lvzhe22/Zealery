package com.revoemag.user.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.revoemag.user.factory.UserFactory;

@Path("score/{uid}/{score}")
public class UserScoreService {
	
	@GET
	@Produces({MediaType.APPLICATION_ATOM_XML, MediaType.APPLICATION_JSON})
	public String doScore(@PathParam("uid") String uid, @PathParam("score") String score) {
		int scr = Integer.parseInt(score);
		if(UserFactory.getUserById(uid)==null) return "No Such User["+uid+"]";
		int ret = -1;
		if(scr<0) {
			ret = UserFactory.getUserScoreById(uid);
		} else {
			ret = UserFactory.updateUserScore(uid, scr);
		}
		if(ret<0) return "Unknown error.";
		else return new Integer(ret).toString();
	}
}

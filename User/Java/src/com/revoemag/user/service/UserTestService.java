package com.revoemag.user.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.revoemag.db.DB;

@Path("/test")
public class UserTestService {

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String count() {
		return new Integer(DB.test()).toString();
	}
}

package com.revoemag.user.factory;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.revoemag.db.DB;
import com.revoemag.user.bean.User;

public class UserFactory {
	
	public static List<User> getUsers() {
		return null;
	}
	
	public static String getScoreList(String uid) {
		String ret = "{";
		Connection con = DB.connect();
		if(con == null) return ret + "}";
		Statement st;
		try {
			st = con.createStatement();
			ResultSet res = st.executeQuery("select score, dtime from schistory where uid='"+ uid + "';");
			ret += "scores:[ ";
			while(res.next()) {
				int sc = res.getInt("score");
				Date dtime = res.getTimestamp("dtime");
				ret += "{\"score\":\""+new Integer(sc).toString()+"\", \"dtime\":\""+new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(dtime)+"\"},";
			}
			ret = ret.substring(0, ret.length()-1);
			ret += "]}";
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return "{}";
		}
		return ret;
	}
	
	public static int getUserScoreById(String uid) {
		int ret = -1;
		Connection con = DB.connect();
		if(con == null) return -1;
		Statement st;
		try {
			st = con.createStatement();
			ResultSet res = st.executeQuery("select sum(score) as sc from schistory where uid='"+ uid + "';");
			if(res.next()) {
				ret = res.getInt("sc");
			}
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return -1;
		}
		return ret;
	}
	
	public static int updateUserScore(String uid, int score) {
		Connection con = DB.connect();
		if(con == null) return -1;
		Statement st;
		try {
			st = con.createStatement();
			String curDate = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date());
			st.executeUpdate("insert into schistory values(null, '"+ uid + "', 1, "+score+", '"+ curDate + "');");
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return -1;
		}
		return getUserScoreById(uid);
	}
	
	public static User getUserById(String uid) {
		User u = null;
		
		Connection con = DB.connect();
		if(con == null) return null;
		Statement st;
		try {
			st = con.createStatement();
			ResultSet res = st.executeQuery("select * from users where uid='"+ uid + "';");
			if(res.next()) {
				u = new User();
				u.setUid(uid);
				u.setUsername(res.getString("username"));
				u.setPassword(res.getString("password"));
				u.setFname(res.getString("fname"));
				u.setLname(res.getString("lname"));
			}
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
		return u;
	}
	
	public static int registerUser(String email, String pass, String fname, String lname) {
		Connection con = DB.connect();
		if(con == null) return -1;
		int ret = 0;
		Statement st;
		try {
			st = con.createStatement();
			ret = st.executeUpdate("insert into users values('"+ email + "', '"+ email + "', '"+ pass + "', '"+ fname + "', '"+ lname + "');");
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return -1;
		}
		return (ret > 0) ? 1 : 0;
	}

}

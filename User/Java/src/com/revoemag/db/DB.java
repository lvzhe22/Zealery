package com.revoemag.db;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class DB {
	
	private static String HOST = "jdbc:mysql://localhost:3306/revoemag";
	private static String USERNAME = "root";
	private static String PASSWORD = "5zS3qFRb";
	private static String DRIVER = "com.mysql.jdbc.Driver";
	
	public static Connection connect() {
		Connection con = null;
		try {
			Properties prop = new Properties();
			prop.load(DB.class.getClassLoader().getResourceAsStream("db.properties"));
			Class.forName(prop.getProperty("driver")).newInstance();
			con = DriverManager.getConnection(prop.getProperty("host"), prop.getProperty("username"), prop.getProperty("password"));
		} catch (SQLException | InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			e.printStackTrace();
			return null;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return con;
	}
	
	public static int test() {
		int ret = -1;
		try {
			Class.forName(DRIVER).newInstance();
			Connection con = DriverManager.getConnection(HOST, USERNAME, PASSWORD);
			Statement st = con.createStatement();
			ResultSet res = st.executeQuery("select count(*) as howmany from users;");
			if(res.next()) {
				ret = res.getInt("howmany");
			}
			con.close();
		} catch (SQLException | InstantiationException | IllegalAccessException | ClassNotFoundException e) {
			e.printStackTrace();
			return -1;
		}
		return ret;
	}

}

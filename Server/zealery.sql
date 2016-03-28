-----------------------------------------------------------------
-- Create DB
-----------------------------------------------------------------
CREATE DATABASE zealery
  WITH ENCODING='UTF8'
       CONNECTION LIMIT=-1;

-----------------------------------------------------------------
-- Create Tables
-----------------------------------------------------------------

CREATE TABLE public.users
(
   userid bigserial NOT NULL, 
   username character varying(50) NOT NULL, 
   firstname character varying(50), 
   lastname character varying(50), 
   gender boolean, 
   dob date, 
   email character varying(200) NOT NULL, 
   status smallint NOT NULL DEFAULT 0, 
   createdtime timestamp without time zone, 
   modifiedtime timestamp without time zone, 
   CONSTRAINT pk_user PRIMARY KEY (userid)
) 
WITH (
  OIDS = FALSE
)
;


insert into users(username,firstname,lastname,email) values('zhelu','zhe','lu','zhelu@zealery.com');
insert into users(username,firstname,lastname,email) values('wentaoxiao','wentao','xiao','wentaoxiao@zealery.com');
insert into users(username,firstname,lastname,email) values('navtejsingh','navtej','singh','navtejsingh@zealery.com');



CREATE TABLE public.post
(
  pid bigint NOT NULL DEFAULT nextval('post_pid_seq'::regclass),
  userid bigint NOT NULL DEFAULT nextval('post_userid_seq'::regclass),
  posttime timestamp without time zone NOT NULL,
  comment character varying(2000),
  CONSTRAINT post_pk PRIMARY KEY (pid),
  CONSTRAINT user_post_fk FOREIGN KEY (userid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
;


CREATE TABLE public.postpictures
(
  picid bigint NOT NULL DEFAULT nextval('postpictures_picid_seq'::regclass),
  userid bigint NOT NULL DEFAULT nextval('postpictures_userid_seq'::regclass),
  postid bigint NOT NULL DEFAULT nextval('postpictures_postid_seq'::regclass),
  address character varying(2000) NOT NULL,
  CONSTRAINT picture_pk PRIMARY KEY (picid),
  CONSTRAINT post_picture_fk FOREIGN KEY (postid)
      REFERENCES public.post (pid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT user_picture_fk FOREIGN KEY (userid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
);


CREATE TABLE public.follow
(
  id bigint NOT NULL DEFAULT nextval('follow_id_seq'::regclass),
  fromuserid bigint NOT NULL DEFAULT nextval('follow_fromuserid_seq'::regclass),
  touserid bigint NOT NULL DEFAULT nextval('follow_touserid_seq'::regclass),
  status bit(1),
  followtime timestamp without time zone,
  CONSTRAINT follow_pk PRIMARY KEY (id),
  CONSTRAINT follow_fromuser_fk FOREIGN KEY (fromuserid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT follow_touser_fk FOREIGN KEY (touserid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE public.likepost
(
  id bigint NOT NULL DEFAULT nextval('likepost_id_seq'::regclass),
  userid bigint NOT NULL DEFAULT nextval('likepost_userid_seq'::regclass),
  postid bigint NOT NULL DEFAULT nextval('likepost_postid_seq'::regclass),
  "timestamp" timestamp without time zone,
  CONSTRAINT like_pk PRIMARY KEY (id),
  CONSTRAINT like_post_fk FOREIGN KEY (postid)
      REFERENCES public.post (pid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT like_user_fk FOREIGN KEY (userid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
);


CREATE TABLE public.recommandpost
(
  id bigint NOT NULL DEFAULT nextval('recommandpost_id_seq'::regclass),
  fromuserid bigint NOT NULL DEFAULT nextval('recommandpost_fromuserid_seq'::regclass),
  touserid bigint NOT NULL DEFAULT nextval('recommandpost_touserid_seq'::regclass),
  postid bigint NOT NULL DEFAULT nextval('recommandpost_postid_seq'::regclass),
  "timestamp" timestamp without time zone,
  CONSTRAINT recommand_pk PRIMARY KEY (id),
  CONSTRAINT recommand_fromuser_fk FOREIGN KEY (fromuserid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT recommand_post_fk FOREIGN KEY (postid)
      REFERENCES public.post (pid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT recommand_touserid_fk FOREIGN KEY (touserid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);


-----------------------------------------------------------------
-- Create Functions
-----------------------------------------------------------------
-- Function: public."followUser"(integer, integer)

-- DROP FUNCTION public."followUser"(integer, integer);

CREATE OR REPLACE FUNCTION public."followUser"(
    fromuserid integer,
    touserid integer)
  RETURNS integer AS
$BODY$declare last_id integer;
begin
insert into public.follow(fromuserid,touserid,status,followtime) values(fromuserid, touserid, cast(0 as bit), now()) RETURNING id INTO last_id;
return last_id;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."followUser"(integer, integer)
  OWNER TO postgres;


-- Function: public."likePost"(integer, integer)

-- DROP FUNCTION public."likePost"(integer, integer);

CREATE OR REPLACE FUNCTION public."likePost"(
    uid integer,
    pid integer)
  RETURNS integer AS
$BODY$declare last_id integer;
begin
insert into public.likepost(userid, postid, "timestamp") values (uid, pid, now()) RETURNING id INTO last_id;
return last_id;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."likePost"(integer, integer)
  OWNER TO postgres;


-- Function: public."postComment"(text, text, integer)

-- DROP FUNCTION public."postComment"(text, text, integer);

CREATE OR REPLACE FUNCTION public."postComment"(
    cmt text,
    padr text,
    uid integer)
  RETURNS integer AS
$BODY$declare last_pid integer;
begin
insert into public.post(userid, posttime, comment) values (uid, now(), cmt) RETURNING pid INTO last_pid;
insert into public.postpictures(userid, postid, address) values(uid, last_pid, padr);
return last_pid;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."postComment"(text, text, integer)
  OWNER TO postgres;


-- Function: public."unfollowUser"(integer, integer)

-- DROP FUNCTION public."unfollowUser"(integer, integer);

CREATE OR REPLACE FUNCTION public."unfollowUser"(
    fuserid integer,
    tuserid integer)
  RETURNS integer AS
$BODY$begin
update public.follow
set status = cast(1 as bit), followtime = now()
where fromuserid = fuserid and touserid = tuserid and status = cast(0 as bit);
return 1;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."unfollowUser"(integer, integer)
  OWNER TO postgres;


-- Function: public."unlikePost"(integer, integer)

-- DROP FUNCTION public."unlikePost"(integer, integer);

CREATE OR REPLACE FUNCTION public."unlikePost"(
    uid integer,
    pid integer)
  RETURNS integer AS
$BODY$begin
delete from public.likepost where userid = uid and postid = pid;
return 1;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."unlikePost"(integer, integer)
  OWNER TO postgres;


-- Function: public."updateComment"(text, text, integer)

-- DROP FUNCTION public."updateComment"(text, text, integer);

CREATE OR REPLACE FUNCTION public."updateComment"(
    cmt text,
    padr text,
    pid integer)
  RETURNS integer AS
$BODY$begin
update public.post set comment=cmt, posttime=now
where postid = pid;
update public.postpictures set address=padr
where postid = pid;
return 1;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."updateComment"(text, text, integer)
  OWNER TO postgres;


-- Function: public."userRegister"(text, text, text, boolean, date, text, smallint, timestamp without time zone, timestamp without time zone)

-- DROP FUNCTION public."userRegister"(text, text, text, boolean, date, text, smallint, timestamp without time zone, timestamp without time zone);

CREATE OR REPLACE FUNCTION public."userRegister"(
    username text,
    firstname text,
    lastname text,
    gender boolean,
    dob date,
    email text,
    status smallint,
    createdtime timestamp without time zone,
    modifiedtime timestamp without time zone)
  RETURNS integer AS
$BODY$declare last_uid integer;
begin
insert into public.users(username, firstname, lastname, gender,dob,email,status,createdtime, modifiedtime)
values (username,firstname, lastname, gender,dob,email,status,now(),now())
RETURNING userid INTO last_uid;
return last_uid;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."userRegister"(text, text, text, boolean, date, text, smallint, timestamp without time zone, timestamp without time zone)
  OWNER TO postgres;


-- Function: public."userRegisterFast"(text, text, text)

-- DROP FUNCTION public."userRegisterFast"(text, text, text);

CREATE OR REPLACE FUNCTION public."userRegisterFast"(
    username text,
    email text,
    password text)
  RETURNS integer AS
$BODY$declare last_uid integer;
begin
insert into public.users(username, email, createdtime, modifiedtime)
values (username,email,now(),now())
RETURNING userid INTO last_uid;
return last_uid;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."userRegisterFast"(text, text, text)
  OWNER TO postgres;


-----------------------------------------------------------------
-- Create Views
-----------------------------------------------------------------

-- View: public."getUserFollow"

-- DROP VIEW public."getUserFollow";

CREATE OR REPLACE VIEW public."getUserFollow" AS 
 SELECT follow.id,
    follow.fromuserid,
    follow.touserid,
    follow.status,
    follow.followtime
   FROM follow;

ALTER TABLE public."getUserFollow"
  OWNER TO postgres;


-- View: public."getUserPosts"

-- DROP VIEW public."getUserPosts";

CREATE OR REPLACE VIEW public."getUserPosts" AS 
 SELECT p.userid AS uid,
    p.posttime AS ptime,
    p.comment,
    pp.address AS padr
   FROM post p,
    postpictures pp
  WHERE p.pid = pp.postid;

ALTER TABLE public."getUserPosts"
  OWNER TO postgres;



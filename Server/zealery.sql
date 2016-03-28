CREATE DATABASE zealery
  WITH ENCODING='UTF8'
       CONNECTION LIMIT=-1;



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




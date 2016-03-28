'use strict';

const Hapi = require('hapi');
const Good = require('good');
var db =  require('./db.js');
const server = new Hapi.Server();
server.connection({ port: 3000 });

// server.auth.strategy('session', 'cookie', {  
//     cookie: 'sid',
//     password: 'cookie_encryption_password',
//     redirectTo: '/user/login'
// });

// server.auth.strategy('facebook', 'bell', {  
//     provider: 'facebook',
//     password: 'cookie_encryption_password',
//     clientId: '653626841457692',
//     clientSecret: '1882bc49d9c5c1c37a0c2c970fe8f376'
// });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/hello/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
    method: 'GET',
    path: '/user',
    handler: function (request, reply) {
        reply('You requested: ' + request.path);
    }
});

server.route({
    method: 'GET',
    path: '/user/me',
    handler: function (request, reply) {
        db.query("select * from users where userid=1;", function(data) {
            console.log(request.info);
            reply(data.rows[0]).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/user/{userid}',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        if(userid == undefined || userid.length == 0) {
            console.log("userid is none.");
            reply.redirect("/user/me");
        } else {
            db.query("select * from users where userid=" + userid, function(data) {
                console.log(request.info);
                reply(data.rows[0]).code(200);
            });
        }
    }
});

server.route({
    method: ['GET', 'POST'],
    path: '/user/login',
    handler: function (request, reply) {
        return reply.redirect('/user/me');
    }
});

server.route({
    method: 'POST',
    path: '/user/register',
    handler: function (request, reply) {
        var username = encodeURIComponent(request.params.username);
        var email = encodeURIComponent(request.params.email);
        db.query("select public.\"userRegisterFast\"('"+username+"','"+email+"','password');", function(data) {
                console.log(request.info);
                reply(data.rows).code(200);
            });
    }
});

server.route({
    method: 'GET',
    path: '/user/logout',
    handler: function (request, reply) {
        return reply.redirect('/');
    }
});

server.route({
    method: 'POST',
    path: '/user/update',
    handler: function (request, reply) {
        reply('You requested: ' + request.path);
    }
});

server.route({
    method: 'POST',
    path: '/user/follow',
    handler: function (request, reply) {
        var fromuserid = encodeURIComponent(request.params.userid);
        var touserid = encodeURIComponent(request.params.toid);
        db.query("select public.\"followUser\"("+fromuserid+","+touserid+");" + userid, function(data) {
                console.log(request.info);
                reply(data.rows[0]).code(200);
            });
    }
});

server.route({
    method: 'POST',
    path: '/user/unfollow',
    handler: function (request, reply) {
        var fromuserid = encodeURIComponent(request.params.userid);
        var touserid = encodeURIComponent(request.params.toid);
        db.query("select public.\"unfollowUser\"("+fromuserid+","+touserid+");" + userid, function(data) {
                console.log(request.info);
                reply(data.rows[0]).code(200);
            });
    }
});

server.route({
    method: 'GET',
    path: '/user/follower',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        db.query('select * from public."getUserFollow" where fromuserid='+userid, function(data) {
            console.log(request.info);
            reply(data.rows).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/usre/following',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        db.query('select * from public."getUserFollow" where touserid='+userid, function(data) {
            console.log(request.info);
            reply(data.rows).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/social',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        db.query('select * from public."getUserPosts" where uid='+userid, function(data) {
            console.log(request.info);
            reply(data.rows).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/social/browse',
    handler: function (request, reply) {
        var limit = 10;
        db.query('select * from public."getUserPosts" order by ptime desc limit '+limit, function(data) {
            console.log(request.info);
            reply(data.rows).code(200);
        });
    }
});

server.route({
    method: 'POST',
    path: '/social/post',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        var comment = encodeURIComponent(request.params.comment);
        var pic = encodeURIComponent(request.params.picaddr);
        db.query("select public.\"postComment\"('"+comment+"', '"+pic+"',"+userid+");", function(data) {
            console.log(request.info);
            reply(data.rows[0]).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/social/update',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        var postid = encodeURIComponent(request.params.postid);
        var comment = encodeURIComponent(request.params.comment);
        var pic = encodeURIComponent(request.params.picaddr);
        db.query("select public.\"updateComment\"('"+comment+"', '"+pic+"',"+postid+");", function(data) {
            console.log(request.info);
            reply(data.rows[0]).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/social/remove',
    handler: function (request, reply) {
        reply('You requested: ' + request.path);
    }
});

server.route({
    method: 'GET',
    path: '/social/like',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        var postid = encodeURIComponent(request.params.postid);
        db.query("select public.\"likePost\"("+userid+","+postid+");", function(data) {
            console.log(request.info);
            reply(data.rows[0]).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/social/unlike',
    handler: function (request, reply) {
        var userid = encodeURIComponent(request.params.userid);
        var postid = encodeURIComponent(request.params.postid);
        db.query("select public.\"unlikePost\"("+userid+","+postid+");", function(data) {
            console.log(request.info);
            reply(data.rows[0]).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/battle',
    handler: function (request, reply) {
        reply('You requested: ' + request.path);
    }
});

server.route({
    method: 'GET',
    path: '/battle/browse',
    handler: function (request, reply) {
        reply('You requested: ' + request.path);
    }
});

server.route({
    method: 'GET',
    path: '/battle/start',
    handler: function (request, reply) {
        reply('You requested: ' + request.path);
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
           throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
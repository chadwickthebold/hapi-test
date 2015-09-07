var Hapi = require('hapi');
var Good = require('good');
var mongoose = require('mongoose');
var joi = require('joi');

var userSchema = new mongoose.Schema({
  firstname:  String,
  lastname: String,
  gender:   String,
  dob:      Number,
  streetaddress: String,
  city:     String,
  state:    String,
  zip:      String
});

var User = mongoose.model('User', userSchema);

var server = new Hapi.Server();
server.connection({ port: 3000 });


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Server listening at ' + server.info.uri + ' . Make requests to /users/ to perform CRUD operations');
    }
});

// Create
server.route({
    method: 'Post',
    path: '/users',
    handler: function (request, reply) {
        var db;
        mongoose.connect('mongodb://localhost/test');
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function (callback) {
            var newUser = new User({
                firstname: request.query.firstname,
                lastname: request.query.lastname,
                gender:   request.query.gender,
                dob:      request.query.dob,
                streetaddress: request.query.streetaddress,
                city:     request.query.city,
                state:    request.query.state,
                zip:      request.query.zip
            });

            newUser.save(function (err) {
                if (err) return console.error(err);
            });

            reply("ok!");

            db.close();
        });
    }
});

// Read
server.route({
    method: 'GET',
    path: '/users/{firstname}',
    handler: function (request, reply) {
        var db;
        mongoose.connect('mongodb://localhost/test');
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function (callback) {
            User.find({ firstname: request.params.firstname }, function(err, users) {
                reply('Found User for firstname: ' + encodeURIComponent(request.params.firstname) + ' with the following data:\nlastname: '+ users[0].lastname+'\ngender: '+ users[0].gender+'\ndob: '+ users[0].dob+'\nstreet address: '+ users[0].streetaddress+'\ncity: '+ users[0].city+'\nstate: '+ users[0].state+'\nzipcode: '+ users[0].zip);
                db.close();
            });
        });
    }
});

// Update
server.route({
    method: 'PUT',
    path: '/users/{name}',
    handler: function (request, reply) {
        
    }
});

// Delete
server.route({
    method: 'DELETE',
    path: '/users/{name}',
    handler: function (request, reply) {
        
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
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
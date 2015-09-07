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

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

});


server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
      reply('Server listening at ' + server.info.uri + ' . Make requests to /users/ to perform CRUD operations');
  }
});

// Create
server.route({
  method: 'POST',
  path: '/users',
  handler: function (request, reply) {
    server.log('info', 'Got POST with firstname: ' + request.headers.firstname);

    var newUser = new User({
      firstname: request.headers.firstname,
      lastname: request.headers.lastname,
      gender:   request.headers.gender,
      dob:      request.headers.dob,
      streetaddress: request.headers.streetaddress,
      city:     request.headers.city,
      state:    request.headers.state,
      zip:      request.headers.zip
    });

      newUser.save(function (err) {
        if (err) {
          reply("not ok!");
          return console.error(err);
        }
      });

      reply("ok!");
  }
});

// Read
server.route({
  method: 'GET',
  path: '/users/{firstname}',
  handler: function (request, reply) {
    User.find({ firstname: request.params.firstname }, function(err, users) {
      reply('Found User for firstname: ' + encodeURIComponent(request.params.firstname) + ' with the following data:\nlastname: '+ users[0].lastname+'\ngender: '+ users[0].gender+'\ndob: '+ users[0].dob+'\nstreet address: '+ users[0].streetaddress+'\ncity: '+ users[0].city+'\nstate: '+ users[0].state+'\nzipcode: '+ users[0].zip);
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
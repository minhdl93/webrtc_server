module.exports = function(io, streams,app) {
  var clients = {};
  var reflected = [];
  
  io.on('connection', function(client) {
    console.log('-- ' + client.id + ' joined --');
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

    if(clients.hasOwnProperty(text)) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      //clients[text] = client.id;
    } else {
        //clients[text] = client.id;
    }
      
    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');
      streams.addStream(client.id, options.name); 

    });
    
    client.on('update', function(options) {
      streams.update(client.id, options.name);
    });

    client.on('resetId', function(options) {
      clients[options.myId] = client.id;
      client.emit('id', options.myId);
      reflected[text] = options.myId;
    });

    client.on('message', function (details) {
      console.log("message function "+ details.to);
      var otherClient = io.sockets.connected[clients[details.to]];
      if (!otherClient) {
        return;
      }

      delete details.to;
      details.from = reflected[text];

      otherClient.emit('message', details);
    });

    client.on('startclient', function (details) {
      console.log("start client for phone " + details.to);
        var otherClient = io.sockets.connected[clients[details.to]];
        details.from = reflected[text];
        otherClient.emit('receiveCall', details);
    });

    client.on('ejectcall', function (details) {
      var otherClient = io.sockets.connected[clients[details.callerId]];
      otherClient.emit("ejectcall");
       
    });

    client.on('acceptcall', function (details) {

      var otherClient = io.sockets.connected[clients[details.callerId]];

      otherClient.emit("acceptcall",details);
       
    });

    client.on('chat', function(options) {
      console.log("chat message "+ options.msg);
      client.broadcast.emit('chat', options);
    });

    function leave() {
      console.log('-- ' + client.id + ' left --');
      streams.removeStream(client.id);
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });

  var getStatus = function(req, res) {
      var clientid = clients[req.params.id];
      //console.log("lien minh get user statys"+clientid+ " "+req.params.id);
      if(io.sockets.connected[clientid]!=undefined){
        res.send({status: 1});
      }else{
        res.send({status: -1});
      }
    };

  app.get('/status/:id', getStatus);
};


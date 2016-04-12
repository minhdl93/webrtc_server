module.exports = function(io, streams) {
  var clients = {};
  var reflected = [];
  
  //var Schema = mongoose.Schema;

  
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

    //client.emit('id', text);
    
    // client.on('message', function (details) {
    //   //console.log("messae xx "+details.to+" dasd"+clients[details.to]);
    //   var otherClient = io.sockets.connected[clients[details.to]];
    //   //console.log("here am i 1, id: "+client.id+" clients: "+clients[client.id]+"' details to "+details.to+" details to "+clients[details.to]);
    //   if (!otherClient) {
    //     return;
    //   }
    //   //console.log("here am i, id: "+client.id+" clients: "+clients[client.id]+"' details to "+details.to+" detail from "+clients[text]);
    //   delete details.to;
    //   details.from = text;
    //   //console.log("text "+ text+ "from " + clients[text]);
    //   otherClient.emit('message', details);
      
    // });
      
    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');
      streams.addStream(client.id, options.name); 

    });
    
    client.on('update', function(options) {
      streams.update(client.id, options.name);
    });

    client.on('resetId', function(options) {
      //console.log("rESET ID EVENT");
      //console.log("My id " + options.myId + " id by nodejs " + text + " value client " + clients[text]+" "+client.id);
      clients[options.myId] = client.id;
      //delete clients[text];
      client.emit('id', options.myId);
      reflected[text] = options.myId;
    });

    client.on('message', function (details) {
      //console.log("messae xx "+details.to+" dasd"+clients[details.to]);
      var otherClient = io.sockets.connected[clients[details.to]];
      //console.log("here am i 1, id: "+client.id+"' details to "+details.to+" details to "+clients[details.to]);
      //console.log("i go there already");
      //console.log("here am i 1, id: "+client.id+" clients: "+clients[client.id]+"' details to "+details.to);
      if (!otherClient) {
        return;
      }

      //console.log("here am i, id: "+client.id+" clients: "+clients[client.id]+"' details to "+details.to+" detail from "+clients[text]+" reflea from "+reflected[text]);
      delete details.to;
      details.from = reflected[text];
      otherClient.emit('message', details);
      
    });

    // callback on login
    // client.on('login', function(options) {
    //     User.findOne({ username: options.username }, function(err, user) {
    //       if (err) throw err;

    //       // test a matching password
    //       if(user.comparePassword(options.password)==1)
    //       {
    //         //emit login success
    //         //console.log('Minh11520232 match'); 
    //         //??? return id to user
    //         //return list of friends id and status online offline
    //       }else{
    //         //emit login fail
    //         //console.log('Minh11520232 not match'); 
    //       }
    //     });
    // });

    //callback function on register
    // client.on('register', function(options) {
    //     var newUser = User({
    //       name: options.name,
    //       username: options.username,
    //       password: options.password,
    //       email: options.email,
    //       phone: options.phone
    //     });
    //     newUser.save(function(err) {
    //       if (err) throw err;
    //       //unique user identity
    //       client.emit('id', text);
    //     });
        
    // });

    //callback function on add contacct
    // client.on('add user', function(options) {
    //     var newFriend= Friend({
    //         username: options.username,
    //         friend_id: options.friend_id
    //       });
    //     newFriend.save(function(err) {
    //       if (err) throw err;
    //     });
    // });

    //callback function on call other
    //client.on('call', function(options) {
        //send message and start call 
        //maybe check if the other connection been establish
    //});

    client.on('chat', function(options) {
      client.broadcast.emit('chat', options);
    });

    function leave() {
      console.log('-- ' + client.id + ' left --');
      streams.removeStream(client.id);
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });
};


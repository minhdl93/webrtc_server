module.exports = function(app, streams) {
  var User = require('./model/user');
  var Friend = require('./model/friend');
  // GET home 
  var index = function(req, res) {
    res.render('index', { 
                          title: 'Project RTC', 
                          header: 'WebRTC live streaming',
                          username: 'Username',
                          share: 'Share this link',
                          footer: 'pierre@chabardes.net',
                          id: req.params.id
                        });
  };

  // POST check login info
  var login = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
          if (!user){
            res.send([{status: 0}]);
          }else{
            // test a matching password
            if(user.comparePassword(req.body.password)==1)
            {
              Friend.findOne({ username: req.body.username }, function(err, friend) {
                if (!friend){
                  res.send({status: 1,id: user.id});
                }else{
                  res.send({status: 1,id: user.id,id: friend.friend_id});
                }
              });
              //??? return id to user
              //return list of friends id and status online offline
            }else{
              res.send({status: -1});
            }
          }
        });
  };

  //GET list of users
  var listUser = function(req, res) {
    User.find(function(err, users) {
      if (err){
        res.send({status: -1});
      }else{
        res.json(users);
      }
    });
  };

  var listFriend = function(req, res) {
    Friend.find({ 'username': req.body.username }, function (err, friends) {
      if (err){
        res.send({status: -1});
      }else{
        res.json(friends);
      }
    });
  };

  var getPersonName = function(req, res) {
    User.findOne({ id: req.body.username }, function(err, user) {
      if (err){
        res.send({status: -1});
      }else{
        res.json(user);
      }
    });
  };


  //POST add friend
  var addFriend = function(req, res) {
      var newFriend = Friend({
          username: req.body.username,
          friend_id: req.body.friend_id
      });
      newFriend.save(function(err) {
        if (err){
          res.send(err);
        }else{
          res.send({status: 1});
        }
      });
  };

  // POST register user account
  var register = function(req, res) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    //remember to check trung id trong db
    var newUser = User({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          phone: req.body.phone,
          id: text
        });
        newUser.save(function(err) {
          if (err){
            res.send({status: -1});
          }else{
            res.send({status: 1,id: text});
          }
          
        });
  };


  // GET streams as JSON
  var displayStreams = function(req, res) {
    var streamList = streams.getStreams();
    // JSON exploit to clone streamList.public
    var data = (JSON.parse(JSON.stringify(streamList))); 
    res.status(200).json(data);
  };

  app.get('/streams.json', displayStreams);
  app.get('/users', listUser);
  app.post('/friend_name', getPersonName);
  app.post('/friends', listFriend);
  app.post('/login', login);
  app.post('/addFriend', addFriend);
  app.post('/register', register);
  app.get('/', index);
  app.get('/:id', index);
}
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var port = process.env.PORT || 8080;

//configuration
mongoose.connect('mongodb://clem:masterkey@proximus.modulusmongo.net:27017/eJiqit2a');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//DB Model
var Todo = mongoose.model('Todo', {
        text: String
    });

//ROUTES
var apiRouter = express.Router();
var router = express.Router();

//create a todo
apiRouter.get('/todos', function(req, res) {
  Todo.find(function(err, todos) {
    if(err){
      res.send(err);
    }

    res.json(todos);
  });
});

//add a todo
apiRouter.post('/todos', function(req, res) {
  Todo.create({
    text : req.body.text,
    done : false
  }, function(err, todo) {
    if(err){
      res.send(err);
    }
    Todo.find(function(err, todos) {
      if(err){
        res.send(err);
      }
      res.json(todos);
    });
  });
});

//delete a todo
apiRouter.delete('/todos/:todo_id', function(req, res) {
  Todo.remove({
    _id : req.params.todo_id 
  }, function(err, res) {
    if(err){
      res.send(err);

      Todo.find(function(err, todos) {
        if(err){
          res.send(err);
        }
        res.json(todos);
      });
    }
  })
});

router.get('*', function(req, res) {
  res.sendFile('/index.html');
});



app.use('/api', apiRouter);
app.use('/', router);


app.listen(port);
console.log('Magic happens at port: ' + port);
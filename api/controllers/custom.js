const _ = require("lodash");
const NodeTransServer = require("../../node_trans_server");

var Stream = require('../../models/stream.model');

exports.list_all_stream = function(req, res) {
  Stream.getAllStream(function(err, streams) {
    if (err)
      res.send(err);
      
    res.render("index", {"streams": streams});
  });
};

exports.create_a_stream = function(req, res, next) {
  var new_stream = new Stream(req.body);
   
       Stream.createStream(new_stream, function(err, stream) {    
        if (err)
          var message = err;

        var message = "Data added successfully.";

        res.redirect('/tasks');
      });
};

exports.read_a_task = function(req, res) {
  Task.getTaskById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  Task.updateById(req.params.taskId, new Task(req.body), function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_task = function(req, res) {
  Task.remove( req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};



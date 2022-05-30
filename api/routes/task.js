const express = require('express');
const customController = require('../controllers/custom');

module.exports = (context) => {
  let router = express.Router();
  //router.post('/trans', streamController.postStreamTrans.bind(context));
  router.get('/tasks', customController.list_all_stream.bind(context));
  //router.get('/add', customController.addStream.bind(context));
  router.post('/tasks', customController.create_a_stream.bind(context));
  //router.delete('/:app/:stream', streamController.delStream.bind(context));
  return router;
};

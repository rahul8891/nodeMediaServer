const express = require("express");
const NodeMediaServer = require('./node_media_server');
const bodyParser = require('body-parser');
const http = require('http');

let {config} = require('./config');
var Stream = require('./models/stream.model');
var cron = require('node-cron');

let app = express();

function getStreamsData() { 
  let {config} = require('./config');

  let date_ob = new Date(); 
  // current hours and minute
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let time = hours + ":" + minutes;
  console.log("Time = ", time);
  
  config['relay']['tasks'] = [];
      
  Stream.find({ name: '189'}, function (err, streams) {
    console.log("Time = ", streams);
    let data = new Array();
    if (!err) {
      Object.keys(streams).forEach(function (element, keys) {
          let data1 = new Array();

          data1['app'] = 'live';
          data1['mode'] = 'static';
          data1['vc'] = 'libx264';
          data1['hls'] = true;
          data1['hlsFlags'] = '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]';
          data1['dash'] = true;
          data1['dashFlags'] = '[f=dash:window_size=3:extra_window_size=5]';
          data1['name'] = streams[element]['name'];
          data1['edge'] = streams[element]['stream'];

          data.push(data1);

          config['relay']['tasks'] = data;              
      });
    }
  });
        
  nms.run();
}

/*function destroyStreamsData() { 
  
  nms.stop();

  getStreamsData();
}

cron.schedule('5 * * * *', () => {
  destroyStreamsData();
});*/

console.log('aaaa11111');
let nms = new NodeMediaServer(config);
getStreamsData();
nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  postStream(id, StreamPath);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // postStream(id, StreamPath);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // postStream(id, StreamPath);
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

function postStream(streamID, streamPath) { console.log('Data updating');
  var streamName = streamPath.replace('/live/', '');
  var rtmpPath = 'rtmp://nmsdev.msgnaa.info:1935'+streamPath;

  // Stream.getStreamByName(streamName, function (err, res) {
  //Stream.find({'name': streamName}, function (err, res) {
      //var id = res[0]._id;
      // console.log('streamIDPath = ', id);
      // Stream.updatePathById(id, streamID, path, function (err, res) {
      Stream.updateMany({'name': streamName}, {$set: {'path': rtmpPath, 'stream_id': streamID}}, function (err, res) {
        console.log('streamID = ', res);
      });
  // });
}
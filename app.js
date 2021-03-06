const express = require("express");
const NodeMediaServer = require('./node_media_server');
const bodyParser = require('body-parser');
const http = require('http');

let {config} = require('./config');
// var Stream = require('./models/stream.model');
var cron = require('node-cron');

let app = express();

// import node-fetch
const axios = require('axios');
const fetch = require('node-fetch');

const URL = 'http://vc.msgnaa.info/api/';

async function getPosts() {
  const request = require("request");

  request.post( 
    { uri: 'http://vc.msgnaa.info/api/live/iptv/listAll',
     json: true,
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbkBtc2duYWEuaW5mbyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MTE2OTQ1M30.zPnEXZWA253KYuynVQKZp6aqOsC3UOtr7DD4Au1ScTg',
      }
    },
    function (error, res, object) {
      if (!error) { 
        getStreamsData(object.data);
      } else {
        console.log("Error = ", error);
      } 

    }
  );
}

function getStreamsData(streams) { 
  let {config} = require('./config');
  console.log("streamData = ", streams);
  let date_ob = new Date(); 
  // current hours and minute
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let time = hours + ":" + minutes;
  
  config['relay']['tasks'] = [];
 
  let data = new Array();
  
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
        
  nms.run();
}

function delStream(req, res, next) {
  let publishStreamPath = `/${req.params.app}/${req.params.stream}`;
  let publisherSession = this.sessions.get(
    this.publishers.get(publishStreamPath)
  );

  if (publisherSession) {
    publisherSession.stop();
    res.json("ok");
  } else {
    res.json({ error: "stream not found" }, 404);
  }
}

cron.schedule('* * * * *', () => {
  getPosts();
});

let nms = new NodeMediaServer(config);

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  postStream(id, StreamPath);
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

function postStream(streamID, streamPath) {
  const request = require("request");

  var streamName = streamPath.replace('/live/', '');
  console.log("Name = ", streamName);
  var path = 'http://104.149.131.242:8000/live/'+streamName+'/index.m3u8';

  const options = { uri: 'http://vc.msgnaa.info/api/live/iptv/addPath',
    json: true,
    headers: {
      'Content-Type' : 'application/json',
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbkBtc2duYWEuaW5mbyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MTE2OTQ1M30.zPnEXZWA253KYuynVQKZp6aqOsC3UOtr7DD4Au1ScTg',
    },
    body: {
      path: path,
      stream_id: streamID,
      name: streamName,
      status: 'start',
    }
  };

  request.post(options, function (error, res, object) {
      if (!error) { 
        console.log("Data = ", object);
      } else {
        console.log("Error = ", error);
      } 
    }
  );
}
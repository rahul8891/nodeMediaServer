const express = require("express");
const NodeMediaServer = require('./node_media_server');
const bodyParser = require('body-parser');
const http = require('http');
const request = require("request");

let {config} = require('./config');
// var Stream = require('./models/stream.model');
var cron = require('node-cron');

let app = express();

// import node-fetch
const axios = require('axios');
const fetch = require('node-fetch');

const URL = 'http://vc.msgnaa.info/api/';

async function getPosts() { console.log("asasdasd");
  /*const response = await fetch(
    `http://vc.msgnaa.info/api/live/iptv/listAll`
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    console.log("Data = ", response);
  }

  return await response.json();*/

  /*request({
    uri: 'http://vc.msgnaa.info/api/live/iptv/listAll',
    headers: {
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbkBtc2duYWEuaW5mbyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MTE2OTQ1M30.zPnEXZWA253KYuynVQKZp6aqOsC3UOtr7DD4Au1ScTg',
    },
    method: 'post',
    function(error, response, body) {
      if (!error) {
        console.log(body);
        res.json(body);
      } else {
        res.json(error);
      }
    }*/

  /*const options = {
    method: 'POST',
    uri: 'http://vc.msgnaa.info/api/live/iptv/listAll',
    headers: {
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbkBtc2duYWEuaW5mbyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MTE2OTQ1M30.zPnEXZWA253KYuynVQKZp6aqOsC3UOtr7DD4Au1ScTg',
      'Content-Type': 'application/json' 
    },
    json: true,
    // JSON stringifies the body automatically
  };
​
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
        console.log(body); //get your response here
  });*/

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
getPosts();


function getStreamsData(streams) { 
  let {config} = require('./config');

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

/*function destroyStreamsData() { 
  
  nms.stop();

  getStreamsData();
}

cron.schedule('5 * * * *', () => {
  destroyStreamsData();
});*/

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
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // postStream(id, StreamPath);
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
  var streamName = streamPath.replace('/live/', '');
  console.log("Name = ", streamName);
  var path = 'http://104.149.131.242:8000/live/'+streamName+'/index.m3u8';

  request.post( 
    { uri: 'http://vc.msgnaa.info/api/live/iptv/addPath',
     json: true,
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbkBtc2duYWEuaW5mbyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MTE2OTQ1M30.zPnEXZWA253KYuynVQKZp6aqOsC3UOtr7DD4Au1ScTg',
      },
      body: {
        path: path,
        stream_id: streamID,
        name: streamName,
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
const NodeMediaCluster = require('../../node_relay_server');
let {config} = require('../../config');
const ffmpeg = require('fluent-ffmpeg');
const {spawn} = require('child_process');
const fs = require("fs");


var Stream = require('../../models/stream.model');
var cmd = config.trans.ffmpeg;

async function create_stream (req, res) {
  var id = {"_id":req.body.id};

  const streamData = await getStreamsData(id);

  await playVideo(streamData.name, streamData.app);

  getStreamsFile(streamData.name, streamData.app, function(x) {
    console.log("This is result");

    var m3u8 = `http://nmsdev.msgnaa.info/${streamData.app}/${streamData.name}/index.m3u8`;
  
    let result = {"status":true, "message":"Start processing!", "stream_path":m3u8};
      
    res.send(result);
  });
  
  
}; 

async function checked_stream (req, res) {
  let name = req.query.name;
  let app = req.query.app;

  await deleteVideo(name, app);

  res.send(true);
};

async function getStreamsData(id) {
  var data = await Stream.find(id);
  console.log('data', data);
  let updatedStream = Array();
    
  data.forEach(function(element, keys) {   
    updatedStream = element;

    let transData = Array();
    let relayData = Array();
    
    transData['hls'] = true;
    transData['vc'] = 'libx264';
    transData['vcParams'] = ['vcodec libx264'];
    transData['hlsFlags'] = '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]';
    transData['dash'] = true;
    transData['dashFlags'] = '[f=dash:window_size=3:extra_window_size=5]';

    relayData['mode'] = 'pull';
    relayData['vc'] = 'libx264';
    relayData['vcParams'] = ['vcodec libx264'];
    relayData['hlsFlags'] = '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]';
    relayData['hls'] = true;
    
    relayData['name'] = element.name;
     
    transData['app'] = element.app;
    relayData['app'] = element.app;
  
    relayData['edge'] = element.url;

    let rtmp = `rtmp://localhost/${transData['app']}/${relayData['name']}`;
    let m3u8 = `http://nmsdev.msgnaa.info/${transData['app']}/${relayData['name']}/index.m3u8`;

    var iptv = {
        "rtmp_path": rtmp,
        "stream_path": m3u8,
        "status": '1'  
    };
    
    Stream.updateOne({_id: element._id}, iptv, {upsert: true});

    config['trans']['tasks'].push(transData);
    config['relay']['tasks'].push(relayData);

    // console.log("Config", config.relay);
  }); 
  console.log("updatedStream", updatedStream);
  return updatedStream;
}

async function playVideo(name, app) { 
  var args = [
    '-re',
    '-i', `rtmp://localhost/${app}/${name}`
  ];
  
  var proc = await spawn(cmd, args);

  proc.on('start', function (commandLine) {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })

  proc.stdout.on('data', function(data) {
    console.log("data1", data);
  });

  proc.stderr.setEncoding("utf8")
  proc.stderr.on('data', function(data) {
    console.log("Data2", data);
  });
  
  proc.on('close', function() {
    console.log('finished');
  });

  // return streamPlayId;
}

function getStreamsFile (name, app, callback) {
  const path = `./media/${app}/${name}/index.m3u8`;
  
  const intervalObj = setInterval(function() {
    const file = path;
    const fileExists = fs.existsSync(file);

    console.log('Checking for: ', file);
    console.log('Exists: ', fileExists);

    if (fileExists) {
      console.log('Existssadasdas: ', fileExists);
      clearInterval(intervalObj);   
      callback(true);
    }
  }, 2000);
}

async function deleteVideo(name, app) { 
  var args = [
    '-y',
    '-i', `rtmp://localhost/${app}/${name}`
  ];
  
  var proc = await spawn(cmd, args);
  proc.stop();
  /* proc.on('stop', function (commandLine) {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })
  
  proc.on('close', function() {
    console.log('Delete Successfully');
  }); */
}

exports.create_stream = create_stream;
exports.checked_stream = checked_stream;


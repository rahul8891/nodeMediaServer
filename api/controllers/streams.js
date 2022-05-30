const _ = require("lodash");
const NodeTransServer = require("../../node_trans_server");

var Stream = require('../../models/stream.model');

function postStreamTrans(req, res, next) { console.log('aaaa222');
  let config = req.body;
  if (
    config.app &&
    config.hls &&
    config.ac &&
    config.vc &&
    config.hlsFlags &&
    config.dash &&
    config.dashFlags
  ) {
    transServer = new NodeTransServer(config);
    console.log(req.body);
    if (transServer) {
      res.json({ message: "OK Success" });
    } else {
      res.status(404);
      res.json({ message: "Failed creating stream" });
    }
  } else {
    res.status(404);
    res.json({ message: "Failed creating stream" });
  }
}

function getStreams(req, res, next) { console.log('aaaa333');
  let stats = {};

  
  this.sessions.forEach(function(session, id) {
    if (session.isStarting) {
      let regRes = /\/(.*)\/(.*)/gi.exec(
        session.publishStreamPath || session.playStreamPath
      );

      if (regRes === null) return;

      let [app, stream] = _.slice(regRes, 1);

      if (!_.get(stats, [app, stream])) {
        _.setWith(stats, [app, stream], {
          publisher: null,
          subscribers: []
        }, Object);
      }

      switch (true) {
        case session.isPublishing: {
          _.setWith(stats, [app, stream, 'publisher'], {
            app: app,
            stream: stream,
            clientId: session.id,
            connectCreated: session.connectTime,
            bytes: session.socket.bytesRead,
            ip: session.socket.remoteAddress,
            audio: session.audioCodec > 0 ? {
              codec: session.audioCodecName,
              profile: session.audioProfileName,
              samplerate: session.audioSamplerate,
              channels: session.audioChannels
            } : null,
            video: session.videoCodec > 0 ? {
              codec: session.videoCodecName,
              width: session.videoWidth,
              height: session.videoHeight,
              profile: session.videoProfileName,
              level: session.videoLevel,
              fps: session.videoFps
            } : null,
          },Object);
          break;
        }
        case !!session.playStreamPath: {
          switch (session.constructor.name) {
            case "NodeRtmpSession": {
              stats[app][stream]["subscribers"].push({
                app: app,
                stream: stream,
                clientId: session.id,
                connectCreated: session.connectTime,
                bytes: session.socket.bytesWritten,
                ip: session.socket.remoteAddress,
                protocol: "rtmp"
              });

              break;
            }
            case "NodeFlvSession": {
              stats[app][stream]["subscribers"].push({
                app: app,
                stream: stream,
                clientId: session.id,
                connectCreated: session.connectTime,
                bytes: session.req.connection.bytesWritten,
                ip: session.req.connection.remoteAddress,
                protocol: session.TAG === "websocket-flv" ? "ws" : "http"
              });

              break;
            }
          }

          break;
        }
      }
    }
  });
  console.log(stats);
  res.json(stats);
}

function getStream(req, res) {
  
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

exports.delStream = delStream;
exports.getStreams = getStreams;
exports.getStream = getStream;
exports.postStreamTrans = postStreamTrans;

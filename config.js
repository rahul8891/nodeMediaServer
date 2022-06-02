/* exports.config = {
  vc: 'libx264',
  logType: 3,

  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,   
    ping: 30,
    ping_timeout: 60
  },
  auth: {
    api : true,
    api_user: 'admin',
    api_pass: 'nms2018',
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: 'media',
    webroot: './public/media',
  },
  https: {
    port: 8443,
    key: './privatekey.pem',
    cert: './certificate.pem',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    vc: 'libx264',
    tasks: [
      {
        app: 'iptv',
        hls: true,
        vc: 'libx264',
        vcParams : [
          'vcodec libx264'
        ],
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  },
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',    
    tasks: [
      {
        app: 'iptv',
        hls: true,
        vc: 'libx264',
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
}; */

exports.config = {
  logType: 3,

  rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
  },
  http: {
      port: 8000,
      allow_origin: '*',
      mediaroot: './media',
      webroot: './public/media',
  },
  trans: {
      ffmpeg: '/usr/bin/ffmpeg',
      tasks: [
          {
              app: 'live',
              hls: true,
              hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
              dash: true,
              dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
              vc: 'libx264',
          }
      ]
  },
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',    
    tasks: []
  }
  /*relay: {
    ffmpeg: '/usr/bin/ffmpeg',    
    tasks: [
      {
        app: 'live',
        mode: 'static',
        vc: 'libx264',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: 'dashFlags',
        name: '6978',
        edge: 'http://bestbuyiptv.tv:8080/live:zhang_1032/0D2VCtcCFp/6978',
      }
    ]
  }*/
};
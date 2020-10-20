// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var list = document.getElementById("selectList");
var refreshBtn = document.getElementById("refreshBtn");
var captureBtn = document.getElementById("captureBtn");

refreshSources();

refreshBtn.addEventListener('click', function(e) {
  refreshSources();
});

captureBtn.addEventListener('click', function(e) {
  doCapture();
});

async function refreshSources() {
  var length = list.options.length;
  for (i = length-1; i >= 0; i--) {
    list.options[i] = null;
  }

  const sources = await window.desktopCapturer.getSources({ types:['window'] });

  console.log(sources);

  for (let source of sources) {
    list.add(new Option(source.name, source.id));
  }
}

async function doCapture() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: list.value,
            }
          }
        })

    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  } catch (e) {
    console.error(e);
  }
}


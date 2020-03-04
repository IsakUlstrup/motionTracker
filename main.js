// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

// create Oscillator node
var oscillator = audioCtx.createOscillator()

oscillator.type = 'sine'
oscillator.connect(audioCtx.destination)

window.onload = function() {
  // var video = document.getElementById('video')
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')

  var targetColor = {
    r: 13,
    g: 66,
    b: 41,
    margin: 10
  }

  tracking.ColorTracker.registerColor('userColor', function(r, g, b) {
    if (r < targetColor.r - targetColor.margin || r > targetColor.r + targetColor.margin) {
      return false
    }
    if (g < targetColor.g - targetColor.margin || g > targetColor.g + targetColor.margin) {
      return false
    }
    if (b < targetColor.b - targetColor.margin || b > targetColor.b + targetColor.margin) {
      return false
    }


    return true
  })

  var tracker = new tracking.ColorTracker(['userColor'])

  tracking.track('#video', tracker, { camera: true })


  tracker.on('track', function(event) {
    context.clearRect(0, 0, canvas.width, canvas.height)

    // if (event.data.length > 0) {
    //   console.log(event.data)
    //   var rect = event.data[0]
    //   if (rect.color === 'custom') {
    //     rect.color = tracker.customColor;
    //   }

    //   oscillator.frequency.setValueAtTime((rect.y * 2) + 100, audioCtx.currentTime)
    //   context.strokeStyle = rect.color;
    //   context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    //   context.font = '11px Helvetica';
    //   context.fillStyle = "#fff";
    //   context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
    //   context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
    // } else {
    //   oscillator.frequency.setValueAtTime(0, audioCtx.currentTime)
    // }

    var combinedRect = {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    }

    if (event.data.length > 0) {
      event.data.forEach(function(rect) {
        if (rect.color === 'userColor') {
          rect.color = tracker.customColor
        }
        
        if (combinedRect.x === undefined || rect.x < combinedRect.x) combinedRect.x = rect.x
        if (combinedRect.y === undefined || rect.y < combinedRect.y) combinedRect.y = rect.y
        combinedRect.width = rect.width
        combinedRect.height = rect.height

        context.strokeStyle = rect.color
        context.strokeRect(rect.x, rect.y, rect.width, rect.height)
        context.font = '11px Helvetica'
        context.fillStyle = "#fff"
        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11)
        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22)
      })
      context.strokeStyle = "#FF0000"
      context.strokeRect(combinedRect.x, combinedRect.y, combinedRect.width, combinedRect.height)
      console.log(combinedRect)
      oscillator.frequency.setValueAtTime(combinedRect.y, audioCtx.currentTime)
    } else {
      oscillator.frequency.setValueAtTime(0, audioCtx.currentTime)
    }
    
  })

}

function startOscillator() {
 oscillator.start() 
}
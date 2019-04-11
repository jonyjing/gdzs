$(function() {
	var canvas = $('#canvas1')
  winWidth = $(document).width();
  winHeight = $(document).height();
	canWidth = winWidth* 0.50;
	canHeight = winHeight* 0.6;
	canvas.attr('width', canWidth)
	canvas.attr('height', canHeight)
  var ctx = canvas[0].getContext('2d')
  var color=['#36D1F2','#F743B9','#00998B'];
  window.requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(a) {
        window.setTimeout(a, 1e3 / 60)
      }
    )
  })()
  ballArea = {
    balls: [],
    leftHeight: 300,
    leftUp: [0, 300],
    leftBottom: [0, 0],
    rightUp: [300, 150],
    rightBottom: [300, 100],
    ballLineNums: 10,
    ballNums: 15,
    curveness: -0.2
  }
  function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function Ball(startPoint, endPoint, controlPoint, imgsrc) {
    var imgObj = new Image()
    imgObj.src = imgsrc
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.controlPoint = controlPoint
    this.r = random(30, 60)
    this.k_step = 0.0025
    this.k = Math.random()
    this.img = imgObj
  }

  Ball.prototype.draw = function() {
    this.k = this.k + this.k_step
    if (this.k > 1) {
      this.k = 0
    }
    var point = getBezierPathPoint(
      this.startPoint,
      this.controlPoint,
      this.endPoint,
      this.k
    )
    ctx.drawImage(this.img, point[0], point[1], this.r, this.r)
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 0;
    // ctx.shadowBulr = 10;
    // ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ddd";
  }

  function drawBalls() {
    var per110 = (110 / 768 * winHeight)
    var per250 = (250 / 768 * winHeight)
    var per350 = (350 / 768 * winHeight)
    var per510 = (510 / 768 * winHeight)
    for (var i = 0; i < ballArea.ballNums; i++) {
      // leftBall_x = Math.random() > 0.5 ? 0 : per110
      // leftBall_y = leftBall_x == 0 ? (Math.random() > 0.5 ? random(10, per110) : random(per250, per350)) : (Math.random() > 0.5 ? random(per110, per250) : random(per350, per510))
      leftBall_x = 0
      leftBall_y = Math.random() * 350 + 0
      rightBall_x = canWidth
      rightBall_y = 150 + Math.random() * 49 + 1
      var controlPointArray = computeControlPoints(
        [leftBall_x, leftBall_y],
        [rightBall_x, rightBall_y],
        ballArea.curveness
      )
      var startPoint = {
        x: leftBall_x,
        y: leftBall_y
      }
      var endPoint = {
        x: rightBall_x,
        y: rightBall_y
      }

      var controlPoint = {
        x: controlPointArray[0],
        y: controlPointArray[1]
      }
      var imgsrc = './images/slide2/' + random(1, 37) + '.jpg'
      ball = new Ball(startPoint, endPoint, controlPoint, imgsrc)
      ballArea.balls.push(ball)
    }
    animalDraw()
  }

  function animalDraw() {
    requestAnimFrame(animalDraw)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'hsla(0, 0%, 0%, 1)'
    ctx.fillRect(0, 0, canWidth, canHeight)
    ctx.globalCompositeOperation = 'source-over'
    for (var i = 0; i < ballArea.balls.length; i++) {
      var ball = ballArea.balls[i]
      ball.draw()
    }
  }

  function getBezierPathPoint(startPoint, controlPoint, endPoint, percent) {
    var t = percent
    var k = 1 - t
    var p1x = startPoint.x
    var p1y = startPoint.y
    var cx = controlPoint.x
    var cy = controlPoint.y
    var p2x = endPoint.x
    var p2y = endPoint.y

    var tx = k * k * p1x + 2 * (1 - t) * t * cx + t * t * p2x

    var ty = k * k * p1y + 2 * (1 - t) * t * cy + t * t * p2y
    return [tx, ty]
  }

  function computeControlPoints(startPoint, endPoint, curveness) {
    var ControlsPoints = []
    var cp = [
      (startPoint[0] + endPoint[0]) / 2 -
        (startPoint[1] - endPoint[1]) * curveness,
      (startPoint[1] + endPoint[1]) / 2 -
        (endPoint[0] - startPoint[0]) * curveness
    ]
    ControlsPoints.push(cp[0])
    ControlsPoints.push(cp[1])
    return ControlsPoints
  }
  drawBalls()
})
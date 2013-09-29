var stage = new Kinetic.Stage({
  container: 'container',
    width: 578,
    height: 220
});
var layerOne = new Kinetic.Layer();
var layerTwo = new Kinetic.Layer();
var layerThree = new Kinetic.Layer();

var simpleText = new Kinetic.Text({
  x: stage.getWidth() / 2,
    y: 15,
    text: 'Waiting for Players',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'green'
});

var playerOne = new Kinetic.Rect({
    x: 0,
    y: 120,
    width: 50,
    height: 100,
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 4
});

var playerTwo = new Kinetic.Rect({
    x: 528,
    y: 120,
    width: 50,
    height: 100,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
});

// to align text in the middle of the screen, we can set the
// shape offset to the center of the text shape after instantiating it
simpleText.setOffset({
  x: simpleText.getWidth() / 2
});

// add the shapes to the layer
layerOne.add(simpleText);
stage.add(layerOne);

var socket = io.connect('/');

socket.emit('join', function(data){});

socket.on('start', function(data){
  layerOne.remove(simpleText);
  layerOne.add(playerOne);
  stage.add(layerOne);
  layerTwo.add(playerTwo);
  stage.add(layerTwo);
});

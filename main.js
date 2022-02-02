import './styles.css'
import * as BABYLON from 'babylonjs';

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", -1, 1, 36, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  //Scene starts here

  var count = 10000;

  var box = BABYLON.BoxBuilder.CreateBox("box", {size: 1}, scene);

  var material = new BABYLON.StandardMaterial("white", scene);
  material.diffuseColor = BABYLON.Color3.White();

  box.material = material;

  box.registerInstancedBuffer("color", 4);
  box.instancedBuffers.color = new BABYLON.Color4(1, 0, 0, 1);

  scene.createDefaultLight();

  for (var i = 0; i < count; i++) {
    var instance = box.createInstance("box" + i);

    instance.position.x = 5 - Math.random() * 10;
    instance.position.y = 5 - Math.random() * 10;
    instance.position.z = 5 - Math.random() * 10;

    box.instancedBuffers.color = new BABYLON.Color4(1, Math.random(), Math.random(), 1);

  }

  scene.debugLayer.show();

  return scene;
};

window.initFunction = async function() {

  var asyncEngineCreation = async function() {
    try {
      return createDefaultEngine();
    } catch(e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  window.engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};

initFunction().then(() => {sceneToRender = scene});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
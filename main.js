import './styles.css'
import * as BABYLON from 'babylonjs';

var canvas = document.getElementById('renderCanvas');

var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

var createScene = function() {

    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", -1, 1, 36, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, true);

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
}

var scene = createScene();

engine.runRenderLoop(function(){
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});
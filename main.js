import './styles.css'
import * as BABYLON from 'babylonjs'
import * as GUI from 'babylonjs-gui'

var canvas = document.getElementById('renderCanvas')

var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

const getRandomInt = ( min, max ) => Math.floor( Math.random() * ( max - min ) ) + min

var boxes = []

var createScene = function() {

  var scene = new BABYLON.Scene(engine)
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

  var camera = new BABYLON.ArcRotateCamera("Camera", -1.5, 1.5, 36, BABYLON.Vector3.Zero(), scene)

  camera.attachControl(canvas, true)

  var box = BABYLON.BoxBuilder.CreateBox("box", {size: 1}, scene)

  var material = new BABYLON.StandardMaterial("white", scene)

  material.diffuseColor = BABYLON.Color3.White()

  box.material = material

  box.registerInstancedBuffer("color", 4)
  box.instancedBuffers.color = new BABYLON.Color4(1, 0, 0, 1)

  scene.createDefaultLight()

  var count = 1000

  for (var i = 0; i < count; i++) {

    var instance = box.createInstance("box" + i)

    boxes.push(instance)

    instance.position.x = getRandomInt(-20, 20)
    instance.position.y = getRandomInt(-20, 20)
    instance.position.z = getRandomInt(0, 100)

    instance.velocity = getRandomInt(1, 15)

    instance.metadata = "box" + i

    box.instancedBuffers.color = new BABYLON.Color4(1, Math.random(), Math.random(), 1)

  }

/* MOUSE VERSION */
  // scene.onPointerDown = function castRay() {
  //   var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera)
  //   var hit = scene.pickWithRay(ray)
  //   if (hit.pickedMesh){
  //     // createGUIButton(hit)
  //     hit.pickedMesh.position.z = hit.pickedMesh.position.z + 10
  //   }
  // }

/* XR VERSION */
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        var pickResult = pointerInfo.pickInfo;
        if (pickResult.hit) {
          var pickedMesh = pickResult.pickedMesh;
          if (pickedMesh) {
            //createGUIButton(pickedMesh)
            pickedMesh.position.z = pickedMesh.position.z + 10
          }
        }
        break;
      case BABYLON.PointerEventTypes.POINTERPICK:
        break;
    }

  });

  scene.debugLayer.show({
    embedMode: true,
  })

  function createGUIButton(hit) {
    let label = hit.metadata
    //Creates a gui label to display the cannon
    let guiCanvas = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
    let guiButton = GUI.Button.CreateSimpleButton("guiButton", label)
    guiButton.width = "150px"
    guiButton.height = "40px"
    guiButton.color = "white"
    guiButton.cornerRadius = 5
    guiButton.background = "green"

    guiButton.onPointerUpObservable.add(function() {
      guiCanvas.dispose();
    })

    guiButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    guiCanvas.addControl(guiButton)
  }

  const xr = scene.createDefaultXRExperienceAsync();

  // const xr = scene.createDefaultXRExperienceAsync({
  //   uiOptions: {
  //     sessionMode: "immersive-ar",
  //   },
  //   optionalFeatures: ["hit-test", "anchors"],
  // });

  return scene
}

var scene = createScene()

engine.runRenderLoop( function() {
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].position.z = boxes[i].position.z - boxes[i].velocity / 100
    if ( boxes[i].position.z < -50 ) {
      boxes[i].position.z = 200
    }
  }
  scene.render()
} )

window.addEventListener( 'resize', function() {
  engine.resize()
} )
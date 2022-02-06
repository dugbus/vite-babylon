import './styles.css'
import * as BABYLON from 'babylonjs'
import 'babylonjs-gui'
import 'babylonjs-loaders'
import * as GUI from 'babylonjs-gui'
import { imageTile } from './image-tiles'
import { createTunnel } from './fly-through-tunnel'

const canvas = document.getElementById('renderCanvas')

//const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})
const engine = new BABYLON.Engine(canvas, true)

const getRandomInt = ( min, max ) => Math.floor( Math.random() * ( max - min ) ) + min

let boxes = []

const createScene = function() {


  var scene = new BABYLON.Scene(engine)
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)

  var camera = new BABYLON.UniversalCamera("Camera", BABYLON.Vector3.Zero(), scene)

  camera.attachControl(canvas, true)
  
  scene.activeCamera.position.x = 0;
  scene.activeCamera.position.y = 0;
  scene.activeCamera.position.z = 0;

  // Create a skybox from a unity style skybox image
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene)
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/skybox.png", scene,)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.disableLighting = true
  skybox.material = skyboxMaterial



  // // Create fade to black fog for the scene
  // scene.fogEnabled = true
  // scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR
  // scene.fogDensity = 0.1
  // scene.fogColor = new BABYLON.Color3(0, 0, 0)
  // scene.fogStart = 500
  // scene.fogEnd = 1000

  imageTile("sonic.png", scene,0.2,500)
  imageTile("score.png", scene, 0.2, 300)
  createTunnel(scene)

  const box = BABYLON.BoxBuilder.CreateBox("box", {size: 1}, scene)

  const material = new BABYLON.StandardMaterial("white", scene)

  material.diffuseColor = BABYLON.Color3.White()

  box.material = material

  box.registerInstancedBuffer("color", 4)
  box.instancedBuffers.color = new BABYLON.Color4(1, 0, 0, 1)

  scene.createDefaultLight()

  var count = 0

  for (let i = 0; i < count; i++) {

    const instance = box.createInstance("box" + i)

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
    let guiCanvas = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
    let guiButton = BABYLON.GUI.Button.CreateSimpleButton("guiButton", label)
    guiButton.width = "150px"
    guiButton.height = "40px"
    guiButton.color = "white"
    guiButton.cornerRadius = 5
    guiButton.background = "green"

    guiButton.onPointerUpObservable.add(function() {
      guiCanvas.dispose();
    })

    guiButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
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

const scene = createScene()

const cameraPhysics = {
  velocity:0,
  acceleration: 0.01
}
engine.runRenderLoop( function() {
  // accelerate the camera in the z direction using acceleration variables
  cameraPhysics.velocity += cameraPhysics.acceleration
  if (cameraPhysics.velocity > 1) {
    cameraPhysics.velocity = 1
  }
  

  

  // Move the camera down the tunnel
  scene.activeCamera.position.z += cameraPhysics.velocity
    
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
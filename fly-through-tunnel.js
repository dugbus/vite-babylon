import tunner from "./assets/tunner.png";
import tripout from "./assets/tripout.png";
import cobbleAlbedo from "./assets/cobble-albedo.png";
import cobbleNormal from "./assets/cobble-normal.png";

export function createTunnel(scene) {
  [
    // {
    //   radius: 1,
    //   texture: "speedbar.png",
    //   scale:500
    // },
    {
      radius: 10,
      texture: tunner,
      uScale: 3,
      vScale: 100,
    },
    {
      radius: 10,
      texture: tripout,
      albedo: cobbleAlbedo,
      normal: cobbleNormal,
      uScale: 3,
      vScale: 100,
    },
  ].forEach(({ radius, texture, uScale, vScale, albedo, normal, rough }) => {
    const path = [];
    for (let f = -1000; f < 10000; f += 100) {
      path.push(new BABYLON.Vector3(0, 0, f));
    }
    // Create the tunnel
    const tunnel = BABYLON.MeshBuilder.CreateTube(
      "tunnel",
      {
        path,
        radius,
        tessellation: 50,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true,
      },
      scene
    );

    const tunnelMaterial = new BABYLON.StandardMaterial(texture, scene);
    tunnelMaterial.diffuseTexture = new BABYLON.Texture(albedo, scene);
    tunnelMaterial.bumpTexture = new BABYLON.Texture(normal, scene);
    tunnelMaterial.invertNormalMapY = true;
    tunnelMaterial.invertNormalMapX = true;
    tunnelMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.5, 0.4);

    //  tunnelMaterial.albedoTexture = new BABYLON.Texture();

    //tunnelMaterial.diffuseTexture = new BABYLON.Texture(texture, scene);
    // Make it mip mapped
    // tunnelMaterial.diffuseTexture = new BABYLON.Texture(
    //   texture,
    //   scene,
    //   true,
    //   true,
    //   BABYLON.Texture.TRILINEAR_SAMPLINGMODE
    // );
    // tunnelMaterial.diffuseTexture.hasAlpha = true;
    // tunnelMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    // tunnelMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    tunnelMaterial.diffuseTexture.uScale = uScale;
    tunnelMaterial.diffuseTexture.vScale = vScale;
    tunnelMaterial.bumpTexture.uScale = uScale;
    tunnelMaterial.bumpTexture.vScale = vScale;

    tunnel.material = tunnelMaterial;
    tunnel.position.x = 0;
    tunnel.position.y = 0;
    tunnel.position.z = 0;
  });
  //   // animate the tunnel
  //   const tunnelAnimation = new BABYLON.Animation(
  //     "tunnelAnimation",
  //     "rotation.z",
  //     60,
  //     BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  //     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  //   );
  //   // apply the animation to the tunnel
  //   const keys = [];
  //   keys.push({
  //     frame: 0,
  //     value: -Math.PI,
  //   });
  //   keys.push({
  //     frame: 1000,
  //     value: Math.PI,
  //   });
  //   tunnelAnimation.setKeys(keys);
  //   tunnel.animations = [];
  //   tunnel.animations.push(tunnelAnimation);
  //scene.beginAnimation(tunnel, 0, 1000, true);
}

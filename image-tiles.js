const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export async function imageTile(textureFilePath, scene, scale, position) {
  return new Promise((resolve, reject) => {
    console.log(textureFilePath);
    const texture = new BABYLON.Texture(
      textureFilePath,
      scene,
      true,
      true,
      BABYLON.Texture.NEAREST_SAMPLINGMODE
    );
    texture.onLoadObservable.add(() => {
      console.log(texture);
      const instances = [];
      const width = texture.getSize().width;
      const height = texture.getSize().height;

      console.log(width, height);

      const size = width * height;
      const data = texture.readPixels();
      const box = BABYLON.MeshBuilder.CreateBox(
        `basebox`,
        { size: scale },
        scene
      );

      box.registerInstancedBuffer("color", 4);
      box.instancedBuffers.color = new BABYLON.Color4(1, 0, 0, 1);

      for (let i = 0; i < size; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        const index = (y * width + x) * 4;

        if (data[index + 3] === 0) {
          continue;
        }
        // Create an instance of the box
        const instance = box.createInstance(`box${i}`);

        const centreOffsetX = (width * 1.1) / 2;
        const centreOffsetY = (height * 1.1) / 2;
        const spacing = scale * 1.1;

        instance.position.x = (x * 1.1 - centreOffsetX) * scale;
        instance.position.y = (y * 1.1 - centreOffsetY) * scale;
        instance.position.z = Math.random() * position;

        instance.acceleration = -(Math.random() * 0.05 + 0.05);
        instance.velocity = 0;

        instance.metadata = `box${i}`;

        box.instancedBuffers.color = new BABYLON.Color4(
          data[index] / 255,
          data[index + 1] / 255,
          data[index + 2] / 255,
          1
        );
        instances.push(instance);
      }

      return resolve({ instances: instances, targetY: position + 500 });
    });
  });
}

export function tickTiles({ instances, targetY }, scene) {
  if (instances) {
    for (const instance of instances) {
      if (instance) {
        instance.velocity += instance.acceleration;
        instance.position.z -= instance.velocity;
        if (instance.position.z > targetY) {
          instance.position.z = targetY;
        }
      }
    }
  }
}

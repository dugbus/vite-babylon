const getRandomInt = ( min, max ) => Math.floor( Math.random() * ( max - min ) ) + min

export function imageTile(texture, scene,scale,position) {
  const textureLoading = new BABYLON.Texture(
    texture,
    scene,
    true,
    true,
    BABYLON.Texture.NEAREST_SAMPLINGMODE
  );

  textureLoading.onLoadObservable.add((texture) => {
    const width = texture.getSize().width;
    const height = texture.getSize().height;
    
    console.log(width,height)


    const size = width * height;
    const data = texture.readPixels();
    const box = BABYLON.MeshBuilder.CreateBox(`basebox`, { size: scale }, scene);

    box.registerInstancedBuffer("color", 4);
    box.instancedBuffers.color = new BABYLON.Color4(1, 0, 0, 1);

    for (let i = 0; i < size; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      const index = (y * width + x) * 4;

      if (data[index+3] === 0) {
          continue
      }
      // Create an instance of the box
      const instance = box.createInstance(`box${i}`);

      const centreOffsetX = (width * 1.1) / 2;
      const centreOffsetY = (height * 1.1) / 2;
      const spacing = scale * 1.1;

      instance.position.x = ((x * 1.1)-centreOffsetX) * scale;
      instance.position.y = ((y * 1.1)-centreOffsetY) * scale;
      instance.position.z = position;

      instance.velocity = getRandomInt(1, 15);

      instance.metadata = `box${i}`;

      box.instancedBuffers.color = new BABYLON.Color4(
        data[index] / 255,
        data[index + 1] / 255,
        data[index + 2] / 255,
        1
      );
    }
  });
}

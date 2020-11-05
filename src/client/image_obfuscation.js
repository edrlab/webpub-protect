(function (root, factory) {
  // eslint-disable-next-line no-undef
  if (typeof module === 'object' && module.exports) {
    // eslint-disable-next-line no-undef
    module.exports = factory();
  } else {
    root.image_obfuscation = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const swap1 = (data, width, height) => {
    const lineLength = width * 4; // [R,G,B,A] pixels
    const arrLength = height * lineLength;

    // row / Y
    for (let i = 0; i < height; i += 10) {
      const f = i * lineLength;
      // column / X
      for (let k = 0; k < width; k++) {
        // pixel
        const j = f + k * 4;
        const n = f + lineLength * 2 - (k + 1) * 4;
        if (n >= arrLength) {
          break;
        }

        const r1 = data[j + 0];
        const g1 = data[j + 1];
        const b1 = data[j + 2];
        const a1 = data[j + 3];

        const r2 = data[n + 0];
        const g2 = data[n + 1];
        const b2 = data[n + 2];
        const a2 = data[n + 3];

        data[j + 0] = r2;
        data[j + 1] = g2;
        data[j + 2] = b2;
        data[j + 3] = a2;

        data[n + 0] = r1;
        data[n + 1] = g1;
        data[n + 2] = b1;
        data[n + 3] = a1;
      }
    }
  };
  const swap2 = (data, width, height) => {
    const lineLength = width * 4; // [R,G,B,A] pixels
    const arrLength = height * lineLength;

    let c = -1;
    for (let i = 0; i < arrLength; i += 4) {
      const r = data[i + 0];
      const g = data[i + 1];
      const b = data[i + 2];
      c++;
      const v = c % 3; // possible values [0, 2]
      switch (v) {
        case 0: {
          // swap R G
          data[i + 0] = g;
          data[i + 1] = r;
          // mod B
          data[i + 2] = 255 - b;
          break;
        }
        case 1: {
          // swap G B
          data[i + 1] = b;
          data[i + 2] = g;
          // mod R
          data[i + 0] = 255 - r;
          break;
        }
        case 2: {
          // swap R B
          data[i + 0] = b;
          data[i + 2] = r;
          // mod G
          data[i + 1] = 255 - g;
          break;
        }
        default: {
          break;
        }
      }

      // const a = data[i + 3]; // 255 = full opacity
      // data[i + 3] = 10;
    }
  };

  const obfuscate = (data, width, height) => {
    swap1(data, width, height);
    swap2(data, width, height);
  };
  const deobfuscate = (data, width, height) => {
    swap2(data, width, height);
    swap1(data, width, height);
  };
  return {
    obfuscate,
    deobfuscate,
  };
});

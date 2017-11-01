/* global AFRAME, THREE */

const glsl = require('glslify');
const vertexShader = glsl.file('../shaders/vertex.glsl');
const fragmentShader = glsl.file('../shaders/fragment.glsl');

// helper function
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// Construct scene
AFRAME.registerComponent('setup', {
  schema: {type: 'string'},

  init: function () {
    var stringToLog = this.data;
    console.log(stringToLog);

    var cubeSize = 2;
    var MaxNumCubesVertical = 20;
    var numCubes = 100;
    var range = 12;
    var randx, randz, randh;

    var origin = {
      'x': 0,
      'y': -2.0,
      'z': 0
    };
    var newEntity, ranNum;
    var newPosition = {
      'x': 0,
      'y': 0,
      'z': 0
    };

    for (var i = 0; i < numCubes; i++) {
      randx = getRandomIntInclusive(0 - range, range);
      randz = getRandomIntInclusive(0 - range, range);

      randh = getRandomIntInclusive(1, MaxNumCubesVertical);
      newEntity = document.createElement('a-entity');
        newEntity.setAttribute('geometry', {
          primitive: 'sphere',
          radius: cubeSize
        });
        newEntity.setAttribute('material-shader', 'color: blue');
        newPosition.x = (randx + 0.5)*cubeSize + origin.x;
        newPosition.y = (randh + 0.5)*cubeSize+ origin.y;
        newPosition.z = (randz + 0.5)*cubeSize + origin.z;
        console.log(newPosition);
        newEntity.setAttribute('position', newPosition.x + ' ' + newPosition.y + ' ' + newPosition.z);
        this.el.appendChild(newEntity);

    }


  }
});




// Add shaders
AFRAME.registerComponent('material-shader', {
  schema: {color: {type: 'color'}},

  /**
   * Creates a new THREE.ShaderMaterial using the two shaders defined
   * in vertex.glsl and fragment.glsl.
   */
  init: function () {
    const data = this.data;

    this.material  = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(data.color) }
      },
      vertexShader,
      fragmentShader
    });

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },


  /**
   * Update the ShaderMaterial when component data changes.
   */
  update: function () {
    this.material.uniforms.color.value.set(this.data.color);
  },

  /**
   * Apply the material to the current entity.
   */
  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.material = this.material;
    }
  },

  /**
   * On each frame, update the 'time' uniform in the shaders.
   */
  tick: function (t) {
    this.material.uniforms.time.value = t / 1000;
  }

})
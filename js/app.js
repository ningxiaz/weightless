(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global AFRAME, THREE */

const glsl = require('glslify');
const vertexShader = glsl(["#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"]);
const fragmentShader = glsl(["// Author:\n// Title:\n\n#ifdef GL_ES\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 vUv;\nuniform float time;\n\nvec3 colorA = vec3(1.000,0.739,0.758);\nvec3 colorB = vec3(0.606,0.800,1.000);\n\nfloat plot (vec2 st, float pct){\n  return  smoothstep( pct-0.01, pct, st.y) -\n          smoothstep( pct, pct+0.01, st.y);\n}\n\nvoid main() {\n    vec2 st = vUv;\n\n    vec3 color = vec3(0.);\n\n    float y = sin(st.y + sin(time));\n\n    vec3 pct = vec3(y);\n\n    pct.r = smoothstep(0.0,1.0, y);\n    // pct.b = sin(y*PI);\n    // pct.b = pow(st.x,0.5);\n\n    color = mix(colorA, colorB, pct);\n\n    gl_FragColor = vec4(color,1.0);\n}"]);

// helper function
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}


// construct the room
// AFRAME.registerComponent('room', {
//   schema: {
//     color: {default: '#FFF'},
//     sizeY: {type: 'number', default: 4},
//     sizeX: {type: 'number', default: 8},
//     sizeZ: {type: 'number', default: 8},
//     thickness: {type: 'number', default: 0.5},
//     doorWidth: {type: 'number', default: 1.5},
//     doorHeight: {type: 'number', default: 2},
//     doorPosition: {type: 'number', default: 1.5},
//   },

//   init: function() {
//     // as the first room in the scene

//     var frontLeftWall = document.createElement('a-box');
//     frontLeftWall.setAttribute('depth', this.thickness);
//     frontLeftWall.setAttribute('width', this.doorPosition);
//     frontLeftWall.setAttribute('height', this.sizeY);
//     frontLeftWall.setAttribute('position', {x: })
//   }
// });

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
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
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
},{"glslify":2}],2:[function(require,module,exports){
module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}

},{}]},{},[1]);

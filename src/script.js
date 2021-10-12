import './style.css'
import * as THREE from "three/build/three.module"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import sliderFragment from "./shaders/sliderFragment.glsl";
import sliderVertex from "./shaders/sliderVertex.glsl";
import * as dat from "dat.gui";
import gsap from "gsap";

//post processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CustomPass } from './CustomPass.js';

import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';



//imagesd
import t1 from './assets/images/1.jpg'
import t2 from './assets/images/2.jpg'
import t3 from './assets/images/3.jpg'
import t4 from './assets/images/4.jpg'
import t5 from './assets/images/5.jpg'
import t6 from './assets/images/6.jpg'
import t7 from './assets/images/7.jpg'
import t8 from './assets/images/8.jpg'
import t9 from './assets/images/9.jpg'



export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.urls = [t1,t2,t3]

    this.urls2 = [t4,t5,t6]
    this.urls3 = [t7,t8,t9]
    
 
    this.textures = this.urls.map(url=>new THREE.TextureLoader().load(url))
    this.textures1 = this.urls2.map(url=>new THREE.TextureLoader().load(url))
    this.textures2 = this.urls3.map(url=>new THREE.TextureLoader().load(url))
  

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias:true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor( 0xcccccc, 1 );

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 2);
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;
    
    this.initPost()
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.settings();
    this.handleScroll()
    this.handleImages()

    

    window.onclick = e => {
       // to get the element
      if(e.target.className === 'artists'){
        this.distort()
      }

      if(e.target.className === 'sun-devil'){
        this.unDistort()
      }
      
  } 

  
  }
  distort(){
    gsap.to(this.settings, {progress:0,duration:2})
  }
  unDistort(){
    gsap.to(this.settings, {progress:1,duration:2})
  }

  initPost(){
    				

    this.composer = new EffectComposer( this.renderer );
    this.composer.addPass( new RenderPass( this.scene, this.camera ) );

    this.effect1 = new ShaderPass( CustomPass );
   
    this.composer.addPass( this.effect1 );

    // const effect2 = new ShaderPass( RGBShiftShader );
    // effect2.uniforms[ 'amount' ].value = 0.0015;
    // this.composer.addPass( effect2 );

    
  }
  


  handleImages(){
    let images = [...document.querySelectorAll('img')]
    this.materials = []
    this.sliderMeshes = []
    this.groups = []

    images.forEach((im,i)=>{
        let mat = this.sliderMaterial.clone()
        this.materials.push(mat);
        let group = new THREE.Group()
         mat.uniforms.uTexture.value = new THREE.Texture(im)
         mat.uniforms.uTexture.value.needsUpdate = true
        let geo = new THREE.PlaneBufferGeometry(1.3,1,20,20)
         let mesh = new THREE.Mesh(geo,mat)
        this.sliderMeshes.push(mesh)
        group.add(mesh)
         this.scene.add(group)
         this.groups.push(group)
         mesh.position.y = i * 1.2

         group.rotation.y = -0.5

         group.rotation.z = -0.05

    })
}

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
      scale: 0.3
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
    this.gui.add(this.settings, "scale", 0, 10, 0.01);

  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;


    this.sliderMaterial = new THREE.ShaderMaterial({
        extensions: {
          derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
        uniforms: {
          uTexture: {value: null},
          time: { value: 0 },
          resolution: { value: new THREE.Vector4() },
          uDistance:{value: 0}
        },
        // wireframe: true,
         transparent: true,
        vertexShader: sliderVertex,
        fragmentShader: sliderFragment
      });


    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: {value: this.textures[0]},
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });

    this.geometry = new THREE.PlaneGeometry(0.8, 1, 1, 1);

    this.meshes=[]

    this.textures.forEach((t,i)=>{
      let m = this.material.clone()
      m.uniforms.uTexture.value = t
      let mesh = new THREE.Mesh(this.geometry,m)
     // this.scene.add(mesh)
      this.meshes.push(mesh)
      mesh.position.x = (i-0.9) *2
      mesh.position.z =-1
    })

    this.geometry = new THREE.PlaneGeometry(0.8, 1, 1, 1);

    this.meshes1=[]

    this.textures1.forEach((t,i)=>{
      let m = this.material.clone()
      m.uniforms.uTexture.value = t
      let mesh = new THREE.Mesh(this.geometry,m)
     // this.scene.add(mesh)
      this.meshes1.push(mesh)
       mesh.position.z = -1
      mesh.position.y =   1

      mesh.position.x = i - 0.9
      

    })

    this.meshes2=[]

    this.textures2.forEach((t,i)=>{
      let m = this.material.clone()
      m.uniforms.uTexture.value = t
      let mesh = new THREE.Mesh(this.geometry,m)
      //this.scene.add(mesh)
      this.meshes2.push(mesh)
        mesh.position.z =-1
      mesh.position.y =   0

      

    })

    //this.scene.add(this.plane);
  }

  
  handleScroll(){
    let speed = 0
var position = {}
position.pos = 0
let rounded = 0
let block = document.getElementById('block')
let wrap = document.getElementById('wrap')
let elems = [...document.querySelectorAll('.n')]
window.addEventListener('wheel',(e)=>{
    speed += e.deltaY * 0.0003
})

let objs = Array(5).fill({dist: 0})

let meshes = this.sliderMeshes

let that = this
function raf(){
    
    
    speed *= 0.8
    position.pos += speed
    console.log()
    
    
   
    if(that.sliderMeshes){
      objs.forEach((o,i)=>{
          o.dist = Math.min(Math.abs(position.pos - i),1)
          o.dist = 1 - o.dist**2
          elems[i].style.transform = `scale(${1 + 0.4*o.dist})`

          let scale = 1 + 0.1*o.dist;
          that.sliderMeshes[i].position.y = i*1.2 - position.pos * 1.2
          that.sliderMeshes[i].scale.set(scale,scale,scale)
          that.sliderMeshes[i].material.uniforms.uDistance.value = o.dist
        
          if(position.pos < -2 || position.pos > 6){
            
            gsap.to(position,{pos:0, duration:1})
          }
      })
    }
    
    rounded = Math.round(position.pos)

    let diff = rounded - position.pos

    position.pos += Math.sign(diff)*Math.pow(Math.abs(diff),0.7)*0.02

    // block.style.transform = `translate(0,${position * 100 + 50}px)`
    //wrap.style.transform = `translate(0,${position * 100 + 50}px)`
    
 

    window.requestAnimationFrame(raf)
}

raf()
  }


  render() {

    this.meshes.forEach((m,i)=>{
      m.position.y = -this.settings.progress -1
      m.position.z = -this.settings.progress + 0

      m.rotation.z = -this.settings.progress*Math.PI/2

    })

    
   
    this.time += 0.01;
    this.material.uniforms.time.value = this.time;
    if(this.materials){
        this.materials.forEach(m=>{
            m.uniforms.time.value = this.time
        })
    }



    this.effect1.uniforms[ 'time' ].value = this.time;
    this.effect1.uniforms[ 'progress' ].value = this.settings.progress;
    this.effect1.uniforms[ 'scale' ].value = this.settings.scale;


    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.composer.render()
    
  }
}


new Sketch({
  dom: document.getElementById("container")
});



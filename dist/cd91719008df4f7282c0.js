import"./style.css";import*as THREE from"../node_modules/three/build/three.module.js";import{OrbitControls}from"../node_modules/three/examples/jsm/controls/OrbitControls.js";import fragment from"./shaders/fragment.glsl";import vertex from"./shaders/vertex.glsl";import*as dat from"../node_modules/dat.gui";import gsap from"../node_modules/gsap";import{EffectComposer}from"three/examples/jsm/postprocessing/EffectComposer.js";import{RenderPass}from"three/examples/jsm/postprocessing/RenderPass.js";import{ShaderPass}from"three/examples/jsm/postprocessing/ShaderPass.js";import{CustomPass}from"./CustomPass.js";import{RGBShiftShader}from"three/examples/jsm/shaders/RGBShiftShader.js";import{DotScreenShader}from"three/examples/jsm/shaders/DotScreenShader.js";import t1 from"./assets/images/1.jpg";import t2 from"./assets/images/2.jpg";import t3 from"./assets/images/3.jpg";import t4 from"./assets/images/4.jpg";import t5 from"./assets/images/5.jpg";import t6 from"./assets/images/6.jpg";import t7 from"./assets/images/7.jpg";import t8 from"./assets/images/8.jpg";import t9 from"./assets/images/9.jpg";export default class Sketch{constructor(e){this.scene=new THREE.Scene,this.urls=[t1,t2,t3],this.urls2=[t4,t5,t6],this.urls3=[t7,t8,t9],this.textures=this.urls.map((e=>(new THREE.TextureLoader).load(e))),this.textures1=this.urls2.map((e=>(new THREE.TextureLoader).load(e))),this.textures2=this.urls3.map((e=>(new THREE.TextureLoader).load(e))),this.container=e.dom,this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.renderer=new THREE.WebGLRenderer({alpha:!0,antialias:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(4278190080,0),this.container.appendChild(this.renderer.domElement),this.camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.001,1e3),this.camera.position.set(0,0,2),this.controls=new OrbitControls(this.camera,this.renderer.domElement),this.time=0,this.isPlaying=!0,this.initPost(),this.addObjects(),this.resize(),this.render(),this.setupResize(),this.settings(),window.onclick=e=>{console.log(e.target.className),"artists"===e.target.className&&this.distort(),"sun-devil"===e.target.className&&this.unDistort()}}distort(){gsap.to(this.settings,{progress:0,duration:2})}unDistort(){console.log("hiii"),gsap.to(this.settings,{progress:1,duration:2})}initPost(){this.composer=new EffectComposer(this.renderer),this.composer.addPass(new RenderPass(this.scene,this.camera)),this.effect1=new ShaderPass(CustomPass),this.composer.addPass(this.effect1)}settings(){this.settings={progress:1,scale:.3},this.gui=new dat.GUI,this.gui.add(this.settings,"progress",0,1,.01),this.gui.add(this.settings,"scale",0,10,.01)}setupResize(){window.addEventListener("resize",this.resize.bind(this))}resize(){this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.renderer.setSize(this.width,this.height),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix()}addObjects(){this.material=new THREE.ShaderMaterial({extensions:{derivatives:"#extension GL_OES_standard_derivatives : enable"},side:THREE.DoubleSide,uniforms:{uTexture:{value:this.textures[0]},time:{value:0},resolution:{value:new THREE.Vector4}},vertexShader:vertex,fragmentShader:fragment}),this.geometry=new THREE.PlaneGeometry(.8,1,1,1),this.meshes=[],this.textures.forEach(((e,s)=>{let t=this.material.clone();t.uniforms.uTexture.value=e;let i=new THREE.Mesh(this.geometry,t);this.scene.add(i),this.meshes.push(i),i.position.x=s-.9})),this.geometry=new THREE.PlaneGeometry(.8,1,1,1),this.meshes1=[],this.textures1.forEach(((e,s)=>{let t=this.material.clone();t.uniforms.uTexture.value=e;let i=new THREE.Mesh(this.geometry,t);this.scene.add(i),this.meshes1.push(i),i.position.z=-1,i.position.y=1,i.position.x=s-.9})),this.meshes2=[],this.textures2.forEach(((e,s)=>{let t=this.material.clone();t.uniforms.uTexture.value=e;let i=new THREE.Mesh(this.geometry,t);this.scene.add(i),this.meshes2.push(i),i.position.z=.5,i.position.y=-1,i.position.x=s-.9}))}render(){this.meshes.forEach(((e,s)=>{e.position.y=0-this.settings.progress,e.rotation.z=-this.settings.progress*Math.PI/2})),this.time+=.01,this.material.uniforms.time.value=this.time,this.effect1.uniforms.time.value=this.time,this.effect1.uniforms.progress.value=this.settings.progress,this.effect1.uniforms.scale.value=this.settings.scale,requestAnimationFrame(this.render.bind(this)),this.renderer.render(this.scene,this.camera),this.composer.render()}}new Sketch({dom:document.getElementById("container")});
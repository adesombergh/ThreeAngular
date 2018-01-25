import { AfterViewInit,  Component,  ViewChild,  ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import "./EnableThree.js";

import "three/examples/js/controls/OrbitControls";
import "three/src/loaders/ObjectLoader";
import "three/examples/js/controls/TransformControls";


@Component({
  selector: 'mod-editor',
  templateUrl: 'mod-editor.html'
})

export class ModEditorComponent implements AfterViewInit {


    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;
    public sceneHelpers: THREE.Scene;
  
    public box: THREE.Box3 = new THREE.Box3();
    public selectionBox: THREE.BoxHelper = new THREE.BoxHelper();
  
    public controls: THREE.OrbitControls;
  
    private onDownPosition: THREE.Vector2 = new THREE.Vector2();
    private onUpPosition: THREE.Vector2 = new THREE.Vector2();
    private onDoubleClickPosition: THREE.Vector2 = new THREE.Vector2();
  
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private mouse: THREE.Vector2 = new THREE.Vector2();
  
    private objects: Array<any> = [];
  
    private transformControls: THREE.TransformControls;
  
    @ViewChild('canvas')
    private canvasRef: ElementRef;
  
    constructor() {
      this.addObject = this.addObject.bind(this);
      this.render = this.render.bind(this);
    }
  
    private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
    }
  
    private createScene() {
      this.scene = new THREE.Scene();
      this.scene.name = 'Scene';
      this.scene.background = new THREE.Color(0xaaaaaa);
      var geometry = new THREE.BoxGeometry(5, 5, 1);
      var material = new THREE.MeshPhysicalMaterial({
        color: 9132587,
        roughness: 0.8,
        metalness: 0.39,
        emissive: 0,
        clearCoat: 0,
        clearCoatRoughness: 0,
        depthFunc: 3,
        depthTest: true,
        depthWrite: true
      });
    }
  
    private addObject(obj) {
      this.objects.push(obj);
      this.scene.add(obj);
      this.render();
    }
  
    private createHelpers() {
      this.sceneHelpers = new THREE.Scene();
  
      var grid = new THREE.GridHelper(400, 100, 0xbbbbbb, 0x888888);
      this.sceneHelpers.add(grid);
  
  
      this.selectionBox.material.depthTest = false;
      this.selectionBox.material.transparent = true;
      this.selectionBox.visible = false;
      this.sceneHelpers.add( this.selectionBox );
    }
  
    private createFloor() {
      var geometry = new THREE.PlaneBufferGeometry(400, 400, 1, 1);
      var material = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        side: THREE.DoubleSide,
        roughness: .9,
        metalness: .58
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'the_floor';
      mesh.rotation.x = Math.PI / 2;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
  
    private createLight() {
      var light = new THREE.AmbientLight(0xefebd8);
      light.position.y = 1000;
      light.intensity = 2.06;
      this.scene.add(light);
  
      var light2 = new THREE.PointLight(0xffffff);
      light2.position.set(40, 250, 40);
      light2.intensity = 1.24;
      light2.castShadow = true;
      this.scene.add(light2);
    }
  
    private createCamera() {
      var aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 1000);
      this.camera.name = "Camera";
      // Set position and look at
      this.camera.position.set(100, 60, 100);
      this.camera.lookAt(new THREE.Vector3(0, 25, 0));
    }
  
    private startRendering() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
      });
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";

      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setPixelRatio(devicePixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0xffffff, 1);
      this.renderer.autoClear = false;
  
      let component: ModEditorComponent = this;
  
      (function render() {
        component.render();
      }());
    }
  
    public render() {
      this.sceneHelpers.updateMatrixWorld();
      this.scene.updateMatrixWorld();
      this.renderer.render(this.scene, this.camera);
      this.renderer.render(this.sceneHelpers, this.camera);
    }
  
    public addControls() {
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.addEventListener('change', this.render);
  
      this.transformControls = new THREE.TransformControls(this.camera, this.canvas);
      this.transformControls.setTranslationSnap( 2 );
      this.transformControls.setRotationSnap( THREE.Math.degToRad( 45 ) );
      this.transformControls.setSpace( 'local' );
      var fakeWorld = this;
      this.transformControls.addEventListener('change', function (evt) {
        if ( this.object !== undefined ) {
          fakeWorld.selectionBox.setFromObject( this.object );
        }
        fakeWorld.render();
      } );
      this.sceneHelpers.add( this.transformControls );
    }
  
    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
  
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.render();
    }
  
    public getMousePosition( dom, x, y ) {
      var rect = dom.getBoundingClientRect();
      return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
    }
  
    public onMouseDown(event: MouseEvent) {
      event.preventDefault();
      var array = this.getMousePosition( this.canvas, event.clientX, event.clientY );
      this.onDownPosition.fromArray( array );
    }
  
    public onMouseUp( event ) {
      let component = this;
      var array = component.getMousePosition( this.canvas, event.clientX, event.clientY );
      this.onUpPosition.fromArray( array );
      this.handleClick();
    }
  
    private getIntersects( point, objects ) {
      this.mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
      this.raycaster.setFromCamera( this.mouse, this.camera );
      return this.raycaster.intersectObjects( objects );
    }
  
    private handleClick() {
      // Si le mouseDown et le mouseUp sont au même endroit  = click sec
      if ( this.onDownPosition.distanceTo( this.onUpPosition ) === 0 ) {
        var intersects = this.getIntersects( this.onUpPosition, this.objects );
        if ( intersects.length > 0 ) {
          var object = intersects[ 0 ].object;
          this.select( object );
        } else {
          this.select( null );
        }
        this.render();
      }
    }
  
    private select( obj ) {
      this.selectionBox.visible = false;
      this.transformControls.detach();
      if ( obj !== null && obj !== this.scene && obj !== this.camera ) {
        this.box.setFromObject( obj );
        if ( this.box.isEmpty() === false ) {
          this.selectionBox.setFromObject( obj );
          this.selectionBox.visible = true;
          this.transformControls.attach( obj );
        }
      }
    }
  
    changeEditMode(mode){
      if (mode==="Rotate") mode = "rotate";
      if (mode==="Move") mode = "translate";
      this.transformControls.setMode(mode);
    }

    addMod(){
      console.log('Adding Mod');
      var loader = new THREE.ObjectLoader();
      loader.load(
        '../assets/MODs.json',
        this.addObject,
        function ( xhr ) {
          console.log('Loading');
        },
        // onError callback
        function( err ) {
          console.log( 'An error happened' );
          console.error(err);
        }
      );

    }

    ngAfterViewInit() {
      this.createScene();
      this.createHelpers();
      this.createFloor();
      this.createLight();
      this.createCamera();
      this.startRendering();
      this.addControls();
    }
  
  }
  
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as THREE from 'three';
import "./EnableThree.js";

import "three/src/loaders/ObjectLoader";

@Injectable()

export class TheEditorService {
  
  private theMatrixReloaded = new Subject<any>();
  public reload$ = this.theMatrixReloaded.asObservable();
  
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public sceneHelpers: THREE.Scene;
  public loader: THREE.ObjectLoader;
  public objects = [];
  
  private selected = null;

  public selectionBox: THREE.BoxHelper = new THREE.BoxHelper();

  constructor() {
    this.igniteCamera();
    this.igniteHelpers();
    this.igniteScene();
    this.igniteTheDream();

    this.addObject = this.addObject.bind(this);
  }


  public igniteCamera(){
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
    this.camera.name = "TheEye";
    this.camera.position.set(100, 60, 100);
    this.camera.lookAt(new THREE.Vector3(0, 25, 0));
  }

  public igniteHelpers(){
    this.sceneHelpers = new THREE.Scene();
  
    var grid = new THREE.GridHelper(400, 100, 0xbbbbbb, 0x888888);
    this.sceneHelpers.add(grid);

    this.selectionBox.material.depthTest = false;
    this.selectionBox.material.transparent = true;
    this.selectionBox.visible = false;
    this.sceneHelpers.add( this.selectionBox );
  }

  public igniteScene() {
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.scene.background = new THREE.Color(0xaaaaaa);
  }

  public igniteTheDream(){
    //FLOOR
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

    //LIGHT 1
    var light = new THREE.AmbientLight(0xefebd8);
    light.position.y = 1000;
    light.intensity = 2.06;
    this.scene.add(light);

    //LIGHT 2
    var light2 = new THREE.PointLight(0xffffff);
    light2.position.set(40, 250, 40);
    light2.intensity = 1.24;
    light2.castShadow = true;
    this.scene.add(light2);
}

  /**
   * Sets a scene. Useful when you need to load a whole scene. This will overwrite current scene.
   */
  public setScene (scene) {
    // In Here we will set a scene
  }

  /**
   * Adds an object to the scene but also to the objects array
   */
  public addObject (object) {
    // In Here we will add an object
    this.objects.push(object);
    this.scene.add(object);

    this.theMatrixReloaded.next();
  }

  /**
   * Removes an object from the scene but also from the objects array
   */
  public removeObject (object) {
    // In Here we will add an object
  }

  /**
   * Selects an object from the scene
   */
  public select (object) {
    // In Here we will select the object
  }

  /**
   * Selects objects from the scene
   */
  public selectMany (objects) {
    // In Here we will select many objects
  }

  /**
   * Selects an object by id
   */
  public selectById (id) {
  }

  /**
   * Selects an object by id
   */
  public selectByUuid (id) {
  }

  /**
   * Select everything
   */
  public selectAll () {
    // In Here we will select everything
  }
  
  /**
   * Deselect everything
   */
  public deselect () {
    // In Here we will deselect everything
  }

  /**
   * Group objects together
   */
  public groupObjects ( objects ) {
    // In Here we will select everything
  }

  /**
   * Ungroup previously grouped objects
   */
  public unGroupObjects ( group ) {
    // In Here we will select everything
  }

  /**
   * Reset the Editor
   */
  public reset () {

  }

  /**
   * Imports a whole scene from JSON
   */
  public importJSON (json) {

  }

  /**
   * Exports a whole scene to JSON
   */
  public exportJSON () {

  }

  /**
   * Move or Rotate?
   */
  public changeEditMode (){

  }

  /**
   * Add fresh mod to scene
   */
  public addMod () {
    this.loader = new THREE.ObjectLoader();
    this.loader.load(
      '../assets/MODs.json',
      this.addObject,
      function ( xhr ) {},
      function( err ) {
        console.log( 'An error happened' );
        console.error(err);
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as THREE from 'three';
import "./EnableThree.js";
import "three/src/loaders/ObjectLoader";

import { Defaults } from "./defaults";

@Injectable()

export class TheEditorService {
  
  public defaults = new Defaults;

  private theMatrixReloaded = new Subject<any>();
  public theMatrixReloaded$ = this.theMatrixReloaded.asObservable();

  private objectRemoved = new Subject<any>();
  public objectRemoved$ = this.objectRemoved.asObservable();

  private objSelected = new Subject<any>();
  public objSelected$ = this.objSelected.asObservable();

  private editModeChanged = new Subject<any>();
  public editModeChanged$ = this.editModeChanged.asObservable();

  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public sceneHelpers: THREE.Scene;
  public loader: THREE.ObjectLoader;

  public objects = [];
  private selected = null;

  public editMode = "translate";
  public nextMode = "Rotate";


  constructor() {
    this.plugMeIn();

    this.addObject = this.addObject.bind(this);
  }

  /**
   * I need guns, lots of guns.
   */
  public plugMeIn(){
    this.camera = this.defaults.camera;
    this.scene = this.defaults.scene;
    this.sceneHelpers = this.defaults.sceneHelpers;
  }

  /**
   * Sets a scene. Useful when you need to load a whole scene. This will overwrite current scene.
   */
  public setScene (scene) {
		this.scene.uuid = scene.uuid;
    this.scene.name = scene.name;
		if ( scene.background !== null ) this.scene.background = scene.background.clone();
		while ( scene.children.length > 0 ) {
			this.addObject( scene.children[ 0 ] );
		}
  }

  /**
   * Adds an object to the scene but also to the objects array
   */
  public addObject (object) {
    this.objects.push(object);
    this.scene.add(object);

    this.theMatrixReloaded.next();
  }

  /**
   * Clones an object
   */
  public cloneObject () {
    let clone = this.selected.clone();
    this.addObject(clone);
  }

  /**
   * Removes an object from the scene but also from the objects array
   */
  public removeObject (object) {
    if ( object.parent === null ) return; // avoid deleting the camera or scene
    object.parent.remove( object );
    this.objects.splice( this.objects.indexOf( object ), 1 );

    this.objectRemoved.next();
  }

  /**
   * Removes the selected object
   */
  public removeSelected () {
		this.removeObject( this.selected );
  }

  /**
   * Selects an object from the scene
   */
  public select (object) {
		if ( this.selected === object ) return;
		var uuid = null;
		if ( object !== null ) {
			uuid = object.uuid;
		}
    this.selected = object;
    this.objSelected.next(object);
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
    if (this.editMode == "translate") {
      this.editMode = "rotate"
      this.nextMode = "Move";
    } else {
      this.editMode = "translate"
      this.nextMode = "Rotate";
    }
    this.editModeChanged.next(this.editMode);
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

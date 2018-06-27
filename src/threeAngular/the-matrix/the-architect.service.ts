import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as THREE from 'three';
import "../EnableThree.js";
import "three/src/loaders/ObjectLoader";

import { Defaults } from "./defaults";
import { Nebuchadnezzar } from "./the-nebuchadnezzar";

@Injectable()

export class TheArchitect {
  public defaults = new Defaults;

  private theMatrixReloaded = new Subject < any > ();
  public theMatrixReloaded$ = this.theMatrixReloaded.asObservable();

  private selectionChanged = new Subject < any > ();
  public selectionChanged$ = this.selectionChanged.asObservable();

  private editModeChanged = new Subject < any > ();
  public editModeChanged$ = this.editModeChanged.asObservable();

  private selectModeChanged = new Subject < any > ();
  public selectModeChanged$ = this.selectModeChanged.asObservable();

  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public sceneHelpers: THREE.Scene;
  public nebuchadnezzar: Nebuchadnezzar; // This is my Ship!

  public loader: THREE.ObjectLoader;

  public objects = [];
  public selected = [];

  public translateMode = {
    'id': 'translate',
    'nextText': 'Rotate',
    'nextIcon': '3d_rotation'
  }
  public rotateMode = {
    'id': 'rotate',
    'nextText': 'Translate',
    'nextIcon': 'open_with'
  }
  public editMode = this.translateMode;


  constructor() {
    this.addObject = this.addObject.bind(this); //Add the right 'this' context to method
    this.plugMeIn();
  }

  /******************************************************
   *          I need guns, lots of guns.
   *******************************************************/
  public plugMeIn() {
    this.camera = this.defaults.camera;
    this.scene = this.defaults.scene;
    this.sceneHelpers = this.defaults.sceneHelpers;
    this.nebuchadnezzar = new Nebuchadnezzar(this.scene, this.sceneHelpers);

    this.loader = new THREE.ObjectLoader();
    this.loader.load(
      '../assets/MODs.json',
      (object)=>{
        object.position.x = 20;object.position.z = -20;
        this.objects.push(object);
        this.scene.add(object);
        this.theMatrixReloaded.next();
      }
    );
    this.loader.load(
      '../assets/MODs.json',
      (object)=>{
        object.position.x = -30;object.position.z = 30;
        this.objects.push(object);
        this.scene.add(object);
        this.theMatrixReloaded.next();
      }
    );
    this.loader.load(
      '../assets/MODs.json',
      (object)=>{
        this.objects.push(object);
        this.scene.add(object);
        this.theMatrixReloaded.next();
      }
    );
  }

  /*************************************************
   *
   *               GENERAL Methods
   *
   *************************************************/
  /**
   * Sets a scene. Useful when you need to load a whole scene. This will overwrite current scene.
   */
  public setScene(scene) {
    this.scene.uuid = scene.uuid;
    this.scene.name = scene.name;
    if (scene.background !== null) this.scene.background = scene.background.clone();
    while (scene.children.length > 0) {
      this.addObject(scene.children[0]);
    }
  }

  /**
   * Resets the Editor
   */
  public reset() {
    this.deselect();
    this.defaults = new Defaults;
    this.camera.copy(this.defaults.camera);
    this.scene.copy(this.defaults.scene);

    this.objects = [];

    this.theMatrixReloaded.next();
  }

  /**
   * Move or Rotate?
   */
  public changeEditMode() {
    if (this.editMode.id == "translate") {
      this.editMode = this.rotateMode
    } else {
      this.editMode = this.translateMode
    }
    this.editModeChanged.next(this.editMode.id);
  }

  /**
   * Load an object via AJAX from Json file.
   */
  public loadObjFromJson(path) {
    this.loader = new THREE.ObjectLoader();
    this.loader.load(
      path,
      this.addObject,
      function (xhr) {},
      function (err) {
        console.log('An error happened');
        console.error(err);
      }
    );
  }

  /**
   * Add a fresh MOD to scene. Bye!
   */
  public addMod() {
    this.loadObjFromJson('../assets/MODs.json');
  }

  /*************************************************
   *
   *             SINGLE OBJECT MANIPULATION
   *
   *************************************************/

  /**
   * Adds an object to the scene but also to the objects array
   */
  public addObject(object) {
    this.objects.push(object);
    this.scene.add(object);
    this.theMatrixReloaded.next();
  }

  /**
   * Clones an object
   */
  public cloneObject(object) {
    var clone = object.clone();
    this.addObject(clone);
  }

  /**
   * Removes an object from the scene but also from the objects array
   */
  public removeObject(object) {
    if (object.parent === null) return; // avoid deleting the camera or scene
    this.nebuchadnezzar.drop(object);
    this.objects.splice(this.objects.indexOf(object), 1);
    this.scene.remove(object);
    this.theMatrixReloaded.next();
  }

  /*************************************************
   *
   *                  SELECTIONS
   *
   *************************************************/
  /**
   * Tell us if the passed object is already in selection array
   */
  public isSelected(object) {
    return (this.selected.indexOf(object) != -1);
  }

  /**
   * Temporarly strips helpers out of an object and execute
   * something to this object and then put helpers back
   */
  private stripObject(object, callback) {
    let helper = this.getBoxHelperIn(object);
    this.nebuchadnezzar.drop(object);
    object.remove(helper);

    callback(object);

    object.add(helper);
    this.nebuchadnezzar.drag(object);
  }

  /**
   * cloneSelection
   */
  public cloneSelection() {
    if (!this.selected.length) return;
    this.selected.forEach(object => {
      this.stripObject(object, (object) => {
        this.cloneObject(object);
      });
    });
    this.theMatrixReloaded.next();
  }

  /**
   * Sends the selected objects to heaven (or maybe to hell ...)
   */
  public removeSelection() {
    for (let i = this.selected.length-1; i >= 0; i--) {
      const obj = this.selected[i];
      this.removeObject(obj);
    }
    this.deselect();
  }

  /**
   * Push new object to selected array
   */
  public addToSelection(object) {
    this.selected.push(object);
  }

  /**
   * Removes object from selected array
   */
  public removeFromSelection(object) {
    this.selected.splice(this.selected.indexOf(object), 1);
  }

  /**
   * Select everything
   */
  public selectAll() {
    this.deselect();
    this.objects.forEach(object => {
      this.selected.push(object);
    });
    this.handleSelectionHelpers();
  }

  /**
   * Deselects everything
   */
  public deselect() {
    this.selected = [];
    this.handleSelectionHelpers(true);
  }

  /*************************************************
   *
   *                USER HELPERS
   *
   *************************************************/

  /**
   * This guy updates the helpers upon selection
   */
  private handleSelectionHelpers(clear ? ) {
    if (clear) {
      this.nebuchadnezzar.redBox.visible = false;
      this.nebuchadnezzar.clear();
    } else {

      this.nebuchadnezzar.update(this.selected);
    }
    this.updateBoxes();
    this.selectionChanged.next();
    this.theMatrixReloaded.next();
  }

  /**
   * Adds pretty little yellow boxes!
   */
  private updateBoxes() {
    if (!this.objects.length) return;
    this.objects.forEach(object => {
      if (object.getObjectByName('yellowBox')) {
        object.remove(object.getObjectByName('yellowBox'));
      }
    });
    this.selected.forEach(object => {
      let yellowBox = this.defaults.selectionBox(object);
      this.sceneHelpers.add(yellowBox);
      THREE.SceneUtils.attach(yellowBox, this.scene, object);
    });
  }

  /**
   * Find the Yellow Box inside an object
   */
  private getBoxHelperIn(object) {
    return object.getObjectByName('yellowBox');
  }

  /*************************************************
   *
   *                   EVENTS
   *
   *************************************************/
  /**
   * What to do if user clicks an object
   */
  public handleClick(target) {
    if (this.isSelected(target)) {
      this.removeFromSelection(target);
    } else {
      this.addToSelection(target);
    }
    this.handleSelectionHelpers();
  }
}

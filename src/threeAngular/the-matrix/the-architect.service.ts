import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as THREE from 'three';
import "../EnableThree.js";
import "three/src/loaders/ObjectLoader";

import { Defaults } from "./defaults";

@Injectable()

export class TheArchitect {
  public defaults = new Defaults;

  private theMatrixReloaded = new Subject<any>();
  public theMatrixReloaded$ = this.theMatrixReloaded.asObservable();

  private selectionChanged = new Subject<any>();
  public selectionChanged$ = this.selectionChanged.asObservable();

  private editModeChanged = new Subject<any>();
  public editModeChanged$ = this.editModeChanged.asObservable();

  private selectModeChanged = new Subject<any>();
  public selectModeChanged$ = this.selectModeChanged.asObservable();

  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public sceneHelpers: THREE.Scene;
  public nebuchadnezzar = new THREE.Mesh( new THREE.BoxGeometry( 4, 4, 4 ), new THREE.MeshBasicMaterial({ color: 0xa1ff11, wireframe: false,visible:false }) ); // temporary multi-selection group
  public nebuchasBoundingBox = new THREE.Box3;
  public redBox = new THREE.Box3Helper(null, 0xff0000);

  public loader: THREE.ObjectLoader;

  public objects = [];
  public selected = [];

  public manyMode = {
    'id' : 'many',
    'nextText' : 'Select Multiple Elements',
    'nextIcon' : 'radio_button_checked'
  }
  public singleMode = {
    'id' : 'one',
    'nextText' : 'Select One Element',
    'nextIcon' : 'radio_button_unchecked'
  }
  public selectMode = this.manyMode;


  public translateMode  = {
    'id'    : 'translate',
    'nextText' : 'Rotate',
    'nextIcon' : '3d_rotation'
  }
  public rotateMode  = {
    'id'    : 'rotate',
    'nextText' : 'Translate',
    'nextIcon' : 'open_with'
  }
  public editMode = this.translateMode;
  

  constructor() {
    this.addObject = this.addObject.bind(this); //Add right 'this' to method
    this.plugMeIn();
  }

  /**
   * I need guns, lots of guns.
   */
  public plugMeIn (){
    this.camera = this.defaults.camera;
    this.scene = this.defaults.scene;
    this.sceneHelpers = this.defaults.sceneHelpers;
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
   * Adds an object to the scene but also to the objects array
   */
  public addYellowBox (object) {
    let selectionBox = new THREE.BoxHelper();
    selectionBox.material.depthTest = false;
    selectionBox.material.transparent = true;
    selectionBox.name = "yellowBox";
    selectionBox.setFromObject( object );
    object.add(selectionBox);
}
  /**
   * Clones an object
   */
  public cloneObject (object) {
      var clone = object.clone();
      this.addObject(clone);
  }

  /**
   * cloneSelection
   */
  public cloneSelection() {
    if (!this.selected.length) return;
    this.selected.forEach(object => {

      this.stripSelection(object,(object)=>{
        this.cloneObject(object);
      })

    });
    this.theMatrixReloaded.next();
  }

  private getBoxHelperIn(object) {
    return object.getObjectByName('yellowBox');
  }

  private stripSelection (selection, callback){
    let helper = this.getBoxHelperIn(selection);
    this.removeFromNebuchadnezzar(selection);
    selection.remove( helper );

    callback(selection);
    
    selection.add( helper );
    this.addToNebuchadnezzar(selection);
  }
  /**
   * Removes an object from the scene but also from the objects array
   */
  public removeObject (object) {
    if ( object.parent === null ) return; // avoid deleting the camera or scene
    object.parent.remove( object );
    this.objects.splice( this.objects.indexOf( object ), 1 );
    this.theMatrixReloaded.next();
  }

  /**
   * Removes the selected object
   */
  public removeSelected () {
    this.selected.forEach(object => {
      this.removeObject( object );
    });
    this.deselect();
  }

  /**
   * Selects one object from the scene
   */
  public selectOne (object) {
    this.selected = [object];
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
    this.selected.splice( this.selected.indexOf( object ), 1 );
  }

  /**
   * Select everything
   */
  public selectAll () {
    console.log(this.objects);
    this.deselect();

    this.selected = this.objects;

    this.updateNebuchadnezzar();
    this.updateBoxes();
    this.selectionChanged.next();
    this.theMatrixReloaded.next();

  }
  
  /**
   * Deselect everything
   */
  public deselect () {
    this.selected = [];

    if (this.selectMode.id == 'many') this.clearNebuchadnezzar();
    this.updateBoxes();
    this.selectionChanged.next();
    this.theMatrixReloaded.next();
  }


  /**
   * Reset the Editor
   */
  public reset () {
    this.defaults = new Defaults;
		this.camera.copy( this.defaults.camera );
		this.scene.copy( this.defaults.scene );

		this.objects = [];

		this.theMatrixReloaded.next();
  }

  /**
   * Move or Rotate?
   */
  public changeEditMode (){
    if (this.editMode.id == "translate") {
      this.editMode = this.rotateMode
    } else {
      this.editMode = this.translateMode
    }
    this.editModeChanged.next(this.editMode.id);
  }

  /**
   * Select one or many?
   */
  public changeSelectMode (){
    if (this.selectMode.id == "many") {
      this.selectMode = this.singleMode;
    } else {
      this.selectMode = this.manyMode;
    }
    this.deselect();
    this.selectModeChanged.next(this.selectMode.id); // Keep it here for the toolbar pliz.
  }
  
  /**
   * Load an object via AJAX from Json file.
   */
  public loadObjFromJson (path) {
    this.loader = new THREE.ObjectLoader();
    this.loader.load(
      path,
      this.addObject,
      function ( xhr ) {},
      function( err ) {
        console.log( 'An error happened' );
        console.error(err);
      }
    );
  }

  /**
   * Add fresh mod to scene. Bye!
   */
  public addMod () {
    this.loadObjFromJson('../assets/MODs.json');
  }


  /**
   * Tell us if the passed object is already in selection array
   */
  public isSelected ( object ) {
    return (this.selected.indexOf(object) != -1);
  }

  /**
   * What to do if user clicks an object
   */
  public handleClick ( target ) {
    if (this.selectMode.id == "many") {
      
      if (this.isSelected( target )){
        this.removeFromSelection( target );  
      } else {
        this.addToSelection( target );
      }
      
    } else {
      if (!this.isSelected( target )) {
        this.selectOne( target );
      }
    }
    
    this.updateNebuchadnezzar();
    this.updateBoxes();
    this.selectionChanged.next();
    this.theMatrixReloaded.next();
  }




  /**
   * Keep's Nebucha synced and centered!!!
   *              This one is tricky! 
   * Ok, so. Before binding the controllers to nabuchos we want to
   * use the center of the group as anchor point for the controllers,
   * right? Ok let's do it.
   */
  public updateNebuchadnezzar () {    
    // First we create a temporary group
    let geo = new THREE.BoxGeometry( 2, 2, 2);
    geo.applyMatrix( new THREE.Matrix4().makeTranslation(1,1,1) );
    let tempGroup = new THREE.Mesh( geo, new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }) ); // temporary multi-selection group
    this.scene.add(tempGroup);

    // And we remove everything from Nebuchadnezzar!
    this.clearNebuchadnezzar();

    // Then we set the temporary group's position to first selected object's position
    tempGroup.position.x = this.selected[0].position.x;
    tempGroup.position.y = this.selected[0].position.y;
    tempGroup.position.z = this.selected[0].position.z;
    tempGroup.updateMatrixWorld();

    // Then we add every selected element to our temporary group
    this.selected.forEach(obj => {
      THREE.SceneUtils.attach(obj,this.scene,tempGroup);
    })

    // Then we set a Minimum Bounding Box for this group (awesome!)
    this.nebuchasBoundingBox.setFromObject( tempGroup );
    
    // So we can center Nebuchadnezzar in this Box's center and refresh it's vectors
    this.nebuchasBoundingBox.center( this.nebuchadnezzar.position );
    this.nebuchadnezzar.updateMatrixWorld();

    // Then we remove every selected element of the temporary group
    // and add'em to Nebucha
    this.selected.forEach(object => {
      THREE.SceneUtils.detach(object,tempGroup,this.scene);
      this.addToNebuchadnezzar(object);
    })
    
    // Finaly we erase temporary group from scene
    this.scene.remove(tempGroup);

    // But WAIT!!!! We could also just add a surrounding red box to Nebucha
    // this.redBox.box = this.nebuchasBoundingBox;
    // this.sceneHelpers.add(this.redBox);
    
    // Piece of cake
  }


  /**
   * Adds pretty little yellow boxes!
   */
  public updateBoxes() {
    if (!this.objects.length) return;
    this.objects.forEach(object => {
      if (object.getObjectByName('yellowBox')){
        object.remove( object.getObjectByName('yellowBox') );
      }
    });
    this.selected.forEach(object => {
      let yellowBox = this.defaults.selectionBox(object);
      this.sceneHelpers.add(yellowBox);
      THREE.SceneUtils.attach(yellowBox,this.scene,object);
    });
  }

  /**
   * Remove all elements from MulitSelection Group
   */
  public clearNebuchadnezzar() {
    while (this.nebuchadnezzar.children.length) {
      THREE.SceneUtils.detach(this.nebuchadnezzar.children[0],this.nebuchadnezzar,this.scene);
    }
  }

  /**
   * Add To MulitSelection Group
   */
  public addToNebuchadnezzar(obj) {
    THREE.SceneUtils.attach(obj,this.scene,this.nebuchadnezzar);
  }

  /**
   * Remove From MulitSelection Group
   */
  public removeFromNebuchadnezzar(obj) {
    THREE.SceneUtils.detach(obj,this.nebuchadnezzar,this.scene);
  }

}

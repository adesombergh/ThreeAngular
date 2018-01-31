import { Injectable } from '@angular/core';
import * as THREE from 'three';
import "./EnableThree.js";

@Injectable()
export class MatrixService {

  constructor() { }

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public sceneHelpers: THREE.Scene;

  public box: THREE.Box3 = new THREE.Box3();
  public selectionBox: THREE.BoxHelper = new THREE.BoxHelper();

  public controls: THREE.OrbitControls;

  private onDownPosition: THREE.Vector2 = new THREE.Vector2();
  private onUpPosition: THREE.Vector2 = new THREE.Vector2();
  // private onDoubleClickPosition: THREE.Vector2 = new THREE.Vector2();

  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();

  private objects: Array<any> = [];

  private transformControls: THREE.TransformControls;


}

import { AfterViewInit,  Component,  ViewChild,  ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import "./EnableThree.js";

import "three/examples/js/controls/OrbitControls";
import "three/examples/js/controls/TransformControls";

import { TheEditorService } from './the-editor.service';

@Component({
  selector: 'the-matrix',
  templateUrl: 'the-matrix.html'
})

export class TheMatrix implements AfterViewInit {
  private renderer: THREE.WebGLRenderer;

  public controls: THREE.OrbitControls;
  private transformControls: THREE.TransformControls;

  private onDownPosition: THREE.Vector2 = new THREE.Vector2();
  private onUpPosition: THREE.Vector2 = new THREE.Vector2();
  // private onDoubleClickPosition: THREE.Vector2 = new THREE.Vector2();

  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  

  /**
   * Defines the HTML CANVAS in which we inject The Matrix
   */
  constructor( private theEditor: TheEditorService ) {
    this.render = this.render.bind(this);
    theEditor.reload$.subscribe(()=> {
      this.render();
    })
  }

  /**
   * Defines the HTML CANVAS in which we inject The Matrix
   */
  @ViewChild('theCanvas') private theCanvas: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.theCanvas.nativeElement;
  }

  /**
   * Making The Matrix a better world!
   */
  public render() {
    this.theEditor.sceneHelpers.updateMatrixWorld();
    this.theEditor.scene.updateMatrixWorld();
    this.renderer.render(this.theEditor.scene, this.theEditor.camera);
    this.renderer.render(this.theEditor.sceneHelpers, this.theEditor.camera);
  }

  /**
   * Recalculate Aspect Ratio when the window resizes. Otherwise everything would look streched or crushed.
   */
  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    this.theEditor.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.theEditor.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.render();
  }

  /**
   * Calculates mouse position relatively to theMatrix
   */
  public getMousePosition( dom, x, y ) {
    var rect = dom.getBoundingClientRect();
    return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
  }

  /**
   * Stocks mouse position as vector on incoming click
   */
  public onMouseDown(event: MouseEvent) {
    var array = this.getMousePosition( this.canvas, event.clientX, event.clientY );
    this.onDownPosition.fromArray( array );
  }

  /**
   * Stocks mouse position as vector on outgoing click then...
   */
  public onMouseUp( event ) {
    var array = this.getMousePosition( this.canvas, event.clientX, event.clientY );
    this.onUpPosition.fromArray( array );
    this.handleClick();
  }

  /**
   * What to do on Click
   */
  private handleClick() {
    // If mouseDown and mouseUp were in the same place (means it's a short click)
    if ( this.onDownPosition.distanceTo( this.onUpPosition ) === 0 ) {
      var intersects = this.getIntersects( this.onUpPosition, this.theEditor.objects );
      if ( intersects.length > 0 ) {
        var object = intersects[ 0 ].object;
        this.theEditor.select( object );
      } else {
        this.theEditor.select( null );
      }
      this.render();
    }
  }

  /**
   * Send a virtual LASER BEAM to determine which objects are in the mouse path
   */
  private getIntersects( point, objects ) {
    this.mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
    this.raycaster.setFromCamera( this.mouse, this.theEditor.camera );
    return this.raycaster.intersectObjects( objects );
  }


  /**
   * Enable Moving inside The Matrix
   */
  public addOrbitControls() {
    this.controls = new THREE.OrbitControls(this.theEditor.camera);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.addEventListener('change', this.render);
  }

  /**
   * Give us power to control The Matrix
   */
  public addTransformControls() {
    this.transformControls = new THREE.TransformControls(this.theEditor.camera, this.canvas);
    this.transformControls.setTranslationSnap( 2 );
    this.transformControls.setRotationSnap( THREE.Math.degToRad( 45 ) );
    this.transformControls.setSpace( 'local' );

    let TheMatrix: TheMatrix = this; // Hacking the system...
    this.transformControls.addEventListener('change', function (evt) {
      if ( this.object !== undefined ) {
        TheMatrix.theEditor.selectionBox.setFromObject( this.object );
      }
      TheMatrix.render();
    } );

    this.theEditor.sceneHelpers.add( this.transformControls );
  }

  /**
   * Start Rendering The Matrix
   */
  private dodgeThis() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    this.theEditor.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.theEditor.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.autoClear = false;

    let TheMatrix: TheMatrix = this;
    (function render() {
      TheMatrix.render();
    }());

    this.addOrbitControls();
    this.addTransformControls(); 
  }

  /**
   * Lock and Load
   */
  ngAfterViewInit() {
    this.dodgeThis(); // Start the Matrix
  }

}
  
import { AfterViewInit,  Component,  ViewChild,  ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import "../EnableThree.js";

import "three/examples/js/controls/OrbitControls";
import "three/examples/js/controls/TransformControls";

import { TheArchitect } from './the-architect.service';

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
  private selectionBox: THREE.BoxHelper = new THREE.BoxHelper();
  private box: THREE.Box = new THREE.Box3();


  /**
   * THE ARCHITECT
   */
  constructor( private theArchitect: TheArchitect ) {
    this.render = this.render.bind(this);

    theArchitect.theMatrixReloaded$.subscribe(()=> { this.render(); })
    theArchitect.objSelected$.subscribe( (obj) => { this.selectObject(obj) } )
    theArchitect.objectRemoved$.subscribe( () => { this.deselect() } )
    theArchitect.editModeChanged$.subscribe( (nextMode) => { this.transformControls.setMode( nextMode ) } )
  }



  /**
   * Removes all obj helpers
   */
  private deselect() {
		this.transformControls.detach();
    this.selectionBox.visible = false;
    this.render();
  }

  /**
   * Adds helpers to selected object
   */
  private selectObject(object) {
    this.selectionBox.visible = false;
		this.transformControls.detach();
		if ( object !== null && object !== this.theArchitect.scene && object !== this.theArchitect.camera ) {
      this.box.setFromObject( object );
			if ( this.box.isEmpty() === false ) {
				this.selectionBox.setFromObject( object );
				this.selectionBox.visible = true;
			}
			this.transformControls.attach( object );
    }

    this.render();
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
    this.theArchitect.sceneHelpers.updateMatrixWorld();
    this.theArchitect.scene.updateMatrixWorld();
    this.renderer.render(this.theArchitect.scene, this.theArchitect.camera);
    this.renderer.render(this.theArchitect.sceneHelpers, this.theArchitect.camera);
  }

  /**
   * Calculate Aspect Ratio of The Matrix. Avoids compression and streching of the scene.
   */  
  public calculateAspectRatio(){
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    this.theArchitect.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.theArchitect.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
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
      var intersects = this.getIntersects( this.onUpPosition, this.theArchitect.objects );
      if ( intersects.length > 0 ) {
        var object = intersects[ 0 ].object;
        this.theArchitect.select( object );
      } else {
        this.theArchitect.select( null );
      }
      this.render();
    }
  }

  /**
   * Send a virtual LASER BEAM to determine which objects are in the mouse path. Remember it's a 3D World!
   */
  private getIntersects( point, objects ) {
    this.mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
    this.raycaster.setFromCamera( this.mouse, this.theArchitect.camera );
    return this.raycaster.intersectObjects( objects );
  }

  /**
   * Adds Helpers
   */
  private addHelpers() {
    this.selectionBox.material.depthTest = false;
    this.selectionBox.material.transparent = true;
    this.selectionBox.visible = false;
    this.theArchitect.sceneHelpers.add( this.selectionBox );    
  }


  /**
   * Enable Moving inside The Matrix
   */
  public addOrbitControls() {
    this.controls = new THREE.OrbitControls(this.theArchitect.camera);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.addEventListener('change', this.render);
  }

  /**
   * Give us power to control objects in The Matrix 
   */
  public addTransformControls() {
    this.transformControls = new THREE.TransformControls(this.theArchitect.camera, this.canvas);
    this.transformControls.setTranslationSnap( 2 );
    this.transformControls.setRotationSnap( THREE.Math.degToRad( 45 ) );
    this.transformControls.setSpace( 'world' );

    let TheMatrix: TheMatrix = this; // Hacking the system...
    this.transformControls.addEventListener('change', function (evt) {
      if ( this.object !== undefined ) {
        TheMatrix.selectionBox.setFromObject( this.object );
      }
      TheMatrix.render();
    } );

    this.theArchitect.sceneHelpers.add( this.transformControls );
  }

  /**
   * Start Rendering The Matrix
   */
  private dodgeThis() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.calculateAspectRatio();
    this.addHelpers();

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.autoClear = false;

    this.addOrbitControls();
    this.addTransformControls();

    this.render();
  }

  /**
   * Lock and Load
   */
  ngAfterViewInit() {
    this.dodgeThis(); // Start the Matrix
  }

}
  
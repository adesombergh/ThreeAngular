import * as THREE from 'three';
import "../EnableThree.js";


export class Nebuchadnezzar extends THREE.Mesh {
  public nebuchasBoundingBox = new THREE.Box3;
  public redBox = new THREE.Box3Helper(null, 0xff0000);

  private scene: THREE.Scene;
  private sceneHelpers: THREE.Scene;

  constructor(scene,sceneHelpers) {
    super(
      new THREE.BoxGeometry( 4, 4, 4 ),
      new THREE.MeshBasicMaterial({ visible:false })
    )
    this.scene = scene;
    this.sceneHelpers = sceneHelpers;
  }


  /**
   * Remove all elements from MulitSelection Group
   */
  public clear() {
    while (this.children.length) {
      THREE.SceneUtils.detach(this.children[0],this,this.scene);
    }
  }

  /**
   * Add To MulitSelection Group
   */
  public drag(obj) {
    THREE.SceneUtils.attach(obj,this.scene,this);
  }

  /**
   * Remove From MulitSelection Group
   */
  public drop(obj) {
    THREE.SceneUtils.detach(obj,this,this.scene);
  }

  /**
   * Keep's Nebucha synced and centered!!!
   *              This one is tricky! 
   * Ok, so. Before binding the controllers to nabuchos we want to
   * use the center of the group as anchor point for the controllers,
   * right? Ok let's do it.
   */
  public update (selected) {    
    // First we create a temporary group
    let geo = new THREE.BoxGeometry( 2, 2, 2);
    geo.applyMatrix( new THREE.Matrix4().makeTranslation(1,1,1) );
    let tempGroup = new THREE.Mesh( geo, new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }) ); // temporary multi-selection group
    this.scene.add(tempGroup);

    // And we remove everything from Nebuchadnezzar!
    this.clear();

    // Then we set the temporary group's position to first selected object's position
    tempGroup.position.x = selected[0].position.x;
    tempGroup.position.y = selected[0].position.y;
    tempGroup.position.z = selected[0].position.z;
    tempGroup.updateMatrixWorld();

    // Then we add every selected element to our temporary group
    selected.forEach(obj => {
      THREE.SceneUtils.attach(obj,this.scene,tempGroup);
    })
    
    // Then we set a Minimum Bounding Box for this group (awesome!)
    this.nebuchasBoundingBox.setFromObject( tempGroup );
    
    // So we can center Nebuchadnezzar in this Box's center and refresh it's vectors
    this.nebuchasBoundingBox.center( this.position );
    this.updateMatrixWorld();
    
    // Then we remove every selected element of the temporary group
    // and add'em to Nebucha

    selected.forEach(object => {
      THREE.SceneUtils.detach(object,tempGroup,this.scene);
      this.drag(object);
    })

    // Finaly we erase temporary group from scene
    this.scene.remove(tempGroup);

    // But WAIT!!!! We could also just add a surrounding red box to Nebucha
    this.redBox.box = this.nebuchasBoundingBox;
    this.redBox.visible = true;
    this.sceneHelpers.add(this.redBox);

    // Piece of cake
  }
  

  /**
   * updateRedBox
   */
  public updateRedBox() {
    this.nebuchasBoundingBox.setFromObject( this );
    this.redBox.box = this.nebuchasBoundingBox;
  }
}
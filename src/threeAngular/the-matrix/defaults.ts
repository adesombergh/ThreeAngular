import * as THREE from 'three';
import "../EnableThree";

export class Defaults {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public sceneHelpers: THREE.Scene;
  
    constructor() {
        this.camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
        this.camera.name = "TheEye";
        this.camera.position.set(100, 60, 100);
        this.camera.lookAt(new THREE.Vector3(0, 25, 0));

        this.scene = new THREE.Scene();
        this.scene.name = 'Scene';
        this.scene.background = new THREE.Color(0xaaaaaa);

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

        this.sceneHelpers = new THREE.Scene();

        var grid = new THREE.GridHelper(400, 100, 0xbbbbbb, 0x888888);
        grid.name = "grid";
        this.sceneHelpers.add(grid);
    }

    public selectionBox(object){
        let selectionBox = new THREE.BoxHelper();
        selectionBox.material.depthTest = false;
        selectionBox.material.transparent = true;
        selectionBox.name = "yellowBox";
        selectionBox.setFromObject( object );
        return selectionBox;
    }
}
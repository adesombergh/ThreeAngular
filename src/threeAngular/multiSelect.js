

var selected = [];//array des objets sélectionnés
var control = new THREE.TransformControls(camera, renderer.domElement);
control.addEventListener( 'change', render );
//les différentes commandes liés aux boutons html
var box = document.getElementById("check");
var move = document.getElementById("move");
var fix = document.getElementById("fix");
var tourner = document.getElementById("tourner");
var translate = document.getElementById("translate");
var supprimer = document.getElementById("supprimer");

//céation d'un cube qui servira d'objet parent
var parentCube = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100, 10, 10, 10), new THREE.MeshBasicMaterial({ color: 0xa1ff11, wireframe: true }));
//selection  multiple
function multiSelect( event ) {    
    event.preventDefault();
//position 3D de la souris      
    var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   
                          -( event.clientY / window.innerHeight ) * 2 + 1, 0.5 ); 
 // classe permetant de trouvr l'intersection entre deux objets                             
    var raycaster =  new THREE.Raycaster();                                        
    raycaster.setFromCamera( mouse3D, camera );
    var intersects = raycaster.intersectObjects( scene.children, true );
  
    if(intersects.length > 0){
      if(!selected.includes(intersects[0].object)){
        selected.push(intersects[0].object);
        // change la couleur de l'objet pour montrer qu'il est sélectionné
        intersects[0].object.material.color.setHex( 0x0000ff );
      }else{
        //redonner sa texture initiale à l'objet
        intersects[0].object.material.color.setHex( 0xffffff );
        var index = selected.indexOf(intersects[0].object);
        if (index > -1) {
          selected.splice(index, 1);
          }
      }

   }

} 
// checkbox pour déclencher ou arrèter la sélection multiple

box.addEventListener("click", function(e){
//vérifie si la box est checkée 
  if(box.checked){
 //ajout multiSelect
    document.addEventListener( 'mousedown', multiSelect );    
  }else{ 
      if(selected.length > 0){
        for (var i = 0; i < selected.length; i++) {
          selected[i].material.color.setHex( 0xffffff );
        }
        selected = [];
      }
//enlever multiselect
      document.removeEventListener("mousedown", multiSelect);
  }

});

//manipuler la selection
move.addEventListener("click", function(e){
//ajout du transformControle
  if(selected.length > 0){ 
    var x = selected[selected.length -1].position.x;
    var y = selected[selected.length -1].position.y;
    var z = selected[selected.length -1].position.z;

    parentCube.position.set(x,y,z);
    control.position.set(x,y,z);

    scene.add(parentCube);
    for (var i = 0; i < selected.length; i++) {
      THREE.SceneUtils.attach(selected[i], scene, parentCube);
    }

    control.attach(parentCube);
    scene.add(control); 
  } else {

    control.detach(parentCube);
    scene.remove(control);
    scene.remove(parentCube);
    selected = [];  
  }

}); 


//rotate la selection
tourner.addEventListener("click", function(e){

  control.setMode( "rotate" );

});
//translate la selection
translate.addEventListener("click", function(e){

  control.setMode( "translate" );

});
//supprimer la selection
supprimer.addEventListener("click", function(e){
  for (var i = 0; i < selected.length; i++) {
    THREE.SceneUtils.detach(selected[i],  parentCube, scene);
  }
  control.detach(parentCube);
  scene.remove(control);
  scene.remove(parentCube);
  for (var i = 0; i < selected.length; i++) {
    scene.remove(selected[i]);
  }
  selected = [];

});
//cloner la selection
/*
var duplicate = document.getElementById("duplicate");
translate.addEventListener("click", function(e){

  for (var i = 0; i < selected.length; i++) {
    selected[i].clone();
  }

});*/





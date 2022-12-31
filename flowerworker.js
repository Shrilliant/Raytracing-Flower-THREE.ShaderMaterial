// proper initialization
if( 'function' === typeof importScripts) {
    importScripts("./three.js-r148/100/three.min.js");
    importScripts("./three.js-r148/100/ParametricGeometries.js");
    addEventListener('message', onMessage);
 
    function onMessage(e) { 

      if(e.data[0]=="flower"){
  
  
      function vShape(A, r, a, b, c){
          return A*Math.pow(Math.E, -b*Math.pow(Math.abs(r), c))*Math.pow(Math.abs(r), a);
        }
        
        function bumpiness(A, r, f, angle){
          return 1 + A * Math.pow(r, 2) * Math.sin(f * angle);
        }
  
  
      function g(secondLayer = false) {
        
        let flowerparams
        if(secondLayer){
          flowerparams = e.data[3][1]
        } else {
          flowerparams = e.data[3][e.data[2]]
        }
        
          return function f(u, v, vector) {
            // console.log("f has run!")
            var out = f0(u, v, flowerparams);
            vector.set(out.x, out.y, out.z);
          }
        }
  

      function f0(u, v, parameters) {
      
          parameters.u = u
          let petalNoAlign = parameters.petalNoAlign
         
          let thetaPi = parameters.thetaPi
          var theta = 2*Math.PI * u;
          phi = parameters.phi
          
          let pLen = parameters.pLen
          let curve1 = parameters.curve1
          let curve2 = parameters.curve2
          let fHeight = parameters.fHeight
          let b = parameters.b
          let bNum = parameters.bNum
          let pNum = parameters.pNum
          let pSharp = parameters.pSharp
          let fD = parameters.fD
          
          let r = (pLen*Math.pow(Math.abs(Math.sin(pNum/2*v*360/10)),pSharp)+fD) * theta/5;
          let x = r * Math.cos(v*360/10);
          let y = r * Math.sin(v*360/10);
          let z = vShape(fHeight, r/100, curve1, curve2, 1.5) - 100+
            bumpiness(b, r/100, bNum, v*360/10);
    
            // let pos = createVector(x, y, z);
          
          
          var beta = -1* r * (x * Math.cos(phi)) * 1
          return new THREE.Vector3(
            x,
            y,
            z
          ).multiplyScalar(e.data[4]);
        
        }
  
        let message = new THREE.ParametricGeometry(g(), e.data[3][e.data[1]].uSteps, e.data[3][e.data[1]].vSteps)
        
        let message2
        message = new THREE.BufferGeometry().fromGeometry(message)


         postMessage( [{normal: [message.attributes.normal.array], position: [message.attributes.position.array], uv:[message.attributes.uv.array], index:[0]}, e.data[1], e.data[5]] ); //add to worker B) //don't use .toNonIndexed()
       
        


        message.dispose();

      }
    }    
 }


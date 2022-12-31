import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PhysicalPathTracingMaterial, PathTracingRenderer, MaterialReducer, BlurredEnvMapGenerator, PathTracingSceneGenerator } from 'three-gpu-pathtracer';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
let renderer
let pathTracer, sceneInfo, fsQuad, floor;
let delaySamples = 0;

const params = {
    enable: true,
    toneMapping: true,
    pause: false,
    tiles: 3,
    transparentBackground: false,
    resolutionScale: 1,
    roughness: 0.15,
    metalness: 0.9,
};


window.workers = []
window.workers.push(new Worker('flowerworker.js'))
window.flowerWorkerNumber = 1;

window.planeSize = 50
window.planePresent = false;
window.flowerNumber = 1;

var points = [[0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0], [0.00001, 0, 0]];


let controls;
var scene = new THREE.Scene();
let sceneObject = new THREE.Object3D()
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(2, aspect, 1, 10000);
camera.up.set(0, 0, 1)
camera.position.z = 400;
camera.position.x = window.planeSize * 16;
camera.position.y = window.planeSize * 16;
console.log("Three revision: " + THREE.REVISION)

renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: false });
renderer.setPixelRatio(window.devicePixelRatio);


renderer.setSize(window.innerWidth * 3, window.innerHeight * 3);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setClearColor(0xdddddd);

renderer.domElement.id = "threeJsCanvas"
document.body.appendChild(renderer.domElement);
pathTracer = new PathTracingRenderer(renderer);
pathTracer.alpha = true;
pathTracer.tiles.set(params.tiles, params.tiles);
pathTracer.material = new PhysicalPathTracingMaterial();
pathTracer.material.setDefine('FEATURE_GRADIENT_BG', 1);
pathTracer.material.setDefine('FEATURE_MIS', 1);


pathTracer.camera = camera;

fsQuad = new FullScreenQuad(new THREE.MeshBasicMaterial({
    map: pathTracer.target.texture,
    blending: THREE.CustomBlending
}));


controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 0, 0);
controls.update();
var scene = new THREE.Scene();
var axis = new THREE.Vector3(0, 0, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 20
directionalLight.lookAt(0, 0, 0);

scene.add(directionalLight);
sceneObject.add(directionalLight)

const geometry12345 = new THREE.SphereGeometry(0.5, 32, 16);
const material123456 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere1234567 = new THREE.Mesh(geometry12345, material123456);
sphere1234567.position.set(0, 0, 40);
// scene.add(sphere1234567);
// sceneObject.add(sphere1234567)

for (var i = 0; i < window.workers.length; i++) {
    window.workers[i].onmessage = function (e) {


        if (e.data[2]) {
            window.flowersArray[e.data[2]].onWorkerMessage(e);
        }

    }
}


class e {
    constructor(flowerIndexNumber, startColor = Math.random() * 360, coords = false) {
        if (coords) {
            this.coords = coords
        }

        this.finished = false;
        this.flowerSpire = false
        this.flowerLayers = "is2Layer"
        this.objects = []
        this.flowerIndexNumber = flowerIndexNumber
        this.flowerParameters = [];
        this.l = []
        this.object = new THREE.Object3D();
        this.layers = []
        this.materialSettings = []
        this.materials = []
        this.parameters = []
        this.flowerHeight = 0;
        this.flowerDiameer = 0;
        this.curve1 = 0;
        this.curve2 = 0;
        this.petalNumber = 0;
        this.petalLength = 0;
        this.rotation = 0;
        this.bValue = 0;
        this.color1 = 0;
        this.color2 = 0;
        this.color3 = 0;
        this.color4 = 0;
        this.startColor = startColor;
        this.startColorHue = startColor
        this.c2 = null;
        this.scale = 0.005
        this.l = 50
        this.flowerGeomOffset = 0;
        this.lastBboxMin = 0;
        this.color1Arr = []
        this.color2Arr = []
        this.color3Arr = []
        this.color4Arr = []
        this.toWhite = Math.random() < 0.5 ? true : false;
        this.parametersNum = -1
        this.rawMaterials = []
        this.stamenEndCaps = []
        this.stamenGeomMaterialParams = []
        this.stamenGeomParams = []
        this.stamenGeomLayers = []
        this.stamenEndCapMaterialParams = []
        this.sGMP = 0
        this.sECMP = 0
        this.MaterialIndex = { count: 0, name: "MaterialIndex" };
        this.stamenMaterialIndex = { count: 0, name: "stamenMaterialIndex" };
        this.stamenECMaterialIndex = { count: 0, name: "stamenECMaterialIndex" };
        this.posNeg = Math.random() < 0.5 ? -1 : 1
        this.flowerNum = 2
        this.structure = this.chooseStructure();

        this.l = [[211.80496041521013, 50.999999999999986, 255],
        [49.86584599275697, 0, 153],
        [0, 27.82937110119138, 204],
        [49.86584599275684, 0, 153],
        [211.80496041521013, 50.999999999999986, 255],
        [153, 0, 114.65840536994175],
        [204, 0, 58.560708068388344],
        [153, 0, 114.65840536994187]]


        for (var a = 0; a < this.flowerNum; a++) {


            this.flowerParameters.push(this.a(a, this.structure))


        }



        this.b();



    }

    b() {



        window.workers[window.flowerWorkerNumber % window.workers.length].postMessage(["flower", 0, 0, this.flowerParameters, this.scale, this.flowerIndexNumber, this.flowerLayers])
        window.flowerWorkerNumber++

        if (window.flowerWorkerNumber > window.workers.length - 1) {
            window.flowerWorkerNumber = 1
        }

    }

    getCenterPoint(mesh) {
        let middle = new THREE.Vector3();
        let geometry = mesh.geometry;

        geometry.computeBoundingBox();

        middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
        middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
        middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

        mesh.localToWorld(middle);
        return middle;
    }

    CalculateCircleCenter(points) {
        let centerX = 0
        let centerY = 0
        let centerZ = 0

        for (var i = 0; i < points.length; i = i + 3) {
            centerX = centerX + points[i]
            centerY = centerY + points[i + 1]
            centerZ = centerZ + points[i + 2]
        }

        centerX = centerX / (points.length / 3)
        centerY = centerY / (points.length / 3)
        centerZ = centerZ / (points.length / 3)

        return { x: centerX, y: centerY, z: centerZ };


    }

    a(a) {
let c = {
b:5,
bNum:4,
curve1:2.1535717593764874,
curve2:0.5178572531254957,
fD:174.95859172041648,
fHeight:203.38085918281826,
flowerGeomOffset:1e-24,
increment:-4.074797114076036,
pLen:162,
pNum:1,
pSharp:0.804913862696417,
petalNoAlign:10.4,
phi:2.0943951023931953,
rotation:10,
scaleNumber:240.4830335924528,
startColorHue:225.1998936497954,
theta:6.283185307179586,
thetaPi:2,
uSteps:60,
vSteps: 60,
    materialSettings: {
        color1: new THREE.Color(`rgb(${Math.round(this.l[(a * 3) + 0][0])},${Math.round(this.l[(a * 3) + 0][1])},${Math.round(this.l[(a * 3) + 0][2])})`),
        color2: new THREE.Color(`rgb(${Math.round(this.l[(a * 3) + 1][0])},${Math.round(this.l[(a * 3) + 1][1])},${Math.round(this.l[(a * 3) + 1][2])})`),
        color3: new THREE.Color(`rgb(${Math.round(this.l[(a * 3) + 2][0])},${Math.round(this.l[(a * 3) + 2][1])},${Math.round(this.l[(a * 3) + 2][2])})`),
        color4: new THREE.Color(`rgb(${Math.round(this.l[(a * 3) + 2][0])},${Math.round(this.l[(a * 3) + 2][1])},${Math.round(this.l[(a * 3) + 2][2])})`),
        centerSize: 14,
        centerSize2: 6.4,
        defaultFade: true,
        f3Offset: 0,
        lowlights: false,
        subtleFade: false,
        topf2: false,
        vertCenterGradient: false,
        vertOffset: -0.5,
    }
}
        return c
    }


    onWorkerMessage(e) {
        this.object = new THREE.Object3D();
        let parsedGeom = new THREE.BufferGeometry();
        let normals = e.data[0].normal[0]
        let positions = e.data[0].position[0]
        let uvs = e.data[0].uv[0]
        parsedGeom.attributes.normal = new THREE.BufferAttribute(normals, 3)
        parsedGeom.attributes.normal.needsUpdate = true
        parsedGeom.attributes.position = new THREE.BufferAttribute(positions, 3)
        parsedGeom.attributes.position.needsUpdate = true
        parsedGeom.attributes.uv = new THREE.BufferAttribute(uvs, 2)
        parsedGeom.attributes.uv.needsUpdate = true
        parsedGeom.needsUpdate = true;
        let bufferNormals, bufferPositions, bufferUvs, bufferIndices
        bufferNormals = parsedGeom.attributes.normal
        bufferPositions = parsedGeom.attributes.position
        bufferUvs = parsedGeom.attributes.uv
        bufferIndices = parsedGeom.attributes.index
        parsedGeom.computeBoundingBox()
        this.layers.push(parsedGeom)

        for (var k = 0; k < this.layers.length; k++) {
            this.layers[k].computeBoundingBox();
            this.layers[k].computeBoundingSphere();
            this.rawMaterials.push({
                bbMin: { value: this.layers[k].boundingBox.min },
                bbMax: { value: this.layers[k].boundingBox.max },
                color1: { value: new THREE.Color(this.flowerParameters[k].materialSettings.color1) },
                color2: { value: new THREE.Color(this.flowerParameters[k].materialSettings.color2) },
                color3: { value: new THREE.Color(this.flowerParameters[k].materialSettings.color3) },
                color4: { value: new THREE.Color(this.flowerParameters[k].materialSettings.color4) },
                vertOffset: { value: this.flowerParameters[k].materialSettings.vertOffset },
                centerSize: { value: this.flowerParameters[k].materialSettings.centerSize },
                centerSize2: { value: this.flowerParameters[k].materialSettings.centerSize2 },
                f3Offset: { value: this.flowerParameters[k].materialSettings.f3Offset },
                topf2: { value: this.flowerParameters[k].materialSettings.topf2 },
                vertCenterGradient: { value: this.flowerParameters[k].materialSettings.vertCenterGradient },
                lowlights: { value: this.flowerParameters[k].materialSettings.lowlights },
                subtleFade: { value: this.flowerParameters[k].materialSettings.subtleFade },
                defaultFade: { value: this.flowerParameters[k].materialSettings.defaultFade }
            })
            this.layers[k].computeBoundingBox();
            this.layers[k].computeBoundingSphere();
            this.rawMaterials[k].bbMin.value = this.layers[k].boundingBox.min
            this.rawMaterials[k].bbMax.value = this.layers[k].boundingBox.max
            this.materialSettings.push(this.rawMaterials[k])
        }

        let object3 = new THREE.Object3D();
        let vector = new THREE.Vector3().fromArray(points[i]);
        for (let j = 0; j < this.layers.length; j++) {

            this.addTransReorientedMesh(this.layers[j], addMaterialNew(this.materialSettings[j]), this.object, axis, vector, j)
        }


        object3.add(this.object)
        this.objects.push(object3)
        this.objects[0].traverse(n => {
            if (n.isMesh) {
                n.castShadow = true;
                n.receiveShadow = true;
                if (n.material.map) n.material.map.anisotropy = 16;
            }
        });
            this.finished = true;
            checkFinished();
    }

    addToScene(flower, coords = false) {
        scene.add(flower)
        sceneObject.add(flower)
        if (coords) {
            flower.position.x = coords.x
            flower.position.y = coords.y
            flower.position.z = coords.z
        }

    }

    translateAndReorient(axis, vector) {
        var vX1 = axis.normalize();
        var vX2 = vector.normalize();
        var vY = vX1.clone().cross(vX2).normalize();
        var vZ1 = vX1.clone().cross(vY).normalize();
        var vZ2 = vX2.clone().cross(vY).normalize();
        var M1array = [vX1.x, vX1.y, vX1.z, vY.x, vY.y, vY.z, vZ1.x, vZ1.y, vZ1.z];
        var M1 = new THREE.Matrix3().fromArray(M1array);
        var M2array = [vX2.x, vY.x, vZ2.x, vX2.y, vY.y, vZ2.y, vX2.z, vY.z, vZ2.z];
        var M2 = new THREE.Matrix3().fromArray(M2array);
        var M = M1.clone().multiply(M2);
        var elems = M.elements;
        var A = new THREE.Matrix4();
        A.set(elems[0], elems[1], elems[2], vector.x,
            elems[3], elems[4], elems[5], vector.y,
            elems[6], elems[7], elems[8], vector.z,
            0, 0, 0, 1);
        return A;
    }

    addTransReorientedMesh(geom, material, object, axis, vector, j) {
        var mesh = new THREE.Mesh(geom, material);
        var transfoMatrix = this.translateAndReorient(axis, vector);
        mesh.matrix = transfoMatrix;
        mesh.matrixAutoUpdate = true;

        let name = Date.now() + Math.random();
        mesh.name = name
        mesh.rotation.z = 2 * Math.PI * (this.flowerParameters[j].rotation / 360);

        scene.add(mesh)
        sceneObject.add(mesh)

        const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));

        const intersects = raycaster.intersectObjects(scene.children);

        let zPoint = 0;

        for (let i = 0; i < intersects.length; i++) {

            if (intersects[i].object.name = name) {

                zPoint = intersects[i].point.z
            }

        }



            if (zPoint > 0) {
                mesh.position.z = mesh.position.z - zPoint + this.flowerParameters[j].flowerGeomOffset
            } else if (zPoint < 0) {
                mesh.position.z = mesh.position.z + Math.abs(zPoint) + this.flowerParameters[j].flowerGeomOffset
            } else {
                mesh.position.z = mesh.position.z + this.flowerParameters[j].flowerGeomOffset
            }


            if (this.lastBboxMin != 0) {

                if (this.lastBboxMin > geom.boundingBox.min.z) {
                    mesh.position.z = mesh.position.z + (this.lastBboxMin - geom.boundingBox.min.z) + 0.01
                }

                this.lastBboxMin = geom.boundingBox.min.z

            } else {
                this.lastBboxMin = geom.boundingBox.min.z
            }


        this.object.add(mesh);
        scene.remove(mesh)
        sceneObject.remove(mesh)

    }

    chooseStructure() {
        let structureType
                this.flowerSpire = false;
                this.flowerNum = 1
                this.flowerLayers = ""
        structureType = "1Layer"
        return structureType
    }
}



for (var i = 0; i < 2; i++) {
let d = new e(i, 0, new THREE.Vector3(0, 0, 0))
    window.flowersArray.push(d)
}

window.convexHulls = []

function checkFinished() {
    let states = []
    window.flowersArray.forEach((flower) => { states.push(flower.finished) })

    function getOccurrence(array, value) {
        var count = 0;
        array.forEach((v) => (v === value && count++));
        return count;
    }


    if (window.flowersArray.length == (2) && getOccurrence(states, true) == 2 - 1) {

        window.flowersArray.shift();


        window.flowersArray.forEach(

            (flower) => {



                    scene.add(flower.objects[0].clone())
                    sceneObject.add(flower.objects[0].clone())

            }


        )

        window.convexHulls.forEach(hull => {
            scene.remove(hull)
            sceneObject.remove(hull)
        })

        const generator = new PathTracingSceneGenerator();
        const result = generator.generate(sceneObject);


        
        /* FLOWERS ARE GENERATED, SEND DATA TO PATHTRACER! */

        //ADD SCENE INFO!!!

        sceneInfo = result;
        sceneInfo.scene.traverse(c => {

            if (c.isLineSegments) {

                c.visible = false;

            }

        });
        scene.add(sceneInfo.scene);

        const { bvh, textures, materials } = result;
        const geometry = bvh.geometry;
        const material = pathTracer.material;

        material.bvh.updateFrom(bvh);
        material.textures.setTextures(renderer, 2048, 2048, textures);
        pathTracer.reset();
        render();


    }
}


    var geo = new THREE.PlaneGeometry(window.planeSize, window.planeSize, 8, 8);
    var mat = new THREE.MeshLambertMaterial({ color: 0xaeaeae, side: THREE.DoubleSide, receiveShadow: true, castShadow: true });

    var plane = new THREE.Mesh(geo, mat);
    plane.position.z = -0.6
    plane.receiveShadow = true;

    scene.add(plane);
    sceneObject.add(plane)


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


function render() {
    requestAnimationFrame(render);

    if (!sceneInfo) {

        return;

    }

    renderer.toneMapping = params.toneMapping ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;

    if (pathTracer.samples < 1.0 || !params.enable) {

        renderer.render(scene, camera);

    }

    if (params.enable && delaySamples === 0) {

        const samples = Math.floor(pathTracer.samples);
        pathTracer.material.materials.updateFrom(sceneInfo.materials, sceneInfo.textures);
        pathTracer.material.filterGlossyFactor = 0.5;
        pathTracer.material.physicalCamera.updateFrom(camera);

        camera.updateMatrixWorld();

        if (!params.pause || pathTracer.samples < 1) {

            pathTracer.update();

        }

        renderer.autoClear = false;
        fsQuad.render(renderer);
        renderer.autoClear = true;

    } else if (delaySamples > 0) {
        delaySamples--;
    }



}

window.initialized = true
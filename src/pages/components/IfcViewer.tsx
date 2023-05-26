import React, {useEffect} from "react";
import {IRootState} from "../../store/store";
import {connect, ConnectedProps} from "react-redux";
import {baseUrl} from "../../server/api";
import {useNavigate, useParams} from "react-router-dom";
import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    GridHelper,
    Material,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";
import {IFCLoader} from "web-ifc-three/IFCLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const mapStateToProps = (state: IRootState) => {
    return {
        token: state.accountSlice.token
    }
}

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps)
type ReduxProps = ConnectedProps<typeof connector>

interface IProps extends ReduxProps {
}

const IfcViewer = (props: IProps) => {
    const params = useParams()
    const navigate = useNavigate();
    const model_id = params['model_id'];
    console.log(model_id)
    useEffect(
        () => {
            if (model_id === null) {
                console.error('Model id is null')
                navigate('/models')
            }
            const threeCanvas = document.getElementById(`${model_id}-ifc-viewer-canvas`);
            if (threeCanvas === null) {
                navigate('/models')
                return
            }
            const ifcLoader = new IFCLoader()
            ifcLoader.requestHeader = {
                'Authorization': `Token ${props.token}`
            }
            ifcLoader.ifcManager.applyWebIfcConfig({
                COORDINATE_TO_ORIGIN: true
            }).then(
                () => {
                    ifcLoader.ifcManager.setWasmPath('../../wasm/')
                        .then(
                            () => {
                                const scene = new Scene();

                                ifcLoader.load(`${baseUrl}/api/model/ifc/${model_id}`, (
                                    (m) => {
                                        m.geometry.translate(0, 0, 0)
                                        scene.add(m)
                                    }
                                ))

//Object to store the size of the viewport
                                const size = {
                                    width: window.innerWidth,
                                    height: window.innerHeight,
                                };

//Creates the camera (point of view of the user)
                                const aspect = size.width / size.height;
                                const camera = new PerspectiveCamera(75, aspect);
                                camera.position.z = 15;
                                camera.position.y = 13;
                                camera.position.x = 8;

//Creates the lights of the scene
                                const lightColor = 0xffffff;

                                const ambientLight = new AmbientLight(lightColor, 0.5);
                                scene.add(ambientLight);

                                const directionalLight = new DirectionalLight(lightColor, 1);
                                directionalLight.position.set(0, 10, 0);
                                directionalLight.target.position.set(-5, 0, 0);
                                scene.add(directionalLight);
                                scene.add(directionalLight.target);

                                const renderer = new WebGLRenderer({
                                    canvas: threeCanvas,
                                    alpha: true,
                                });

                                renderer.setSize(size.width, size.height);
                                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Creates grids and axes in the scene
                                const grid = new GridHelper(50, 30);
                                scene.add(grid);

                                const axes = new AxesHelper();
                                (axes.material as Material).depthTest = false;
                                axes.renderOrder = 1;
                                scene.add(axes);

//Creates the orbit controls (to navigate the scene)
                                const controls = new OrbitControls(camera, threeCanvas);
                                controls.enableDamping = true;
                                controls.target.set(-2, 0, 0);

//Animation loop
                                const animate = () => {
                                    controls.update();
                                    renderer.render(scene, camera);
                                    requestAnimationFrame(animate);
                                };

                                animate();

//Adjust the viewport to the size of the browser
                                window.addEventListener("resize", () => {
                                    size.width = window.innerWidth;
                                    size.height = window.innerHeight;
                                    camera.aspect = size.width / size.height;
                                    camera.updateProjectionMatrix();
                                    renderer.setSize(size.width, size.height);
                                });
                            }
                        )
                }
            )
        }
    )

    if (model_id === null) {
        return <></>
    }

    return (
        <div id={`${model_id}-ifc-viewer`}>
            <canvas id={`${model_id}-ifc-viewer-canvas`}/>
        </div>
    )
}


export default connector(IfcViewer);
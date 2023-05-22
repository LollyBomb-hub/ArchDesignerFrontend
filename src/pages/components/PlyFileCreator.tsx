import React, {useRef, useState} from "react";
import {IRootState} from "../../store/store";
import {connect, ConnectedProps} from "react-redux";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Canvas, extend, ReactThreeFiber, useFrame, useThree} from "@react-three/fiber";
import {Button, Grid, Stack, Typography} from "@mui/material";
import {ContentState, Editor, EditorState} from 'draft-js';
import {ACESFilmicToneMapping, PCFSoftShadowMap} from "three";

interface IProps extends ReduxProps {

}

interface IState {
    currentPlyFile: string
    editorState: EditorState
}

const mapStateToProps = (state: IRootState) => {
    return {
        initialPlyFile: state.stageSlice.currentPlyFile
    }
}

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

// ply
// format ascii 1.0
// element vertex 4
// property float x
// property float y
// property float z
// element face 1
// property list uchar int vertex_index
// end_header
// 0 0 0
// 100 100 0
// 100 0 0
// 0 100 0
// 4 1 3 4 2

extend({OrbitControls})


declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<OrbitControls,
                typeof OrbitControls>;
        }
    }
}


function Controls() {
    const {
        camera,
        gl: {domElement}
    } = useThree();
    const controls = useRef<OrbitControls | null>(null);

    useFrame((state) => (controls?.current as any).update());
    return <orbitControls enableRotate={false} enableDamping={false} ref={controls} args={[camera, domElement]}/>;
}


const Ply = (props: { plyFile: string }) => {
    console.log("parsing:", props.plyFile)
    const loader = new PLYLoader()
    const geom = loader.parse(props.plyFile);
    console.log(geom)
    // This reference will give us direct access to the mesh
    const mesh = useRef<any>()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (mesh.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <Canvas orthographic camera={{}} style={{minHeight: "400px"}} onCreated={({gl}) => {
            gl.setPixelRatio(window.devicePixelRatio);
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = PCFSoftShadowMap;
            gl.toneMapping = ACESFilmicToneMapping;
        }}>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Controls/>
            <mesh
                ref={mesh}
                scale={active ? 1.5 : 1}
                onClick={(event) => setActive(!active)}
                onPointerOver={(event) => setHover(true)}
                geometry={geom}
                onPointerOut={(event) => setHover(false)}>
                <meshStandardMaterial color={'gray'}/>
            </mesh>
        </Canvas>
    )
}

class PlyFileCreator extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps> | IProps) {
        super(props);
        this.state = {
            currentPlyFile: props.initialPlyFile,
            editorState: EditorState.createWithContent(ContentState.createFromText(props.initialPlyFile, '\n'))
        }
    }

    onChange = (editorState: EditorState) => {
        let plainText = editorState.getCurrentContent().getPlainText('\n');
        this.setState(
            {
                editorState,
                currentPlyFile: plainText
            }
        )
    }

    render() {
        const height = window.innerHeight;
        return (
            <Grid container direction={"row"} style={{height: `${height - 100}px`}}>
                <Grid item flex={1} style={{
                    padding: '10px'
                }}>
                    <Stack direction={"column"}>
                        <Typography style={{height: '40px'}} variant={"h4"}>Редактор файла сетки этажа</Typography>
                        <div style={{height: `${height - 220}px`}}>
                            <Editor editorState={this.state.editorState} onChange={this.onChange}/>
                        </div>
                        <Stack direction={"row"}>
                            <Button>Добавить элемент</Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item flex={1} style={{
                    padding: '10px'
                }}>
                    <Stack direction={"column"}>
                        <Typography style={{height: '40px'}} variant={"h4"}>Превью</Typography>
                        <div style={{height: `${height - 220}px`}}>
                            <Ply plyFile={this.state.currentPlyFile}/>
                        </div>
                    </Stack>
                </Grid>
            </Grid>
        )
    }
}

export default connector(PlyFileCreator);
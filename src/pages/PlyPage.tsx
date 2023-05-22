import React from "react";
import PlyFileCreator from "./components/PlyFileCreator";

class PlyPage extends React.Component<any, any> {
    render() {
        return (
            <div style={{backgroundColor: "white"}}>
                <PlyFileCreator/>
            </div>
        )
    }
}

export default PlyPage;
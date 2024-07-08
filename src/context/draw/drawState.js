import drawContext from "./drawContext";

const drawState = (props) => {

    return(
        <drawContext.Provider>
            {props.children}
        </drawContext.Provider>
    )
}

export default drawState(); 
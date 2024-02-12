import { useState } from "react";
import ChildComponent from "./ChildComponent";
import { Button } from "@mui/material";

type State = {
    text: string,
    count: number,    
}

const ParentComponent = () => {
    const [state, setState] = useState<State>({
        text: '',
        count: 1,        
    });

    const handleClick = () => {
        setState({...state, count: state.count + 1});
    }

    const setText = (value: string) => {
        console.log('setText');
        
        console.log('new text', value);
        console.log('count', state.count);
        
        const newState = {
            ...state,             
            text: value            
        };
        
        setState(newState);        
    };
    
    return (
        <div>
            <div>
                <span>
                    Count: {state.count}
                </span>
                <Button onClick={handleClick} autoFocus>
                    OK
                </Button>
            </div>            
            <ChildComponent 
                text={state.text}
                setText={setText}
            />   
        </div>
    );
}

export default ParentComponent;
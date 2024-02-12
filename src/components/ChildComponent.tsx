import { TextField } from "@mui/material";

type ComponentProps = { 
    text: string,  
    setText(value: string): void;        
};  

const ChildComponent = ({text, setText}: ComponentProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {   
        setText(e.target.value);                                 
    };   

    return (
        <>
            <TextField 
                value={text} 
                onChange={handleChange}                          
                fullWidth                                 
                variant="standard"                 
            />  
        </>
    );
}

export default ChildComponent;
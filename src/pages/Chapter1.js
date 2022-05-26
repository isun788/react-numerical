import { React,  useState } from "react";
import './dec.css' ;
import { Button, Stack } from "@mui/material";
import Bisection from "../components/bisection";
import FalsePosition from "../components/falseposition";
import OnePoint from "../components/onepoint";
import NR from "../components/NR";

const Chapter1 = () => {
    
    const [method, setMethod] = useState("Bisection") ;

    const handleClick = (methodState) => {
        setMethod(methodState)
    }

    return(
        <div>
            <div>
            <h1>Chapter 1</h1>
            </div>
            <div>
                <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => handleClick('Bisection')}>Bisection</Button>
                <Button variant="contained" onClick={() => handleClick('False-position')}>False-Position</Button>
                <Button variant="contained" onClick={() => handleClick('OnePoint')}>One Point</Button>
                <Button variant="contained" onClick={() => handleClick('Newton-Raphson')}>Newton Raphson</Button>
                </Stack>
                <h1>{method}</h1>
            </div>
            <div>
                {(() => {
                    switch(method){
                        case 'Bisection' :
                            return <Bisection handleClick={handleClick}/>
                        case 'False-position' :
                            return <FalsePosition handleClick={handleClick}/>
                        case 'OnePoint' :
                            return <OnePoint handleClick={handleClick}/>
                        case 'Newton-Raphson' :
                            return <NR handleClick={handleClick}/>
                        default:
                            return null
                    }
                })()}
            </div>
        </div>
    )
}

export default Chapter1;
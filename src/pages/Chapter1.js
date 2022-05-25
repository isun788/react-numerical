import { React,  useState } from "react";
import './dec.css' ;
import { Link } from "react-router-dom";
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
            <h1>Chapter 1</h1>
            <br/>
            <ul>
                <li>
                    <Link to ="/">Chapter1</Link>
                </li>
                <li>
                    <Link to ="/chapter2">Chapter2</Link>
                </li>
            </ul>
            <div>
                <button onClick={() => handleClick('Bisection')}>Bisection</button>
                <button onClick={() => handleClick('False-position')}>False-Position</button>
                <button onClick={() => handleClick('OnePoint')}>One Point</button>
                <button onClick={() => handleClick('Newton-Raphson')}>Newton Raphson</button>
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
import { React, useState } from 'react' ;
import { Link } from 'react-router-dom' ;
import Gsiedel from '../components/gsiedel';
import Conjugate from '../components/conjugate';
import Jacobi from '../components/jacobi';
import Cramer from '../components/cramer';
import GEliminate from '../components/gausselim';
import GaussJordan from '../components/gaussjordan';

const Chapter2 = () => {

    const [method, setMethod] = useState("Gsiedel")

    const handleClick = (methodState) => {
        setMethod(methodState)
    }
    return(
        <div>
            <h1>Chapter2</h1>
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
                <button onClick={() => handleClick('Cramer')}>Cramer's Rule</button>
                <button onClick={() => handleClick('Gauss-Siedel')}>Gauss-Seidel</button>
                <button onClick={() => handleClick('Jacobi')}>Jacobi</button>
                <button onClick={() => handleClick('Conjugate')}>Conjugate</button>
                <button onClick={() => handleClick('GaussElimination')}>Gauss Elimination</button>
                <button onClick={() => handleClick('GaussJordan')}>Gauss Jordan</button>
                <h1>{method}</h1>
            </div>
            <div>
                {(() => {
                    switch(method){
                        case 'Cramer' :
                            return <Cramer handleClick={handleClick}/>
                        case 'GaussElimination' :
                            return <GEliminate handleClick={handleClick}/>
                        case 'GaussJordan' :
                            return <GaussJordan handleClick={handleClick}/>
                        case 'Gauss-Siedel' :
                            return <Gsiedel handleClick={handleClick} />
                        case 'Conjugate' :
                            return <Conjugate handleClick={handleClick} />
                        case 'Jacobi' :
                            return <Jacobi handleClick={handleClick} />
                        default:
                            return null
                    }
                })()}
            </div>
        </div>
    )
}
export default Chapter2
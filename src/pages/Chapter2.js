import { React, useState } from 'react' ;
import { Button, Stack } from "@mui/material";
import Gsiedel from '../components/gsiedel';
import Conjugate from '../components/conjugate';
import Jacobi from '../components/jacobi';
import Cramer from '../components/cramer';
import GEliminate from '../components/gausselim';
import GaussJordan from '../components/gaussjordan';

const Chapter2 = () => {

    const [method, setMethod] = useState("Cramer")

    const handleClick = (methodState) => {
        setMethod(methodState)
    }
    return(
        <div>
            <div>
            <h1>Chapter2</h1>
            </div>
            <div>
                <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => handleClick('Cramer')}>Cramer's Rule</Button>
                <Button variant="contained" onClick={() => handleClick('Gauss-Siedel')}>Gauss-Seidel</Button>
                <Button variant="contained" onClick={() => handleClick('Jacobi')}>Jacobi</Button>
                <Button variant="contained" onClick={() => handleClick('Conjugate')}>Conjugate</Button>
                <Button variant="contained" onClick={() => handleClick('GaussElimination')}>Gauss Elimination</Button>
                <Button variant="contained" onClick={() => handleClick('GaussJordan')}>Gauss Jordan</Button>
                </Stack>
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
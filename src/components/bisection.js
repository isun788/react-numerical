import axios from '../api/axios';
import React, {Component, useState, useEffect } from 'react' ;
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { equa, myError } from './function'
import { Select, FormControl, MenuItem, TextField, Button } from '@mui/material';

function Bisection(){
    const [equation, setEquation] = useState("custom") ;
    const [x1, setx1] = useState("") ;
    const [x2, setx2] = useState("") ;
    const [ans, setAns] = useState([{name: null, Answer: null}]) ;
    const [Error, setError] = useState([{name: null, Error: null}])
    const [problem, setProblem] = useState("") ;
    const [value, setValue] = useState([])
    const [toggleInput, setToggleInput] = useState(false)
    const AnsVal = []
    const ErrVal = []
    
    useEffect(() => {
        axios.get("/bisection")
        .then((response) => {
            console.log(response.data)
            setValue(response.data)
        })
    }, []) ;
    function calXm(xL, xR){
        return (xL+xR)/2 
    }
    function CalBisection(equation, xL, xR){
        let fxm, fxr, a, xOld
        let m = calXm(xL,xR)
        let myerror = 1
        const eps = 0.000001

        while((myerror>=eps) && (myerror !== Infinity)){
            m = calXm(xL,xR)
            fxm = equa(m, equation)
            fxr = equa(xR, equation)
            a = fxm * fxr
            if(a > 0){
                xOld = xR
                xR = m
                myerror = myError(xR, xOld)
            }else{
                xOld = xL
                xL = m
                myerror = myError(xL, xOld)
            }
            const newAns = {
                name : AnsVal.length,
                Answer: m.toFixed(6),
            }
            const newErr = {
                name: ErrVal.length,
                Error: myerror,
            }
            AnsVal.push(newAns)
            ErrVal.push(newErr)
        }
        console.log(AnsVal)
        console.log(ErrVal)
        setAns(AnsVal)
        setError(ErrVal)
    }
    const handleSubmit = (e) =>{
        e.preventDefault() ;
        // CalBisection(equation, x1, x2)
        if(toggleInput === false){
            CalBisection(problem, x1, x2)
        }else{
            CalBisection(equation, x1, x2)
        }
    }
    const handleEquation = (e) =>{
        setEquation(e.target.value)
        console.log(equation)
        if(e.target.value === "custom"){
            setToggleInput(false)
        }else{
            setToggleInput(true)
        }
    }
    const handleInput = (e) =>{
        setProblem(e.target.value)
        console.log(problem)
    }
    return(
        <div>
        <FormControl>
            <Select
                id='select-equation'
                label='equation'
                value={equation}
                onChange={handleEquation}>
                    { value ? value.map(item =>
                    <MenuItem value={item.problem}>{item.problem}</MenuItem>): null}
            </Select>
        </FormControl>

        <form onSubmit={handleSubmit}>
            
            <TextField 
                variant="outlined"
                label="Equation"
                type="text"
                onChange={handleInput}
                disabled={toggleInput}
                />
                <br/>
            
            <TextField 
                variant="outlined"
                label="Left X"
                type="text"
                onChange={e => setx1(e.target.value)}
                />
                <br/>
                
            <TextField 
                variant="outlined"
                label="Right X"
                type="text"
                onChange={e => setx2(e.target.value)}
                />
                <br/>
                
                <Button variant='outlined' type='submit'>Submit</Button>
                
        </form>
        <h2>คำตอบ</h2>
        <LineChart
            width={1000}
            height={300}
            data={ans}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
            type="monotone"
            dataKey="Answer"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
        />
        </LineChart>
        <h2>Error</h2>
        <LineChart
          width={1000}
          height={300}
          data={Error}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Error" stroke="red" activeDot={{ r: 8 }} />
        </LineChart>
 
        </div>
    )
}

export default Bisection
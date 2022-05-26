import React, {Component, useState, useEffect } from 'react' ;
import { equa, myError } from './function'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as math from 'mathjs';
import { Select, FormControl, MenuItem, TextField, Button } from '@mui/material';
import axios from '../api/axios';

function NR(){
    const [equation, setEquation] = useState("custom") ;
    const [x1, setx1] = useState("") ;   
    const [ans, setAns] = useState([{name: null, Answer: null}]) ;
    const [Error, setError] = useState([{name: null, Error: null}])
    const [problem, setProblem] = useState("") ;
    const [value, setValue] = useState([])
    const [toggleInput, setToggleInput] = useState(false)
    const ErrVal = []
    const AnsVal = []

    useEffect(() => {
        axios.get("/NewtonRaphson")
        .then((response) => {
            console.log(response.data)
            setValue(response.data)
        })
    }, []) ;
    function CalNR(equation, x1){
        let xOld = parseFloat(x1)
        let xNew = 0
        let temp = 0
        let eps = 0.000001
        let myerror = 1
    
        console.log(xOld)
        while((myerror >= eps && myerror !== Infinity)){
            temp = -equa(xOld, equation) / equa(xOld ,math.derivative(equation, 'x').toString())
            console.log(temp)
            xNew = xOld + temp
            console.log(xNew)
            myerror = myError(xNew, xOld)
            xOld = xNew
            console.log(myerror)
            const newErr = {
                name: ErrVal.length,
                Error: myerror,
            }
            const newAns = {
                name : AnsVal.length,
                Answer: xNew,
            }
            AnsVal.push(newAns)
            ErrVal.push(newErr)
        }

        setError(ErrVal)
        setAns(AnsVal)
    }
    const handleSubmit = (e) =>{
        e.preventDefault() ;
        
        if(toggleInput === false){
            CalNR(problem, x1)
        }else{
            CalNR(equation, x1)
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
                        { value.map( item =>
                        <MenuItem value={item.problem}>{item.problem}</MenuItem>
                        )}
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
                label="Start"
                type="text"
                onChange={e => setx1(e.target.value)}
                />
                <br/>

                <Button variant='outlined' type='submit'>Submit</Button>
        </form>
        <h1>คำตอบ</h1>
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
export default NR
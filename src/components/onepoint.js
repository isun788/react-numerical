import React, {Component, useState, useEffect } from 'react' ;
import { equa, myError } from './function'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, FormControl, MenuItem, TextField, Button } from '@mui/material';
import axios from '../api/axios';

let token = {}
const login = async () => {
    await axios.post('/login', {
        email: "s6204062616031@email.kmutnb.ac.th",
        password: "sunday44"
    }).then((res) => {
        token = res.data
        sessionStorage.setItem('token', JSON.stringify(token));
        console.log(token)
    })
}
login()

function OnePoint(){
    const [equation, setEquation] = useState("custom") ;
    const [x1, setx1] = useState("") ;
    const [ans, setAns] = useState([{name: null, Answer: null}]) ;
    const [Error, setError] = useState([{name: null, Error: null}])
    const [problem, setProblem] = useState("") ;
    const [value, setValue] = useState([])
    const [toggleInput, setToggleInput] = useState(false)
    const AnsVal = []
    const ErrVal = []

    useEffect(() => {
        axios.get("onepoint",{
            headers:{
                "Authorization": `Bearer ${token.accessToken}`
            }
        })
        .then((response) => {
            console.log(response.data)
            setValue(response.data)
        })
    }, []) ;

    function CalOne(equation, x){
        let xOld
        let eps = 0.000001
        let myerror = 100
        while((myerror >= eps) && (myerror !== Infinity)){
            xOld = x
            x = equa(x, equation)
            myerror = myError(x, xOld)

            const newAns = {
                name : AnsVal.length,
                Answer: x.toFixed(6),
            }
            const newErr = {
                name: ErrVal.length,
                Error: myerror,
            }
            AnsVal.push(newAns)
            ErrVal.push(newErr)
        }
        setAns(AnsVal)
        setError(ErrVal)
    }
    const handleSubmit = (e) =>{
        e.preventDefault() ;
        
        if(toggleInput === false){
            CalOne(problem, x1)
        }else{
            CalOne(equation, x1)
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
export default OnePoint ;
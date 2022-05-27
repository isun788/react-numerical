import axios from '../api/axios';
import { showMatrix } from './function';
import React, {Component, useState, useEffect } from 'react' ;
import * as math from 'mathjs'
import { Select, FormControl, MenuItem, TextField, Button } from '@mui/material';
import { MathJax, MathJaxContext }from 'better-react-mathjax'

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

function Conjugate(){
    const [matrixSize, setMatrixSize] = useState({rows: 0, columns: 0})
    const [matrixA, setMatrixA] = useState([])
    const [matrixB, setMatrixB] = useState([])
    const [ans, setAnswer] = useState([])
    const [problem, setProblem] = useState("custom") ;
    const [value, setValue] = useState([])
    const [toggleInput, setToggleInput] = useState(false)

    useEffect(() => {
      axios.get("/conjugate",{
        headers:{
            "Authorization": `Bearer ${token.accessToken}`
        }
    })
      .then((response) => {
          console.log(response.data)
          setValue(response.data)
      })
  }, []) ;

    const handleChangeA = (e) => {
      let temp = []
      if(typeof(matrixA) === 'string'){
        temp = JSON.parse(matrixA)
      }else{
        temp = JSON.parse(JSON.stringify(matrixA))
      }
      if(temp.length < 2) {
        temp = []
        for(let rows = 0 ; rows < parseInt(matrixSize.rows) ; rows++){
          temp.push(new Array(parseInt(matrixSize.columns)).fill(0))
        }
      }
      let size = (e.target.id).split("")
      let row = parseInt(size[0])
      let column = parseInt(size[1])
      temp[row][column] = +e.target.value
      console.log(temp)
      setMatrixA(JSON.stringify(temp)) 
    }

    const handleChangeB = (e) => {
      let temp = []
      if(typeof(matrixB) === 'string'){
        temp = JSON.parse(matrixB)
      }else{
        temp = JSON.parse(JSON.stringify(matrixB))
      }
      if(temp.length < 2) {
        temp = []
        for(let rows = 0 ; rows < parseInt(matrixSize.rows) ; rows++){
          temp.push(new Array(parseInt(matrixSize.rows)).fill(0))
        }
      }
      let size = e.target.id
      let row = parseInt(size[0])
      temp[row] = +e.target.value
      console.log(temp)
      setMatrixB(JSON.stringify(temp)) 
    }
        
    const MatrixAInput = (matrixSize) => {
        var MatA = [] ; 
        for(let rowIndex = 0 ; rowIndex < matrixSize.rows ; rowIndex++){
          for(let columnIndex = 0 ; columnIndex < matrixSize.columns ; columnIndex++){
            MatA.push(<input id={rowIndex + "" + columnIndex} type='text' onChange={handleChangeA} />)
          }
          MatA.push(<br/>)
        }
        return MatA
      }
  
      const MatrixBInput = (matrixSize) => {
        var MatB = [] ; 
        for(let rowIndex = 0 ; rowIndex < matrixSize.rows ; rowIndex++){
          MatB.push(<input id={rowIndex} type='text' onChange={handleChangeB} />)
          MatB.push(<br/>)
        }
        return MatB
      }

    const handleSubmit = (e) =>{
      e.preventDefault()
      calConjugate(matrixA, matrixB)
    }

    const handleProblem = (e) =>{
      setProblem(e.target.value)

      if(e.target.value === "custom"){
          setToggleInput(false)
      }else{
          setMatrixA(value[e.target.value-1].A)
          setMatrixB(value[e.target.value-1].B)
          setToggleInput(true)
      }
  }


    function calConjugate(matrixA, matrixB){
        let newA = math.matrix(JSON.parse(matrixA))
        let newB = math.matrix(JSON.parse(matrixB))
        let X = math.zeros(math.size(newB))
        let R = math.subtract(math.multiply(newA, X), newB)
        let D = math.multiply(R, -1)
        let eps = 0.000001
        let round = 0

        while(true && round < 1000){
            let lambda = math.divide(
                        math.multiply(math.multiply(math.transpose(D), -1), R),
                        math.multiply(math.transpose(D), math.multiply(newA, D))
                        )
            let newX = math.add(X, math.multiply(lambda, D))
            let newR = math.subtract(math.multiply(newA, newX), newB)
            let error = math.sqrt(math.multiply(math.transpose(newR), newR))
            let alpha = math.divide(
                        math.multiply(math.transpose(newR), math.multiply(newA, D)),
                        math.multiply(math.transpose(D), math.multiply(newA, D))
            )
            let newD = math.add(math.multiply(newR, -1), math.multiply(alpha, D))
            console.log(round)
            console.log("x = [" + X.valueOf().toString())
            console.log("R = [" + R.valueOf().toString())
            console.log("D = [" + D.valueOf().toString())
            console.log("lambda ="  + lambda.valueOf().toString())
            console.log("alpha ="  + alpha.valueOf().toString())
            console.log("error ="  + error.valueOf().toString())
            if(error.valueOf() < eps){
                console.log(newX);
                console.log(typeof(newX))
                newX = newX.map(item => Number(item))
                setAnswer(newX)
                break
            }
            X = newX
            R = newR
            D = newD
            round++
        }
    }

    return(
        <div>
          <FormControl>
            <Select
                id='select-equation'
                label='equation'
                value={problem}
                onChange={handleProblem}>
                  <MenuItem value="custom">Custom</MenuItem>
                    { value ? value.map(item =>
                    <MenuItem value={item.id}>
                      <MathJaxContext>
                        Matrix A:{showMatrix(item.A)} Matrix B:{showMatrix(item.B)}
                      </MathJaxContext>
                      </MenuItem>): null}
            </Select>
          </FormControl>
          <form onSubmit={handleSubmit}>
            <label>rows</label>
            <TextField
              variant="outlined"
              label="rows"
              type="text"
              onChange={(e) => setMatrixSize({...matrixSize, rows: e.target.value})}
              disabled={toggleInput}/>

            <label>columns</label>
            <TextField
              variant="outlined"
              label="columns"
              type="text"
              onChange={(e) => setMatrixSize({...matrixSize, columns: e.target.value})}
              disabled={toggleInput}/>
            <br/>
            <label>MatrixA</label>
            <div>
            {MatrixAInput(matrixSize)}
            </div>
            <label>MatrixB</label>
            <div>
            {MatrixBInput(matrixSize)}
            </div>
            <Button variant='outlined' type='submit'>Submit</Button>
            </form>
            <div>
            <h2>Matrix A</h2>
              <MathJaxContext>
                {showMatrix(matrixA)}
              </MathJaxContext>
              <h2>Matrix B</h2>
              <MathJaxContext>
                {showMatrix(matrixB)}
              </MathJaxContext>
              <h2>Answer</h2>
              <MathJaxContext>
                <MathJax dynamic>
              {"\\(" +
                        math.parse(ans.toString().replace(/\r/g, "")).toTex({
                            parenthesis: "keep",
                            implicit: "show",
                        }) +
                        "\\)"}
                </MathJax>
              </MathJaxContext>
            </div>
        </div>
    )
}
export default Conjugate
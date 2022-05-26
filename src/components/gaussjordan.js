import axios from 'axios';
import { showMatrix } from './function';
import React, {Component, useState, useEffect } from 'react' ;
import * as math from 'mathjs'
import { Select, FormControl, MenuItem, TextField, Button } from '@mui/material';
import { MathJax, MathJaxContext }from 'better-react-mathjax'

function GaussJordan(){
    const [matrixSize, setMatrixSize] = useState({rows: 0, columns: 0})
    const [matrixA, setMatrixA] = useState([])
    const [matrixB, setMatrixB] = useState([])
    const [ans, setAnswer] = useState([])
    const [problem, setProblem] = useState("custom") ;
    const [value, setValue] = useState([])
    const [toggleInput, setToggleInput] = useState(false)

    useEffect(() => {
      axios.get("http://localhost:3006/gaussjordan")
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
     calGaussJordan(matrixA, matrixB)
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

    function calGaussJordan(matrixA, matrixB){
        let newA = JSON.parse(matrixA)
        let newB = JSON.parse(matrixB)
        let X = Array(newA.length).fill(0)
        var i, k, j

        for(i = 0 ; i < newA.length ; i++){
            newA[i].push(newB[i])
        }
        var n = newA.length

        for(i = 0 ; i < n ; i++){
            for(j = 0 ; j < n ; j++){
                if(i !== j){
                let temp = newA[j][i] / newA[i][i]
                console.log(temp)
                    for(k = 0 ; k < n + 1 ; k++){
                    newA[j][k] = newA[j][k] - temp * newA[i][k]
                    }
                }
            }
        }
        for(i = 0 ; i < n ; i++){
            X[i] = parseFloat((newA[i][n] / newA[i][i]).toFixed(0))
        }
        console.log(X)
        setAnswer(JSON.stringify(X))
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
export default GaussJordan
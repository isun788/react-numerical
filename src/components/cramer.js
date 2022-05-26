import axios from '../api/axios';
import { showMatrix } from './function';
import React, {Component, useState, useEffect } from 'react' ;
import * as math from 'mathjs'
import { Select, FormControl, MenuItem, TextField, Button } from '@mui/material';
import { MathJax, MathJaxContext }from 'better-react-mathjax'

function Cramer(){
    const [matrixSize, setMatrixSize] = useState({rows: 0, columns: 0})
    const [matrixA, setMatrixA] = useState([])
    const [matrixB, setMatrixB] = useState([])
    const [ans, setAnswer] = useState([])
    const [problem, setProblem] = useState("custom") ;
    const [value, setValue] = useState([])
    const [toggleInput, setToggleInput] = useState(false)

    useEffect(() => {
      axios.get("/cramer")
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
      calCramer(matrixA, matrixB)
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

    function calCramer(matrixA, matrixB){
        let newA = JSON.parse(matrixA)
        let newB = JSON.parse(matrixB)
        let newX = Array(newA.length).fill(0)

        for(let i = 0 ; i < newA.length ; i++){
            let tempA = JSON.parse(matrixA)
            console.log(tempA)
            for(let j = 0 ; j < newA.length ; j++){
                tempA[j][i] = newB[j]
            }
            newX[i] = parseFloat(((math.det(math.matrix(tempA))) / (math.det(math.matrix(newA)))).toFixed(0))
        }
        console.log(newX)
        setAnswer(JSON.stringify(newX))
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
            <label>Input MatrixA</label>
            <div>
            {MatrixAInput(matrixSize)}
            </div>
            <label>Input MatrixB</label>
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
export default Cramer
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

function Jacobi() {
    const [matrixSize, setMatrixSize] = useState({rows: 0, columns: 0})
    const [matrixA, setMatrixA] = useState([])
    const [matrixB, setMatrixB] = useState([])
    const [ans, setAnswer] = useState([])
    const [problem, setProblem] = useState("custom") ;
    const [value, setValue] = useState([])
    const [toggleInput, setToggleInput] = useState(false)

    useEffect(() => {
      axios.get("/gausssiedel",{
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
      calJacobi(matrixA, matrixB)
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

    function calJacobi(){
        const eps = 0.000001
        let round = 0
        let temp = []
        let check = 0
        let newA = JSON.parse(matrixA)
        let newB = JSON.parse(matrixB)
        let error = Array(newA.length).fill(1)
        let new_x = Array(newA.length).fill(0)
        let old_x = Array(newA.length).fill(0)

        while(round < 1000){
            check = 0
            for(let i = 0 ; i < newA.length ; i++){
                temp[i] = newB[i]
                old_x[i] = new_x[i]
                for(let j = 0 ; j < newA[0].length ; j++){
                    if(i !== j){
                        temp[i] = temp[i] - (newA[i][j] * new_x[j])
                    }
                }
            }
            for(let i = 0 ; i < newA.length ; i++){
                new_x[i] = parseFloat((temp[i]/newA[i][i]).toFixed(6))
            }
            for(let i = 0 ; i < error.length ; i++){
                error[i] = Math.abs((new_x[i] - old_x[i]) / new_x[i]).toFixed(6)
            }
            old_x = JSON.parse(JSON.stringify(new_x))
            console.log(old_x)
            console.log(error)
            console.log(round)
            for(let i = 0 ; i < error.length ; i++){
                if(error[i] <= eps){
              check++
                }
             }
            if(check === error.length){
                setAnswer(JSON.stringify(old_x))
                //console.log(old_x)
                break
            }else{
                check = 0
            }
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
export default Jacobi
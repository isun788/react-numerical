import axios from 'axios';
import React, {Component, useState, useEffect } from 'react' ;
import * as math from 'mathjs'
import { Select, FormControl, MenuItem, TextField, Button } from '@mui/material';

function Cramer(){
    const [matrixSize, setMatrixSize] = useState({rows: 0, columns: 0})
    const [matrixA, setMatrixA] = useState([])
    const [matrixB, setMatrixB] = useState([])
    const [ans, setAnswer] = useState([])

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
            newX[i] =  ((math.det(tempA)) / (math.det(newA))).toFixed(0)
        }
        console.log(newX)
        setAnswer(newX)
    }

    return(
        <div>
          <form onSubmit={handleSubmit}>
            <label>rows</label>
            <input 
            type="number"
            onChange={(e) => setMatrixSize({...matrixSize, rows: e.target.value})}/>
            <label>columns</label>
            <input
            type="number"
            onChange={(e) => setMatrixSize({ ...matrixSize, columns: e.target.value })}/>
            <br/>
            <label>MatrixA</label>
            <div>
            {MatrixAInput(matrixSize)}
            </div>
            <label>MatrixB</label>
            <div>
            {MatrixBInput(matrixSize)}
            </div>
            <input type="submit"/>
            </form>
            <div>
            </div>
            {ans}
        </div>
    )

}
export default Cramer
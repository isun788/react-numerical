import React, { useState } from 'react'

function Gsiedel(){
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

    const handleSubmit = (e) =>{
      e.preventDefault()
      calGaussSiedel(matrixA, matrixB)
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

    function calGaussSiedel(matrixA, matrixB){
      const eps = 0.000001
      let round = 0
      let temp = []
      let check = 0
      let newA = JSON.parse(matrixA)
      let newB = JSON.parse(matrixB)
      let error = Array(newA.length).fill(1)
      let new_x = Array(newA.length).fill(0)
      let old_x = Array(newA.length).fill(0)
      console.log(error)

        while(round < 1000){
          check = 0
          for(let i = 0 ; i < newA.length ; i++){
            new_x[i] = newB[i]
            for(let j = 0 ; j < newA[0].length ; j++){
              if(i !== j){
                new_x[i] = new_x[i] - (newA[i][j] * old_x[j])
              }else if(i === j){
                temp = newA[i][j]
              }
            }
            new_x[i] = (new_x[i]/temp).toFixed(6)
          }
          console.log(new_x)
          round++
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
            setAnswer(old_x)
            //console.log(old_x)
            break
          }else{
            check = 0
          }
        }
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
            {ans}
        </div>
    )
}
export default Gsiedel
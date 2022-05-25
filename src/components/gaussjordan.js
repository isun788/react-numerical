import React, { useState } from 'react'

function GaussJordan(){
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
     calGaussJordan(matrixA, matrixB)
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
        setAnswer(X)
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
export default GaussJordan
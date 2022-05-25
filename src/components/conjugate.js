import React, { useState } from 'react'
import * as math from 'mathjs'

function Conjugate(){
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
      calConjugate(matrixA, matrixB)
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
            console.log("x = [" + X.valueOf().toString() + "]")
            console.log("R = [" + R.valueOf().toString() + "]")
            console.log("D = [" + D.valueOf().toString() + "]")
            console.log("lambda ="  + lambda.valueOf().toString())
            console.log("alpha ="  + alpha.valueOf().toString())
            console.log("error ="  + error.valueOf().toString())
            if(error.valueOf() < eps){
                console.log(newX);
                console.log(typeof(newX))
                const result = Object.values(newX)
                console.log(result)
                console.log(typeof(result))
                setAnswer(result)
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
export default Conjugate
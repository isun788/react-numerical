import { parse } from 'mathjs'

export function equa(x, equation){
    try {
        let equa = parse(equation)
        //console.log("Equation : " + equa)
        return equa.evaluate({x:x})
    } catch (error) {
        console.log("Error :" + error)
    }
}
export function myError(xNew, xOld){

    const error = Math.abs((xNew-xOld)/xNew)
    // console.log("Error Value:" + error)

    return error.toFixed(6)
}

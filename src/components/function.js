import { parse } from 'mathjs'
import * as math from 'mathjs'
import { MathJax } from 'better-react-mathjax'

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
export const showMatrix = (matrix) => {
    console.log(matrix)
    try {
        return (
            <MathJax dynamic inline data-testid="matrix-test">
                {"\\(" +
                    math.parse(matrix.toString().replace(/\*/g, "")).toTex({
                        parenthesis: "keep",
                        implicit: "show",
                    }) +
                    "\\)"}
            </MathJax>
        );
    } catch (e) {
        return <MathJax dynamic>{e.toString()}</MathJax>;
    }
};
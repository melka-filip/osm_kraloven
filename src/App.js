import React, { useEffect } from 'react';
import './App.css';
import { FaChessQueen, FaStepBackward } from 'react-icons/fa';
import { VscDebugRestart } from 'react-icons/vsc';
import { MdCelebration } from 'react-icons/md';
import { GoPrimitiveDot } from 'react-icons/go';
import { useState } from 'react';

function App() {
  const [board, setBoard] = useState([
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ])
  const [positions, setPositions] = useState([])
  const [solutions, setSolutions] = useState([])
  const [showSolutions, setShowSolutions] = useState(false)

  useEffect(() => {
    findSolutions([])
  }, [])

  const newQueen = (arr, y, x) => {
    arr.map((row, indexRow) => {
      row.map((cell, indexCell) => {

        if(cell===0){
          if(indexRow===y && indexCell===x){
            arr[indexRow][indexCell] = 1
          }
          else if(indexRow===y || indexCell===x || Math.abs(indexRow-y)===Math.abs(indexCell-x)){
            arr[indexRow][indexCell] = 2
          }
        }
      })
    })

    return arr
  }

  const stepBack = () => {
    let p = positions
    p.pop()
    setPositions(p)
    let b = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ]
    for(let i=0; i<p.length; i++){
      b = newQueen(b, positions[i][0], positions[i][1])
    }
    setBoard(b)
    findSolutions(p)
  }

  const permutator = (inputArr) => {
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
  }

  const validFormation = (arr) => {
    for(let i=0; i<7; i++){
      for(let o=i+1; o<8; o++){
        if(Math.abs(arr[i]-arr[o])===Math.abs(i-o)){
          return false
        }
      }
    }
    return true
  }

  const findSolutions = (pos) => {
    let exclude = pos.map(p => p[0])
    let permutations = permutator([0,1,2,3,4,5,6,7].filter(x => !exclude.includes(x)))
    let sol = []
    for(let i = 0; i < permutations.length; i++){
      let p = [-1,-1,-1,-1,-1,-1,-1,-1]

      for(let j = 0; j < pos.length; j++){
        p[pos[j][1]] = pos[j][0]
      }

      let index = 0;
      for(let k = 0; k < 8; k++){
        if(p[k]===-1){
          p[k] = permutations[i][index]
          index += 1
        }
      }

      if(validFormation(p)){
        sol.push(p)
      }
    }

    setSolutions(sol)
  }

  const restart = () => {
    setBoard([
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ])
    setPositions([])
    findSolutions([])
  }
  return (
    <div className="App">
      <h1>Osm Královen <FaChessQueen /></h1>
      <p>Umisťte osm královen tak, aby se navzájem neohrožovaly</p>

      <div className="container">
        <div className="chessboard">
          {
            board.map((row, indexRow) => <div className="row" key={indexRow}>
              {
                row.map((cell, indexCell) => (
                  <button 
                    className="cell" 
                    style={(indexRow%2 + indexCell%2)%2 === 1 ? {background: "rgba(0, 0, 0, 0.8)", color: "white"} : {background: "white", color: "black"} }
                    key={indexCell}
                    disabled={cell!==0}
                    onClick={() => { 
                      let b = newQueen([...board], indexRow, indexCell)
                      let p = positions
                      p.push([indexRow, indexCell])
                      setBoard(b)
                      setPositions(p)
                      findSolutions(p)
                      /* setStep(1) */
                    }}
                  >
                    {cell === 1 ? <FaChessQueen fontSize={"2.5rem"}  /> : cell === 2 ? <GoPrimitiveDot fontSize={"1rem"}  /> : ""}
                  </button>
                ))
              }
            </div>)
          }
        </div>
      </div>

      <div className="instructions">
        {positions.length === 0 && <div>Položte první královnu</div>}
        {positions.length > 0 && positions.length < 8 && 
          <>
            <button onClick={() => stepBack()}><FaStepBackward /></button>
            <button onClick={() => restart()}><VscDebugRestart /></button>
          </>
        }
        {positions.length === 8 && <button onClick={() => restart()}>Opakovat <MdCelebration /></button>}
      </div>

      <button className="show" onClick={() => setShowSolutions(!showSolutions)}>{showSolutions ? "Skrýt řešení" : "Ukázat řešení"}</button>

      {showSolutions && <h3 className="info">Počet možných řešení: <span style={{color: `${solutions.length > 0 ? "var(--primary)" : "red"}`}}>{solutions.length}</span></h3>}
      {showSolutions && <div className="solutions">
        {
          solutions.map((sol, index) => (
            <div className="chessboard" key={index}>
              {
                [0,1,2,3,4,5,6,7].map(row => (
                  <div className="row" key={row}>
                    {
                      [0,1,2,3,4,5,6,7].map(cell => (
                        <div 
                          className="cell" 
                          style={(row%2 + cell%2)%2 === 1 ? {background: "rgba(0, 0, 0, 0.8)", color: "white"} : {background: "white", color: "black"} }
                          key={cell}
                        >
                          {
                            sol[cell] === row ? <FaChessQueen fontSize={"2rem"}/> : ""
                          }
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>}

    </div>
  );
}

export default App;
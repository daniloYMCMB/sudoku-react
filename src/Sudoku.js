import React, { Component } from 'react';
import Board from './Board';
import puzzles from './Puzzles';
import './Sudoku.css';

export default class Sudoku extends Component {

  //constructor que incializar el 
  //formato del puzzle
  //un historial para guardar los numeros que ingresa el usuario
  //y un set de conflictos - creo que para validar
  constructor(props) {
    super(props);

    this.state = {
            //este estado del tablero llama a una funcion que
            //lee el array de objetos de numeros y los formatea 9x9
            boardState : this.getFormattedPuzzle(),
            //historial del usuario, numeros que ingrese se guardan en esta array
            history   : [],
            //CREO - que es para la validacion del boton verify
            conflicts : new Set([])  
          };
  }

  getFormattedPuzzle = () => {
    const puzzle = this.getRandomPuzzle();
    //console.log(puzzle)
    const formattedPuzzle = this.formatPuzzle(puzzle);
    //console.log(formattedPuzzle)
    return formattedPuzzle;
  }

  getRandomPuzzle = () => {
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  }

  formatPuzzle = (puzzle) => {
    //aqui enviamos a createArray 9 y que luego imprima 9 veces 9
    const formattedPuzzle = createArray(9, 9);
    for(let i=0; i<puzzle.length; i++) {
      const rowId = this.getRowId(i);
      const colId = this.getColId(i);

      const editable = puzzle[i] === '0' ? true : false;
      //console.log(editable)
      //console.log(rowId, colId)
      //console.log(puzzle[i])

      formattedPuzzle[rowId][colId] = {
                                        cellValue : puzzle[i],
                                        cellId    : this.stringify(rowId, colId),

                                        editable  : editable
                                      };
    }
    return formattedPuzzle;
  }

  getRowId = (i) => {
    return Math.floor(i/9);
  }

  getColId = (i) => {
    return (i%9);
  }

  getDeepCopyOfArray = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  }

  handleSquareValueChange = (i, j, newValue) => {

    //como voy a cambiar los datos solo uso el setState
    this.setState(prevState => {
      //nuevo board manipulado
      const newBoardState = this.getDeepCopyOfArray(prevState.boardState);
      //el formattedPuzzle[rowId][colId] tiene la propiedad editable a esa se refiere
      const prevEditable = prevState.boardState[i][j].editable;
      newBoardState[i][j] = {
        cellValue : newValue,
        cellId    : this.stringify(i, j),
        editable  : prevEditable
      };

      // Obtengo al history y le pusheo el nuevo boardState que eh manipulado
      const newHistory = this.getDeepCopyOfArray(prevState.history);
      newHistory.push(prevState.boardState);

      return {boardState: newBoardState, history: newHistory,conflicts : new Set([])};
    });
  }

  handleNewGameClick = () => {
    this.setState({
      boardState: this.getFormattedPuzzle(),
      history   : [],
      conflicts : new Set([])
    });
  }

  handleVerifyClick = () => {
    const boardState = this.state.boardState;

    const rows = {};
    const cols = {};
    const boxes = {};

    for(let i=0; i<boardState.length; i++) {
      rows[i] = this.getDeepCopyOfArray(boardState[i]);
      console.log(rows[i])
      for(let j=0; j<boardState[i].length;j++) {
        if(cols.hasOwnProperty(j)) {
          //compara si el valor ya lo tiene false, si lo tiene true y es un aviso de que se repite
          cols[j].push(boardState[i][j]);
          //console.log(boardState[i][j])
        } else {
          //si el board no tiene un nuevo numero lo deja igual
          cols[j] = [boardState[i][j]];
        }

        const boxId = this.stringify(Math.floor(i/3), Math.floor(j/3));
        if(boxes.hasOwnProperty(boxId)) {
          boxes[boxId].push(boardState[i][j]);
        } else {
          boxes[boxId] = [boardState[i][j]];
        }
      }
    }

    //Object.values(rows) = devuelve los valores de rows
    const rowConflicts = this.flatten(this.getConflicts(Object.values(rows)));
    console.log(rows)
    const colConflicts = this.flatten(this.getConflicts(Object.values(cols)));
    const boxConflicts = this.flatten(this.getConflicts(Object.values(boxes)));

    const mergedConflicts = [...rowConflicts, ...colConflicts, ...boxConflicts];
    this.setState({conflicts: new Set(mergedConflicts)});
  }

  flatten = (a) => {
    return Array.isArray(a) ? [].concat(...a.map(this.flatten)) : a;
  }

  getConflicts = (arrs) => {
    return (arrs
            .map(arr => this.getConflictsInArray(arr)));
  }

  getConflictsInArray = (arr) => {
    const conflictMap = {};
    console.log(arr.length)
    for(let i=0; i<arr.length; i++) {
      let curr = arr[i];
      if(curr.cellValue !== "0") {
        if(conflictMap.hasOwnProperty(curr.cellValue)) {
          conflictMap[curr.cellValue].push(curr.cellId);
        } else {
          conflictMap[curr.cellValue] = [curr.cellId];
        }        
      }
      //confilctMaps - [{9 2 4 5 6}
      //confilctMaps - {9 2 4 5 6}
      //confilctMaps - {9 2 4 5 6}
      //confilctMaps - {9 2 4 5 6}]
    }
    return Object.values(conflictMap).filter(arr => arr.length>1); 
  }

  stringify = (num1, num2) => {
    return num1 + '' + num2;
  }

  render() {
    return (
      <div className = "Sudoku">
        <h1 className="sudokuHeader">Sudoku!</h1>
        <Board
          boardState          = {this.state.boardState}
          conflicts           = {this.state.conflicts}
          onNewGameClick      = {this.handleNewGameClick}
          onSquareValueChange = {this.handleSquareValueChange}
          historyLength       = {this.state.history.length}
          onUndoClick         = {this.handleUndoClick}
          onVerifyClick       = {this.handleVerifyClick}
        />
      </div>
    );
  }
}

//CREAR FORMATO DE 9 boards y 9 elementos dentro de c/u
function createArray(length) {
    //un Array(9 board y 9 elemento dentro de c/u o 0)
    var arr = new Array(length || 0),
        i = length;

    //console.log(`lenght ${length}`)
    //console.log(arr) // 9 x 9 BOARD TOTAL
    //console.log(arguments) //9, 9

    //if (2 > 1)
    if (arguments.length > 1) {
        //traete los argumentos y cortalos 1 x 1 
        //entonces 9, 9
        var args = Array.prototype.slice.call(arguments, 1);
        //console.log(args) // = 9

        while(i--) //8 //7 //6 .. // 0
          //8 - 8 = 0 -> array posicion 0 = 9 elementos
          //8 - 7 = 1 -> array posicion 1 = 9 elementos
          //8 - 6 = 2 -> array posicion 2 = 9 elementos
          //8 - 0 = 8 -> array posicion 8 = 9 elementos
          arr[length-1 - i] = 

          //apply = this function, args = 9
          createArray.apply(this, args);
          //console.log(i)

    }

    return arr;
}

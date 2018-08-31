import React, { Component } from 'react';
import './Buttons.css'

export default class SudokuButtons extends Component {
	render() {
    	const btnStyle = {paddingTop: 25, marginLeft: 18, marginRight: 10};
		return (
			<div className = "SudokuButtons">
			 <a
		       className = "gameControlBtn"
		       color     = "primary"
		       variant   = "raised"
		       style     = {btnStyle}
		       onClick   = {this.props.onVerifyClick}>
		       Verify
		      </a>

		      <a
		       className = "gameControlBtn gameControlBtn2"
		       color     = "primary"
		       variant   = "raised"
		       style     = {btnStyle}
		       onClick   = {this.props.onNewGameClick}>
		       New game!
		       </a>
		    </div>
			);
	}
}

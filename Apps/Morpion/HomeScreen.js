import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
	View,
	Text,
  	Button,
  	TextInput,
  	StyleSheet,
} from 'react-native';

class HomeScreen extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	name: null, //Nom du joueur au lancement
	  };

	  this.handleChangeText = this.handleChangeText.bind(this);
	}
	handleChangeText(text){ //Fonction changeant le nom du joueur une fois celui ci écrit dans l'input text
		this.setState({
			name: text,
		}); }
	static navigationOptions = {
    	title: 'Bienvenue',
  	};

  
  	
  	render() {
		const { navigate } = this.props.navigation;
    	return(
    		<View style={ styles.wrapper }>
    			<Text style={{ marginBottom: 10 }}>Ecrivez votre nom</Text>
    			<TextInput
    				style={ styles.input }
    				onChangeText={ (text) => this.handleChangeText(text) }  //Rentrer le nom du joueur + Style 
    			/>
				<Button title="Commencer le jeu" onPress={ () => navigate("Game", { name: this.state.name }) } //Envoi sur la page "Game" + Envoi du nom du joueur
				/>  
			
    		</View>
    	)
  	}
}


const styles = StyleSheet.create({ //Style de la homescreen
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
  	padding: 10,
  	marginLeft: 20,
  	marginRight: 20,
  	borderWidth: 1,
  	borderColor: "gray",
  	height: 50,
  	zIndex: 2
  }
});

module.exports = HomeScreen;
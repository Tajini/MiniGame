import React, { Component } from 'react';
import {
	View,
	Text,
  	Button,

} from 'react-native';
class HomeApp extends React.Component {
    static navigationOptions = {
    	title: 'Bienvenue dans Mini-App',
  	};
render() {
    const  { navigate } = this.props.navigation;
    return(
        <View >
            <Text>Selectionnez votre jeu ! </Text>           
            <Button title="Flappy Bird !" onPress={ () => navigate("AppFlappy") } //Envoi sur la page "Game" + Envoi du nom du joueur
            />  
        <Button title="Morpion" onPress={ () => navigate("Home") }   />  
        </View>
    )
  }
}
//<Button title="Morpion" onPress={ () => navigate("Home") } //Envoi sur la page "Game" + Envoi du nom du joueur
export default HomeApp;
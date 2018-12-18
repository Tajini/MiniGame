import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Button,
  StyleSheet
} from 'react-native';

function Square(props){ //Fonction pour chaque carré si il est 'touché'
  return(
    <TouchableHighlight style={styles.button} onPress={props.onPress}>
      <Text style={styles.mark}>{ props.value }</Text>
    </TouchableHighlight>
  );
}

class Board extends Component{ //Classe du plateau
  constructor(props) {
    super(props);
  
    this.state = {
      squares: Array(9).fill(null), //Initialisation carrés vides 
      xIsNext: true
    };
  }

  handlePress(i){ //Fonction entière qui se lance à chaque coup d'un joueur
    const squares = this.state.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return; //Passe au render suivant
    }

    squares[i] = this.state.xIsNext ? "X" : "O"; //Boolean entre X et O

    this.setState({
      squares: squares, 
      xIsNext: !this.state.xIsNext //xIsNext est forcément le symbole qui ne vient pas d'être joué
    });
  }

  renderSquare(i){ //Affiche la state actuelle en tant que remplissage une fois un carré touché 
    return <Square value={this.state.squares[i]} onPress={() => this.handlePress(i)} />
  } 

  render(){
    const winner  = calculateWinner(this.state.squares); //Calcul gagnant 
    let   player  = (this.state.xIsNext) ? "X" : "O"; //Récupération state du joueur suivant
    let   status;

    if(winner){
      status = `Gagnant: ${winner}`; //Si il y'a un gagnant : Afficher son nom
    }else{
      status = `Joueur suivant: ${player}`; //Sinon afficher le joueur suivant 
    }

    return( //Affichage plateau
      <View>
        <Text style={styles.status}>{status}</Text>
        <View style={styles.row}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </View>
        <View style={styles.row}>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </View>
        <View style={styles.row}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </View>
      </View>
    )
  }
}

class GameScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Partie de  ${navigation.state.params.name}`, //Affichage du nom en haut avec les paramètres récupérés
  });

  render() {
    const { navigate } = this.props.navigation; //Props navigation entre les pages
    
    return ( //Retourne la vue + Le Plateau + Le bouton de retour à la homescreen
      <View style={styles.wrapper}>
        <View>
          <Board />
        </View>
        <View>
          
        </View>
        <Button style={styles.status} title="Recommencer une partie" onPress={ () => navigate("Home") } //Bouton recommencer (Relance la première page)
        /> 

      </View>

    );
  }
}

const styles = StyleSheet.create({ //Styles
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  status: {
    marginBottom: 10,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
  },
  button: {
    borderWidth: 1,
    borderColor: "#000",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  mark: {
    fontSize: 50,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: ("bold")
  }
});

function calculateWinner(squares){
  const lines = [ //Array lignes de jeu
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) { //Pour chaque Array
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //Si A B et C sont alignés => Retourne le symbole du Square = Gagnant
      return squares[a];
    }
  }
  return null;
}




module.exports = GameScreen;
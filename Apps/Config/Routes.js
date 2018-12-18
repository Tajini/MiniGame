import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

import {
  AppRegistry
} from 'react-native';

//Chemins jeux 
import  HomeScreen from '../Morpion/HomeScreen';
import  GameScreen from '../Morpion/GameScreen';
import HomeApp from '../../HomeApp';
import AppFlappy from '../Flappy/AppFlappy';

const RootStack = createStackNavigator({ //Routes stacksnav
    HomeAppli: {screen: HomeApp },
    AppFlappy: {screen: AppFlappy},
	  Home: { screen: HomeScreen },
	  Game: { screen: GameScreen }



});
const App = createAppContainer(RootStack);
export default App;



AppRegistry.registerComponent('Game', () => App);
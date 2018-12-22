import { Image } from 'react-native';
import { Asset, Font } from 'expo';

export default function cacheAssetsAsync({ files = [], fonts = [] }) {
  return Promise.all([...cacheFiles(files), ...cacheFonts(fonts)]);
}
cacheFiles = (files) => {
  return files.map(file => {
    if (typeof file === 'string') {
      return Image.prefetch(file);
    } else {
      return Asset.fromModule(file).downloadAsync();
    }é
  });
}

 cacheFonts = (fonts) => {
  return fonts.map(font => Font.loadAsync(font));
}
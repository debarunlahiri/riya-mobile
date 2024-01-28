import * as Font from 'expo-font';

const useFonts = async () => {
    await Font.loadAsync({
        DancingScript: require('../src/assets/fonts/dancing_script.ttf'),
        // All other fonts here
    });
};

export default useFonts;

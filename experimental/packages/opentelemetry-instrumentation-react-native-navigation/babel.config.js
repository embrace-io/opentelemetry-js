module.exports = (api) => {
    const presets = ["module:metro-react-native-babel-preset"];
    const plugins = [
        "@babel/plugin-transform-modules-commonjs"
    ]; 
  
    api.cache(false);
   
    return {
        presets,
        plugins
    };
};
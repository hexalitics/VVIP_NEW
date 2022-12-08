import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

import {color} from '../helper/themeHelper';

const Loader = (props) => {
  const {container, containerInvisible} = styles;
  const {containerStyle, isVisible, spinType, spinSize, spinColor} = props;

  return (
    <View
      style={
        isVisible
          ? [container, containerStyle]
          : [containerInvisible, containerStyle]
      }>
      <ActivityIndicator size="large" color={color.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999
  },
  containerInvisible: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export {Loader};

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-navigation';

import { color } from '../helper/themeHelper';

const ContainerComponent = (props) => {
    const { container } = styles;
    const { extraStyle, forceInset, statusbarColor, barStyle, translucent = false, hidden = false } = props;
    return (
        <SafeAreaView
            style={[container, extraStyle && extraStyle]}
            forceInset={forceInset}
        >
            <StatusBar hidden={hidden} backgroundColor={statusbarColor || color.white} barStyle={barStyle || 'dark-content'} translucent={translucent} />
            {props.children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    }
});

export { ContainerComponent };
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {fontFamily, screen} from '../helper/themeHelper';

const HeaderBar = ({
  leftBackNavigation,
  onPressLeft,
  leftIcon,
  leftText,
  leftProfileName,
  leftProfileTitle,
  middleText,
  middleTextExtraStyle,
  onPressRight,
  rightIcon,
  rightIconSize,
  rightIconExtraStyle,
  rightMenuIcon,
  rightMenuOnPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar translucent backgroundColor="#ED0817" />
      <View style={styles.leftIconsView}>
        {leftBackNavigation && (
          <TouchableOpacity
            onPress={onPressLeft}
            style={{
              marginRight: 15,
              flexDirection: 'row',
            }}>
            <Image
              source={{uri: leftBackNavigation}}
              style={styles.leftBackNavigation}
            />
            {leftText && (
              <Text style={{color: '#fff', fontSize: 15}}>{leftText}</Text>
            )}
          </TouchableOpacity>
        )}
        {leftIcon && (
          <TouchableOpacity onPress={onPressLeft} style={{marginRight: 15}}>
            <Image source={{uri: leftIcon}} style={styles.leftIconProfImg} />
          </TouchableOpacity>
        )}

        {leftProfileName && (
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
              {leftProfileTitle}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: '#fff',
              }}>
              {leftProfileName}
            </Text>
          </View>
        )}
      </View>
      <View style={{flexDirection: 'row', paddingRight: 15}}>
        {rightIcon && (
          <TouchableOpacity onPress={onPressRight}>
            {rightIcon}
          </TouchableOpacity>
        )}
        {rightMenuIcon && (
          <TouchableOpacity onPress={rightMenuOnPress}>
            {rightMenuIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const SearchBar = ({searchInput, submitSearchButton, closeButton}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ED0817',
        paddingTop:
          Platform.OS == 'ios'
            ? StatusBar.currentHeight + 20
            : StatusBar.currentHeight,
        width: '100%',
        padding: 10,
      }}>
      <StatusBar translucent backgroundColor="#ED0817" />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',
        }}>
        {searchInput && searchInput}
        {submitSearchButton && submitSearchButton}
        {closeButton && closeButton}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ED0817',
    paddingTop:
      Platform.OS == 'ios'
        ? StatusBar.currentHeight + 20
        : StatusBar.currentHeight,
    padding: 10,
  },
  badgeStyle: {
    height: 15,
    width: 15,
    position: 'absolute',
    backgroundColor: '#DF0000',
    borderRadius: 15 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    top: -5,
  },
  badgeTxt: {
    color: '#FFF',
    fontFamily: fontFamily.CairoLight,
    fontSize: 8,
  },
  leftIconsView: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIconProfImg: {
    borderRadius: 50,
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  leftBackNavigation: {
    height: 20,
    width: 10,
    marginLeft: 10,
    marginRight: 15,
  },
});

export {HeaderBar, SearchBar};

import React, {Component} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';

export function MyTabBar({state, descriptors, navigation}) {
  //console.log('current navigation is : '+JSON.stringify(state.index));
  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={[
          styles.tabBarItem,
          {backgroundColor: state.index === 0 ? '#FF0000' : '#4200C9'},
        ]}
        onPress={() => {
          navigation.navigate('Home');
        }}>
        {/* <IconAD name="home" size={20} color="#fff" /> */}
        <Image source={{uri: 'ic_home'}} style={styles.tabBarIcon} />
        <Text style={styles.tabBarItemText}>HOME</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabBarItem,
          {backgroundColor: state.index === 1 ? '#FF0000' : '#4200C9'},
        ]}
        onPress={() => {
          navigation.navigate('MyVvips');
        }}>
        {/* <IconI name="md-alarm-outline" size={20} color="#fff" /> */}
        <Image source={{uri: 'ic_my_vvips'}} style={styles.tabBarIcon} />
        <Text style={styles.tabBarItemText}>MY VVIPS</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabBarItem,
          {backgroundColor: state.index === 2 ? '#FF0000' : '#4200C9'},
        ]}
        onPress={() => {
          navigation.navigate('Venues');
        }}>
        {/* <IconI name="md-alarm-outline" size={20} color="#fff" /> */}
        <Image source={{uri: 'ic_venues'}} style={styles.tabBarIcon} />
        <Text style={styles.tabBarItemText}>VENUES</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: '#4200C9',
  },
  tabBarItem: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
    width: '30%',
  },
  tabBarItemText: {
    fontSize: 15,
    color: '#fff',
  },
  tabBarIcon: {
    width: 20,
    height: 20,
  },
});

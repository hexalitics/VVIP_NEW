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

const ProfileHeaderBar = ({
  leftBackNavigation,
  onPressLeft,
  ProfileImage,
  leftText,
  ProfileName,
  ProfileTitle,
}) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar translucent backgroundColor="#ED0817" />
      <View>
        {leftBackNavigation && (
          <TouchableOpacity
            onPress={onPressLeft}
            style={[styles.leftIconsView, {marginRight: 15}]}>
            <Image
              source={{uri: leftBackNavigation}}
              style={styles.leftBackNavigation}
            />
            {leftText && (
              <Text style={{color: '#fff', fontSize: 15}}>{leftText}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileView}>
        {ProfileImage && (
          <TouchableOpacity>
            <Image source={{uri: ProfileImage}} style={styles.profileImage} />
          </TouchableOpacity>
        )}

        {ProfileName && (
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: 5,
            }}>
            {ProfileTitle}
          </Text>
        )}
        {ProfileName && (
          <Text
            style={{
              fontSize: 15,
              color: '#fff',
            }}>
            {ProfileName}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignSelf: 'stretch',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    backgroundColor: '#ED0817',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: 220,
  },
  leftIconsView: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    borderRadius: 50,
    width: 55,
    height: 55,
    marginBottom: 5,
  },
  leftBackNavigation: {
    height: 20,
    width: 10,
    marginLeft: 10,
    marginRight: 15,
  },
});

export {ProfileHeaderBar};

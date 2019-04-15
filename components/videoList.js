import React from 'react';
import {
  FlatList,
  Linking,
  Platform,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

const VideoList = props => {
  const { data, handleLoadMore } = props;
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <View style={styles.body}>
          <TouchableHighlight
            key={item.id.videoId}
            onPress={() => {
              const youtube = Platform.select({
                ios: `youtube://watch?v=${item.id.videoId}`,
                default: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              });
              return Linking.openURL(youtube);
            }}
          >
            <View style={styles.vids}>
              <ImageBackground
                source={{ uri: item.snippet.thumbnails.medium.url }}
                style={{
                  width: 220,
                  height: 150,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
              >
                <MaterialIcons name="play-circle-filled" size={50} color="#D0D3D4" />
              </ImageBackground>
              <View style={styles.vidItems}>
                <Text style={styles.vidText} numberOfLines={1} ellipsizeMode="tail">
                  {item.snippet.title}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      )}
      keyExtractor={item => item.id.videoId}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
    />
  );
};

export default VideoList;

const styles = StyleSheet.create({
  body: {
    flex: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 10,
    height: '80%',
  },
  vids: {
    paddingBottom: 10,
    width: 220,
    alignItems: 'center',
    backgroundColor: '#F0F3F4',
    justifyContent: 'center',
    borderBottomWidth: 0.6,
    borderColor: '#aaa',
    borderRadius: 10,
    ...Platform.select({
      // add box shadow for cards on ios and android
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  vidItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  vidText: {
    padding: 20,
    color: '#000',
  },
});

VideoList.propTypes = {
  data: PropTypes.array.isRequired,
  handleLoadMore: PropTypes.func.isRequired,
};

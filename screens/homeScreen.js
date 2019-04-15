import React from 'react';
import { Alert, ActivityIndicator, StyleSheet, View } from 'react-native';
import { MapView, PROVIDER_GOOGLE } from 'expo';
import MainHeader from '../components/header';
import VideoList from '../components/videoList';

/* The function names are self explanatory as to what they do but just decided to also comment on them incase you
don't understand */

const API = '';
const result = 10;
const radius = 50;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      longitude: '',
      latitude: '',
      markers: [],
      data: [],
      pageToken: '',
      nextPage: '',
      isLoading: true,
      error: null,
    };
  }

  // sets time out for activity indicator after 3 seconds when app starts
  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          isLoading: false,
        }),
      3000
    );
  }

  // Clears markers and video list when user clicks on marker twice
  clearMarkers = () => {
    this.setState({
      markers: [],
      data: [],
      error: null,
    });
  };

  // Adds markers and fetches the videos in that location
  addMarker = coordinates => {
    const { markers } = this.state;
    this.setState(
      {
        markers: [...markers, { latlng: coordinates }],
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        isLoading: true,
        data: [],
      },
      () => {
        this.getVideos();
      }
    );
  };

  // Fetches data from youtube api
  getVideos = () => {
    const { longitude, latitude, nextPage, data } = this.state;

    fetch(
      `https://www.googleapis.com/youtube/v3/search?pageToken=${nextPage}&part=snippet&location=${longitude}%2C${latitude}&locationRadius=${radius}mi&maxResults=${result}&order=date&type=video&key=${API}`
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          data: [...data, ...responseJson.items],
          pageToken: responseJson.nextPageToken,
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          error,
          isLoading: false,
        });
      });
  };

  // Loads more videos
  handleLoadMore = () => {
    const { pageToken } = this.state;

    this.setState(
      {
        nextPage: pageToken,
      },
      () => {
        this.getVideos();
      }
    );
  };

  render() {
    const { markers, data, isLoading, error } = this.state;
    return (
      <View style={styles.container}>
        <MainHeader />

        <MapView
          style={styles.map}
          rotateEnabled={false}
          provider={PROVIDER_GOOGLE}
          onPress={e => this.addMarker(e.nativeEvent.coordinate)}
        >
          {markers.map((marker, i) => (
            <MapView.Marker
              key={i}
              coordinate={marker.latlng}
              title="Clearing Screen.."
              onPress={this.clearMarkers}
              pinColor="wheat"
            />
          ))}
        </MapView>
        <ActivityIndicator
          style={{ position: 'absolute', bottom: 280, left: 170 }}
          animating={isLoading}
          size="large"
          color="black"
        />

        <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'transparent' }}>
          {!isLoading && error ? (
            Alert.alert('Oops, Something went wrong...')
          ) : (
            <VideoList data={data} handleLoadMore={this.handleLoadMore} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '100%',
  },
});

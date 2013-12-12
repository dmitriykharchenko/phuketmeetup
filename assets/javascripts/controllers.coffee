angular.module('app').controller "map_controller",  ($scope) ->
  # places.get().success (places_data) ->
  #   $scope.places = places_data

  angular.extend $scope,
    map:
      center: 
        latitude: 45
        longitude: -73

      options:
        streetViewControl: false
        panControl: false

      zoom: 3
      dragging: false
      bounds: {}

      markers: [
        {
          latitude: 45
          longitude: -74
          showWindow: false
          title: 'Marker 2'
        },
        {
          latitude: 15
          longitude: 30
          showWindow: false
          title: 'Marker 2'
        },
        {
          icon: 'plane.png'
          latitude: 37
          longitude: -122
          showWindow: false
          title: 'Plane'
        }
      ]
      
      dynamicMarkers: []
      randomMarkers: []
      doClusterRandomMarkers: true
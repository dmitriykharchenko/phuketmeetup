angular.module('app').controller "map_controller",  ($scope) ->
  # places.get().success (places_data) ->
  #   $scope.places = places_data

  angular.extend $scope,
    map:
      center: 
        latitude: 45
        longitude: -73

      options:
        scrollwheel: false
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

      events:
        click: (mapModel, eventName, originalEventArgs)  ->
          # 'this' is the directive's scope
          $log.log "user defined event: " + eventName, mapModel, originalEventArgs

          e = originalEventArgs[0]

          if not $scope.map.clickedMarker
            $scope.map.clickedMarker =
              title: 'You clicked here'
              latitude: e.latLng.lat()
              longitude: e.latLng.lng()
  
          else
            $scope.map.clickedMarker.latitude = e.latLng.lat()
            $scope.map.clickedMarker.longitude = e.latLng.lng()

          $scope.$apply()

      dynamicMarkers: []
      randomMarkers: []
      doClusterRandomMarkers: true
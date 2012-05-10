/*
 * jQuery UI addresspicker @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.ui.autocomplete.js
 */
(function( $, undefined ) {

  $.widget( "ui.addresspicker", {
    options: {
        appendAddressString: "",
        draggableMarker: true,
        regionBias: null,
        mapOptions: {
            zoom: 5, 
            center: new google.maps.LatLng(46, 2), 
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        elements: {
            map: false,
            lat: false,
            lng: false,
            country: false,
            locality: false,
            administrativeAreaLevel1: false,
            administrativeAreaLevel2: false,
            postalCode: false,
            streetNumber: false,
            route: false
        }
    },

    marker: function() {
      return this.gmarker;
    },
    
    map: function() {
      return this.gmap;
    },

    updatePosition: function() {
      this._updatePosition(this.gmarker.getPosition());
    },
    
    reloadPosition: function() {
      this.gmarker.setVisible(true);
      this.gmarker.setPosition(new google.maps.LatLng(this.lat.val(), this.lng.val()));
      this.gmap.setCenter(this.gmarker.getPosition());
    },
    
    selected: function() {
      return this.selectedResult;
    },
    
    _create: function() {
      this.geocoder = new google.maps.Geocoder();
      this.element.autocomplete({
        source: $.proxy(this._geocode, this),  
        focus:  $.proxy(this._focusAddress, this),
        select: $.proxy(this._selectAddress, this)
      });
      
      this.lat      = $(this.options.elements.lat);
      this.lng      = $(this.options.elements.lng);
      this.country  = $(this.options.elements.country);
      this.locality = $(this.options.elements.locality);
      this.administrativeAreaLevel1 = $(this.options.elements.administrativeAreaLevel1);
      this.administrativeAreaLevel2 = $(this.options.elements.administrativeAreaLevel2);
      this.postalCode = $(this.options.elements.postalCode);
      this.streetNumber = $(this.options.elements.streetNumber);
      this.route = $(this.options.elements.route);

      if (this.options.elements.map) {
        this.mapElement = $(this.options.elements.map);
        this._initMap();
      }
    },

    _initMap: function() {
      if (this.lat && this.lat.val()) {
        this.options.mapOptions.center = new google.maps.LatLng(this.lat.val(), this.lng.val());
      }

      this.gmap = new google.maps.Map(this.mapElement[0], this.options.mapOptions);
      this.gmarker = new google.maps.Marker({
        position: this.options.mapOptions.center, 
        map:this.gmap, 
        draggable: this.options.draggableMarker});
      google.maps.event.addListener(this.gmarker, 'dragend', $.proxy(this._markerMoved, this));
      this.gmarker.setVisible(false);
    },
    
    _updatePosition: function(location) {
      if (this.lat) {
        this.lat.val(location.lat());
      }
      if (this.lng) {
        this.lng.val(location.lng());
      }
    },
    
    _markerMoved: function() {
      this._updatePosition(this.gmarker.getPosition());
    },
    
    // Autocomplete source method: fill its suggests with google geocoder results
    _geocode: function(request, response) {
        var address = request.term, self = this;
        this.geocoder.geocode({
            'address': address + this.options.appendAddressString,
            'region': this.options.regionBias
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    results[i].label =  results[i].formatted_address;
                };
            } 
            response(results);
        })
    },
    
    _findInfo: function(result, type) {
      for (var i = 0; i < result.address_components.length; i++) {
        var component = result.address_components[i];
        if (component.types.indexOf(type) !=-1) {
          return component.long_name;
        }
      }
      return false;
    },
    
    _focusAddress: function(event, ui) {
      var address = ui.item;
      if (!address) {
        return;
      }
      
      if (this.gmarker) {
        this.gmarker.setPosition(address.geometry.location);
        this.gmarker.setVisible(true);

        this.gmap.fitBounds(address.geometry.viewport);
      }
      this._updatePosition(address.geometry.location);
      
      if (this.country) {
        this.country.val(this._findInfo(address, 'country'));
      }
      if (this.locality) {
        this.locality.val(this._findInfo(address, 'locality'));
      }
      if (this.administrativeAreaLevel1) {
        this.administrativeAreaLevel1.val(this._findInfo(address, 'administrative_area_level_1'));
      }
      if (this.administrativeAreaLevel2) {
        this.administrativeAreaLevel2.val(this._findInfo(address, 'administrative_area_level_2'));
      }
      if (this.postalCode) {
        this.postalCode.val(this._findInfo(address, 'postal_code'));
      }
      if (this.streetNumber) {
        this.streetNumber.val(this._findInfo(address, 'street_number'));
      }
      if (this.route) {
        this.route.val(this._findInfo(address, 'route'));
      }
    },
    
    _selectAddress: function(event, ui) {
      this.selectedResult = ui.item;
    }
  });

  $.extend( $.ui.addresspicker, {
    version: "@VERSION"
  });

  // make IE think it doesn't suck
  if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
      for(var i=0; i<this.length; i++){
        if(this[i]==obj){
          return i;
        }
      }
      return -1;
    }
  }

})( jQuery );

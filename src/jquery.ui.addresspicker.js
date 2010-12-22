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
		withMap: false,
		mapOptions: {
		  zoom: 5, 
		  center: new google.maps.LatLng(46, 2), 
		  scrollwheel: false,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		},
		mapBeforeElement: null,
	  draggableMarker: true,
	  latElement: null,
	  lngElement: null
	},

	_create: function() {
	  if (!this._isGoogleMapLoaded()) {
	    $.error('Google map V3 script no loaded, add <script src="http://maps.google.com/maps/api/js?sensor=false"></script>')
	  }
	  this.geocoder = new google.maps.Geocoder();
	  this.element.autocomplete({
			source: $.proxy(this._geocode, this),  
			change: $.proxy(this._selectAddress, this), 
			focus:  $.proxy(this._selectAddress, this)
		});
		
		if (this.options.withMap) {
		  this.mapElement = $( "<div></div>" )
  			.addClass( "ui-addresspicker-map" );
  		$(this.options.mapBeforeElement || this.element).after(this.mapElement);
  		this._initMap()
		}
		this.lat = $(this.options.latElement);
		this.lng = $(this.options.lngElement);
	},

	destroy: function() {
	  if (this.mapElement) {
	    this.mapElement.remove();
	  }
		$.Widget.prototype.destroy.apply( this, arguments );
	},

  _initMap: function() {
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
      this.lat.val(location.lat())
    }
    if (this.lng) {
      this.lng.val(location.lng())
    }
  },
  
  _markerMoved: function() {
    this._updatePosition(this.gmarker.getPosition());
  },
  
  // Autocomplete source method: fill its suggests with google geocoder results
  _geocode: function(request, response) {
    var address = request.term;
    this.geocoder.geocode( { 'address': address + this.options.appendAddressString}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          results[i].label =  results[i].formatted_address
        };
      } 
      response(results);
    })
  },
  
  _selectAddress: function(event, ui) {
    var address = ui.item;
    this.gmarker.setPosition(address.geometry.location);
    this.gmarker.setVisible(true);

    this.gmap.fitBounds(address.geometry.viewport);
    this._updatePosition(address.geometry.location);
  },
  
	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
	},

  // Check if google map V3 is loaded
	_isGoogleMapLoaded: function() {
	  return "google" in window && !!google.maps.Geocoder;
	},
	
	marker: function() {
		return this.gmarker;
	},
	
	map: function() {
	  return this.gmap;
	},
	
	value: function( newValue ) {
	  alert("okok")
	}
	
});

$.extend( $.ui.addresspicker, {
	version: "@VERSION"
});

})( jQuery );

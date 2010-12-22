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
		mapOption: {
		  zoom: 5, 
		  center: new google.maps.LatLng(46, 2), 
		  scrollwheel: false,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		mapBeforeElement: null
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
	},

	destroy: function() {
	  if (this.map) {
	    this.map.element.remove();
	  }
		$.Widget.prototype.destroy.apply( this, arguments );
	},

  _initMap: function() {
    this.map = new google.maps.Map(this.mapElement[0], this.options.mapOption);
    this.marker = new google.maps.Marker({position: this.options.mapOption.center, map:this.map, draggable: true});
    google.maps.event.addListener(this.marker, 'dragend', $.proxy(this._updatePosition, this));
    this.marker.setVisible(false);
  },
  
  _updatePosition: function() {
    
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
    console.log(ui);
  },
  
	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
	},

  // Check if google map V3 is loaded
	_isGoogleMapLoaded: function() {
	  return "google" in window && !!google.maps.Geocoder;
	}
	
});

$.extend( $.ui.addresspicker, {
	version: "@VERSION"
});

})( jQuery );

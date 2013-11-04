jquery-addresspicker
====================

jQuery UI widget for selecting an address.
This widget has been develop for a specific need but feel free to use it or fork the repository


<img src="http://xilinus.com/jquery-addresspicker/demos/images/screenshot.png"/>

You can see a live demo here: [http://xilinus.com/jquery-addresspicker/demos/index.html](http://xilinus.com/jquery-addresspicker/demos/index.html)

Features
====================

- Autocompletion is maiden with jquery-autcomplete widget and filled by google maps V3 geocoding suggests.
- Instant display suggestion on a map

Usage
====================

```js
$('input[name="address"]').addresspicker();
```

```js
$('input[name="address"]').addresspicker({componentRestrictions: {country: 'FR'});
```

Options (with default values)
====================

```js
{
    appendAddressString: "",
    draggableMarker: true,
    regionBias: null,
    componentRestrictions: {},
    updateCallback: null,
    reverseGeocode: false,
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
        street_number: false,
        route: false,
        locality: false,
        administrative_area_level_2: false,
        administrative_area_level_1: false,
        country: false,
        postal_code: false,
        type: false
    },
    autocompleteMode: 'jqueryui', //autocompleteMode: "bootstrap" to use bootstrap typeahead autocomplete
    autocompleteOptions: {}
},
```

Credits
====================

- Sébastien Gruhier - @sgruhier[http://twitter.com/sgruhier] - (http://xilinus.com - maptimize.com[http://v2.maptimize.com])


function LineOfMaps(div_id, step_by, origin, destination) {
  this.round_num = function (num, dec) {
    var result = Math.round(num * Math.pow(10, dec) ) / Math.pow(10, dec);
    return result;
  }

  this.angle_between = function (lat_lng_1, lat_lng_2) {
    var dif_lat = this.round_num(lat_lng_2.lat(), 6) - this.round_num(lat_lng_1.lat(), 6);
    var dif_lng = this.round_num(lat_lng_2.lng(), 6) - this.round_num(lat_lng_1.lng(), 6);
    if(dif_lng == 0) { return 0; }
    var angle = 360 * Math.atan2(dif_lng, dif_lat) / (2 * Math.PI);
    return angle;
  }

  this.dist_sqrd = function (lat_lng_1, lat_lng_2) {
    var dif_lat = lat_lng_2.lat() - lat_lng_1.lat();
    var dif_lng = lat_lng_2.lng() - lat_lng_1.lng();
    return dif_lat * dif_lat + dif_lng * dif_lng;
  }

  this.dist = function(lat_lng_1, lat_lng_2) {
    return Math.sqrt(this.dist_sqrd( lat_lng_1, lat_lng_2 ) );
  }

  this.create_map_div = function(div_num, prefix) {
		var map_div = document.createElement('div');
		map_div.style.height = this.COL_HEIGHT;
		map_div.style.width = this.COL_WIDTH;
		map_div.style.textAlign = 'center';
    map_div.style.float = 'left';
		map_div.innerHTML = "Loading";
		map_div.id = prefix + div_num;
    return map_div;
  }

  this.map_sin = function(angle_in_degrees) {
    return Math.sin(angle_in_degrees / 360 * 2 * Math.PI);
  }

  this.map_cos = function(angle_in_degrees) {
    return Math.cos(angle_in_degrees / 360 * 2 * Math.PI);
  }

  this.create_row = function(prefix, num_cols, num) {
    row_div = document.createElement('div');
    row_div.style.height = "" + this.COL_HEIGHT + "px";
    row_div.style.width = "" + num_cols * this.COL_WIDTH + "px";
    row_div.id = prefix + num;
    document.getElementById(this.div_id).appendChild(row_div);
    return row_div;
  }

  this.set_up_divs = function() {
    var lft_rows = new Array();
    var rgt_rows = new Array();

    var add_to = document.getElementById(this.div_id);
    add_to.style.width = "" + Math.ceil(this.num_steps) * 2 * this.COL_WIDTH + this.LEFT_RIGHT_GAP + "px";
    add_to.style.height = "" + this.COL_HEIGHT + "px";

    for(var i = 0; i < this.num_steps; i++) {
      //this.create_map_div(i, "map_view_", map_row_div);
      lft_rows.push(this.create_map_div(i, "lft_view_") );
      rgt_rows.push(this.create_map_div(i, "rgt_view_") );
    }

    lft_rows[lft_rows.length - 1].style.marginRight = "" + this.LEFT_RIGHT_GAP + "px";

    for(var i = 0; i < lft_rows.length; i++) {
      add_to.appendChild( lft_rows[i] );
    }
    for(var i = lft_rows.length - 1; i >= 0; i--) {
      add_to.appendChild( rgt_rows[i] );
    }

  }

  this.create_map = function(prefix, num, latlng) {
    var map_options = {
      center: latlng,
      disableDefaultUI: true,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById(prefix + num), map_options);

    var mark_options = {
      position: latlng,
      clickable: false,
      map: map
    }

    var mark = new google.maps.Marker(mark_options);
    return map;
  }

  this.create_panorama = function(prefix, num, angle_offset, latlng) {
    var pov = {
      heading: this.angle + angle_offset,
      pitch: 0,
      zoom: 1
    };

    var panOptions = {
      position: latlng,
      pov: pov,
      linksControl: false,
      navigationControl: false
    };

    return new google.maps.StreetViewPanorama(document.getElementById(prefix + num), panOptions);
  }

  this.begin_loading_maps = function() {
    var current_point = new google.maps.LatLng(this.orig.lat(), this.orig.lng() );
    for(var i = 0; i < this.num_steps; i++) {
      
      //this.mini_maps.push(this.create_map("map_view_", i, current_point) );
      this.lft_pans.push(this.create_panorama("lft_view_", i, -90, current_point) );
      this.rgt_pans.push(this.create_panorama("rgt_view_", i,  90, current_point) );

      var new_lat = current_point.lat() + this.step_by * this.map_cos(this.angle);
      var new_lng = current_point.lng() + this.step_by * this.map_sin(this.angle);

      current_point = new google.maps.LatLng(new_lat, new_lng);
    }

  }

  this.wipe_main_div = function() {
    var main_div = document.getElementById(this.div_id);
    while(main_div.childNodes.length > 0) {
      main_div.removeChild(main_div.firstChild);
    }
  }

  this.set_origin = function(origin) {
    this.orig = origin;
  }

  this.set_destination = function(destination) {
    this.dest = destination;
  }

  this.set_step_by = function(step_by) {
    this.step_by = step_by;
  }

  this.set_div_id = function(div_id) {
    this.div_id = div_id;
  }

  this.click = function(map_event) {
    if(!this.orig) {
      this.set_origin(map_event.latLng);
    } else if (!this.dest) {
      this.set_destination(map_event.latLng);
      this.set_up_everything();
      this.set_origin(null);
      this.set_destination(null);
    } else {
      this.set_origin(null);
      this.set_destination(null);
      this.wipe_main_div();
    }
  }

  this.set_up_everything = function() {
    this.angle = this.angle_between(this.orig, this.dest);
    this.num_steps = this.dist(this.orig, this.dest) / this.step_by;
  
    this.wipe_main_div();
    this.lft_pans = new Array();
    this.rgt_pans = new Array();
    this.mini_maps = new Array();
  
    this.set_up_divs();
    this.begin_loading_maps();
  }


  this.div_id = div_id;
  this.step_by = step_by;
  this.orig = origin;
  this.dest = destination;


  this.COL_WIDTH = 300;
  this.COL_HEIGHT = 300;
  this.LEFT_RIGHT_GAP = 100;

}


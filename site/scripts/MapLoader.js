function MapLoader(list_of_addresses, div_id) {
	this.addresses = list_of_addresses
	this.div_id = div_id
	this.coder = new google.maps.Geocoder();

	for(i in this.addresses) {
		var address = this.addresses[i];
		var header_div = document.createElement('div');
		header_div.style.width = 300;
		header_div.innerHTML = address.streetAddress;
		header_div.style.textAlign = 'center';
		document.getElementById(div_id).appendChild(header_div);

		var map_div = document.createElement('div');
		map_div.style.height = 300;
		map_div.style.width = 300;
		map_div.style.textAlign = 'center';
		map_div.innerHTML = "Loading";
		map_div.id = "panorama_num_" + i;
		document.getElementById(div_id).appendChild(map_div);

		this.coder.geocode(address.streetAddress + ", " + address.zipCode, controller);
	}
}

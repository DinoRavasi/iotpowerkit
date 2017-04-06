function sortJSON(data, key, way) {
    return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
		if (way === 'asc' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === 'disc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

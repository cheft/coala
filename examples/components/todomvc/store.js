module.exports = {
	get: function(key) {
		var json = localStorage.getItem(key)
		return json ? JSON.parse(json) : undefined
	},

	set: function(key, value) {
		if (!value) return 
		var json = JSON.stringify(value)
		localStorage.setItem(key, json)
	}
}

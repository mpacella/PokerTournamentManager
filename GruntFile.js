module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			client: {
				src: ["app-client.js"],
				dest: "public/javascripts/bundle.js"
			}
		}
	});
}

grunt.loadNpmTasks("grunt-browserify");

grunt.registerTask("js", ["browserify"]);

grunt.registerTask("default", ["js"]);
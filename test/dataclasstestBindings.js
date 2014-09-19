/*global define */
/*jslint sloppy: true, unparam: true*/
//Author: Jeremy Micah Bassi
define(function () {
    return {
        'foo': function () {
            return {
                text: this.username + " " + this.password,
                style: {
                    width: this.width,
                    height: this.height,
                    backgroundColor: this.col
                }
            };
        }
    }
});
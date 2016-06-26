/**
 * Created by leyiqiang on 6/22/16.
 */
var app = angular.module('Filter', [], angular.noop);
app.filter("getDays", function() {
    return function(input) {
        var date = new Date(input).getTime();
        var dateNow = new Date(Date.now()).getTime();
        return parseInt((dateNow-date)/ (1000*60*60*24))+1;
    }
})
/**
 * Created by leyiqiang on 6/21/16.
 */
(function () {
    angular
        .module("saamDirectives", [])
        .directive("saamSortable", saamSortable);

    function saamSortable() {
        function linker(scope, element, attributes) {
            var start = -1;
            var stop = -1;
            $(element)
                .find("tbody")
                .sortable(
                    {
                        start: function (event, ui) {
                            start = ui.item.index();
                            console.log("start"+start);
                        },
                        stop: function (event, ui) {
                            stop = ui.item.index();
                            console.log("stop"+stop);
                            console.log(scope)
                            // var sortedElement = scope.data.splice(start, 1)[0];
                            // scope.data.splice(stop, 0, sortedElement);
                            scope.$parent.model.sortWill(start, stop);

                        }
                    });
        }

        return {
            templateUrl: "./views/will/saam-sortable.html",
            scope: {
                // title: "=",
                // border:"=",
                data: "=",
                sortlist: "&sort"
            },
            link: linker
        }
    }
})();
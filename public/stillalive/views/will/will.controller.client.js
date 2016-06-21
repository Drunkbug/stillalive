/**
 * Created by leyiqiang on 6/6/16.
 */
(function () {
    angular
        .module("StillAliveAppMaker")
        .controller("WillListController", WillListController)
        .controller("WillChooserController", WillChooserController)
        .controller("EditWillController", EditWillController);
    var orderFlag = -1;

    function WillListController($sce, $routeParams, WillService) {
        var vm = this;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getTrustedUrl = getTrustedUrl;
        vm.sortWill = sortWill;
        vm.uid = $routeParams.id;
        vm.wid = $routeParams.wid;
        function init() {
            WillService
                .findWillsByUserId(vm.uid)
                .then(function (res) {
                    vm.wills = res.data;
                    vm.wills.sort(function (a, b) {
                        return a.order - b.order;
                    });

                });
        }

        init();
        function getTrustedHtml(will) {
            var html = $sce.trustAsHtml(will.text);
            return html;
        }

        function getTrustedUrl(will) {
            var urlParts = will.url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }
        function sortWill(start, stop) {
            WillService
                .reorderWill(vm.uid, start, stop)
                .then(
                    function (res) {
                        vm.wills = res.data;
                    }
                )
        }

    }

    function WillChooserController($location, $routeParams, WillService) {
        var vm = this;
        vm.uid = $routeParams.id;
        console.log(vm.uid)
        vm.wid = $routeParams.wid;
        vm.createWill = createWill;
        function init() {
            WillService
                .findWillsByUserId(vm.uid)
                .then(function (res) {
                    vm.wills = res.data;
                });
        }

        init();

        function createWill(willType) {
            orderFlag += 1;
            var newWill = {
                _client: vm.uid,
                willType: willType,
                order: orderFlag
            };
            WillService
                .createWill(vm.uid, newWill)
                .then(function (res) {
                    var will = res.data;
                    $location.url("/user/" + vm.uid + "/will/" + will._id);
                    return newWill;
                });
        }
    }

    function EditWillController($location, $routeParams, WillService) {
        var vm = this;
        vm.uid = $routeParams.id;
        vm.wid = $routeParams.wid;
        vm.deleteWill = deleteWill;
        vm.updateWill = updateWill;
        vm.checkName = true;

        function init() {
            WillService
                .findWillById(vm.wid)
                .then(function (res) {
                    vm.will = res.data;
                });
        }

        init();


        function deleteWill() {
            WillService.deleteWill(vm.wid);
        }

        function updateWill() {
            if (vm.will.name == "" || vm.will.name == undefined) {
                vm.checkName = false;
                Materialize.toast("Name should not be empty", 1000);
                $location.url("/user/" + vm.uid + "/will/" + will._id);
            } else {
                vm.checkName = true;
                WillService
                    .updateWill(vm.wid, vm.will)
                    .then(function (res) {
                        var result = res.status;
                        if (result === 200) {
                            Materialize.toast("Success", 1000);
                        } else {
                            Materialize.toast("Will Not Found", 1000);
                        }
                    });
            }

        }
    }


})();
/**
 * Created by leyiqiang on 6/6/16.
 */
(function () {
    angular
        .module("StillAliveAppMaker")
        .controller("WillListController", WillListController)
        .controller("WillChooserController", WillChooserController)
        .controller("EditWillController", EditWillController)
        .controller("ClientWillListController", ClientWillListController)
        .controller("ClientWillEditController", ClientWillEditController)
        .controller("WillFlickrSearchController",WillFlickrSearchController);

    var orderFlag = -1;

    function ClientWillEditController($location, $routeParams, $rootScope, WillService) {
        var vm = this;
        var id = $routeParams["cid"];
        vm.aid = $routeParams["aid"];
        vm.uid = id;
        vm.wid = $routeParams["wid"];

        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            WillService
                .findWillById(vm.wid)
                .then(function (res) {
                    vm.will = res.data;
                });
        }

        init();

    }

    function ClientWillListController($location, $routeParams, $rootScope, WillService) {
        var vm = this;
        var id = $routeParams["cid"];
        vm.aid = $routeParams["aid"];
        vm.uid = id;

        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            WillService
                .findWillsByUserId(vm.uid)
                .then(function (res) {
                    vm.wills = res.data;

                });
        }

        init();

    }

    function WillListController($sce, $routeParams, WillService) {
        var vm = this;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getTrustedUrl = getTrustedUrl;
        vm.sortWill = sortWill;
        vm.uid = $routeParams.id;
        vm.wid = $routeParams.wid;
        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            WillService
                .findWillsByUserId(vm.uid)
                .then(function (res) {
                    vm.wills = res.data;
                    orderFlag = vm.wills.length-1
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

        // $(".will-container")
        //     .sortable({axis:"y"});
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
        vm.wid = $routeParams.wid;
        vm.createWill = createWill;
        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
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
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            WillService
                .findWillById(vm.wid)
                .then(function (res) {
                    vm.will = res.data;
                });
        }

        init();


        function deleteWill() {
            WillService
                .deleteWill(vm.wid)
                .then(function (res) {
                    $location.url("/user/"+vm.uid+"/will");
                });
        }

        function updateWill() {
            if (vm.will.name == "" || vm.will.name == undefined) {
                vm.checkName = false;
                toastr.error("Name should not be empty");
                $location.url("/user/" + vm.uid + "/will/" + vm.will._id);
            } else {
                vm.checkName = true;
                WillService
                    .updateWill(vm.wid, vm.will)
                    .then(function (res) {
                        var result = res.status;
                        if (result === 200) {
                            toastr.success("Success");
                        } else {
                            toastr.error("Will Not Found");
                        }
                    });
            }

        }
    }

    function WillFlickrSearchController($location, $routeParams, WillService) {
        var vm = this;
        vm.searchPhotos = searchPhotos;
        vm.addFlikrUrl = addFlikrUrl;
        vm.uid = $routeParams.id;
        vm.wid = $routeParams.wid;
        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            WillService
                .findWillById(vm.wid)
                .then(function (res) {
                    vm.will = res.data;
                });
        }

        init();
        function searchPhotos(searchTest) {
            WillService
                .searchPhotos(searchTest)
                .then(function (res) {
                    data = res.data.replace("jsonFlickrApi(", "");
                    data = data.substring(0, data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                })
        }

        function addFlikrUrl(photo) {
            vm.will.pictureUrl = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg";
            WillService
                .updateWill(vm.wid, vm.will)
                .then(function (res) {
                    var result = res.status;
                    if (result === 200) {
                        toastr.success("success");
                        $location.url("/user/" + vm.uid + "/will/" + vm.wid);
                    } else {
                        toastr.error("will not found")
                    }
                });
        }

    }


})();
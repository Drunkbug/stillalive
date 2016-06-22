/**
 * Created by leyiqiang on 5/29/16.
 */
(function(){
    angular
        .module("StillAliveAppMaker")
        .controller("MainController", MainController)
        .controller("ChoiceController", ChoiceController)
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("ClientProfileController", ClientProfileController)
    .controller("ClientListController", ClientListController);

    function MainController($routeParams, UserService) {

    }

    function ClientListController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        vm.logout = logout;
        vm.aid = $routeParams["aid"];
        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            UserService
                .findUsers()
                .then(function (res) {
                    vm.users = res.data;
                });
        }


        init();


        function logout() {
            $rootScope.currentUser = null;
            UserService
                .logout()
                .then(
                    function () {
                        $location.url("/login");
                    },
                    function () {
                        $location.url("/login");
                    }
                );
        }

    }

    function ClientProfileController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        var id = $routeParams["cid"];
        vm.aid = $routeParams["aid"];
        vm.stillAlive = stillAlive;

        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            UserService
                .findUserById(id)
                .then(function (res) {
                    vm.user = res.data;
                });
        }

        init();
        function stillAlive() {
            UserService
                .updateUserDate(vm.uid)
                .then(function (res) {
                    if (res.status === 200) {
                        toastr.success("Success, client information will be updated");
                    } else {
                        toastr.error("User Not Found");
                    }
                });
        }
        
    }

    function ChoiceController($location, $routeParams, UserService) {
        var vm = this;
        vm.updateUserDate = updateUserDate;
        vm.uid = $routeParams["id"];
        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            UserService
                .findUserById(vm.uid)
                .then(function (res) {
                    vm.user = res.data;
                });
        }

        init();

        function updateUserDate() {
            UserService
                .updateUserDate(vm.uid)
                .then(function (res) {
                    if (res.status === 200) {
                        toastr.success("Success, your information will be updated");
                    } else {
                        toastr.error("User Not Found");
                    }
                });
        }

    }
    function ProfileController($location, $rootScope, $routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        var id = $routeParams["id"];
        vm.user = $rootScope.currentUser;

        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
            UserService
                .findUserById(id)
                .then(function (res) {
                    vm.user = res.data;
                });
        }

        init();


        function updateUser() {
            UserService
                .updateUser(vm.user._id, vm.user)
                .then(function (res) {
                    if (res.status === 200) {
                        toastr.success("Success");
                    } else {
                        toastr.error("User Not Found");
                    }
                });
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.user._id)
                .then(function (res) {
                    if (res.status === 200) {
                        toastr.success("Successfully Deleted");
                        $location.url("/login")
                    } else {
                        toastr.error("Unable to delete user");
                    }
                });
        }


        function logout() {
            $rootScope.currentUser = null;
            UserService
                .logout()
                .then(
                    function () {
                        $location.url("/login");
                    },
                    function () {
                        $location.url("/login");
                    }
                );
        }
    }

    function LoginController($location, $rootScope, UserService) {
        var vm = this;
        vm.login = Login;
        vm.checkUsername = true;
        vm.checkPwd = true;
        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
        }
        init();
        function Login(username, password) {
            if ((username == "" || username == undefined) && (password == "" || password == undefined)) {
                toastr.error("invalid username and password");
                $location.url("/login");
                vm.checkUsername = false;
                vm.checkPwd = false;

            }
            else if (username == "" || username == undefined) {
                toastr.error("invalid username");
                $location.url("/login");
                vm.checkUsername = false;
                vm.checkPwd = true;
            }
            else if (password == "" || password == undefined) {
                toastr.error("invalid password");
                $location.url("/login");
                vm.checkPwd = false;
                vm.checkUsername = true;
            } else {
                vm.checkUsername = true;
                vm.checkPwd = true;
                UserService
                    .login(username, password)
                    .then(function (res) {
                        var user = res.data;
                        if (user) {
                            var id = user._id;
                            if(user.type=='CLIENT') {
                                $location.url("/profile/" + id);
                            } else {
                                $location.url("/admin/" + id);
                            }
                        } else {
                            toastr.error("User Not Found");
                        }
                    });
            }
        }
    }

    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.checkDupUser = checkDupUser;
        vm.checkUsername = true;
        vm.dupPwd = true;
        function init() {
            toastr.options = {
                "positionClass": "toast-bottom-full-width"
            };
        }

        init();
        function checkDupUser(username, password, cpwd) {
            var newUser = {
                username: username,
                password: password,
                firstname: "",
                lastName: "",
                type:'CLIENT'
            };
            if ((username == "" || username == undefined)
                && ((password == "" || password == undefined)
                || (password != cpwd))) {
                vm.checkUsername = false;
                vm.dupPwd = false;
                toastr.error("invalid username and password");
            } else if((username == "" || username == undefined)) {
                vm.checkUsername = false;
                vm.dupPwd = true;
                toastr.error("invalid username");
            } else if((password == "" || password == undefined)
                || (password != cpwd)) {
                vm.checkUsername = true;
                vm.dupPwd = false;
                toastr.error("invalid password");
            } else {
                vm.checkUsername = true;
                vm.dupPwd = true;
                UserService
                    .register(newUser)
                    .then(function (res) {
                            var user = res.data;
                            $rootScope.currentUser = user;
                            $location.url("/profile/" + res.data._id);
                        },
                        function (err) {
                            $location.url("/register/");
                            toastr.error("Illegal username");
                        });
            }

        }
    }
})();
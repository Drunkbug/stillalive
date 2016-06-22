/**
 * Created by leyiqiang on 6/6/16.
 */
(function () {
    angular
        .module("StillAliveAppMaker")
        .factory("WillService", WillService);

    var key = "994aa4e7731e69c44e10c44bf4bec526";
    var secret = "156965e24e478f5b";
    var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

    function WillService($http) {
        var api = {
            findWillsByUserId: findWillsByUserId,
            findWillById: findWillById,
            createWill: createWill,
            updateWill: updateWill,
            deleteWill: deleteWill,
            searchPhotos: searchPhotos,
            reorderWill: reorderWill
        };
        return api;

        function findWillById(willId) {
            var url = "/api/will/" + willId;
            return $http.get(url);
        }

        function findWillsByUserId(userId) {
            var url = "/api/sa/" + userId + "/will";
            return $http.get(url);
        }

        function createWill(userId, will) {
            var url = "/api/sa/" + userId + "/will";
            var data = {
                userId: userId,
                will: will
            };
            return $http.post(url, data);
        }

        function updateWill(willId, will) {
            var url = "/api/will/" + willId;
            var data = {
                willId: willId,
                will: will
            };
            return $http.put(url, data);
        }

        function reorderWill(userId, start, end) {
            var url = "/api/will/"+ userId + "/will?start=" + start + "&end=" + end;
            return $http.put(url);
        }

        function deleteWill(willId) {
            var url = "/api/will/" + willId;
            return $http.delete(url);
        }

        function searchPhotos(searchTerm) {
            var url = urlBase
                .replace("API_KEY", key)
                .replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();

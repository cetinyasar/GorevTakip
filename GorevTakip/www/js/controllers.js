angular.module('starter.controllers', [])
    .controller('LoginCtrl', function($scope, $location, $q, $http) {

        $scope.Kullanici = { Id: -1, Adi: "", Parola: "" };

        $scope.LoginYap = function() {
            console.log("Login Yap Çalýþýyor");
            //$scope.Context.Yukleniyor = false;

            //var loginSonucu = new GorevTakipApp.KullaniciMotoru().LoginYap(new GorevTakipApp.LoginMotoru($q, $http), $scope.Kullanici.Adi, $scope.Kullanici.Parola);

            //if (loginSonucu.Basarili) {
            //    $scope.Kullanici = loginSonucu.Kullanici;
            //    console.log("Kullanici: " + angular.toJson(loginSonucu.Kullanici));
            //    $location.path('/main/home');
            //}
            //$location.path('/tab/dash');
            $location.path('/main/gorevler');
        }
    })
    .controller('GorevlerCtrl', function($scope, $location) {

        console.log("Görevlerrrrrr");
        $scope.Context = new Object();
        $scope.Context.Panolar = veriler.Panolar;

        $scope.toggleGroup = function (pano) {
            if ($scope.isGroupShown(pano)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = pano;
            }
        };

        $scope.isGroupShown = function (pano) {
            return $scope.shownGroup === pano;
        }

        $scope.isDetayAc = function (is) {
            $location.path('/main/isDetay/' + is.IsAkisiInstanceId);
        }

    })
    .controller('IsDetayCtrl', function ($scope, $location) {
        //if ($scope.Kullanici.Id === -1)
        //    $location.path('');
        var path = $location.path();
        $scope.Context.IsAkisiInstanceId = path.substring(path.lastIndexOf('/') + 1);
    })
    .controller('DashCtrl', function($scope) {})
    .controller('ChatsCtrl', function($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        }
    })
    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })
    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });

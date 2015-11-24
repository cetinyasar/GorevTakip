//class Greeter {
//    element: HTMLElement;
//    span: HTMLElement;
//    timerToken: number;
//    constructor(element: HTMLElement) {
//        this.element = element;
//        this.element.innerHTML += "The time is: ";
//        this.span = document.createElement('span');
//        this.element.appendChild(this.span);
//        this.span.innerText = new Date().toUTCString();
//    }
//    start() {
//        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
//    }
//    stop() {
//        clearTimeout(this.timerToken);
//    }
//}
//window.onload = () => {
//    var el = document.getElementById('content');
//    var greeter = new Greeter(el);
//    greeter.start();
//}; 
var GorevTakipApp;
(function (GorevTakipApp) {
    var KullaniciMotoru = (function () {
        function KullaniciMotoru() {
        }
        KullaniciMotoru.prototype.LoginYap = function (loginMotoru, kullaniciAdi, parola) {
            if (kullaniciAdi === "" || parola === "") {
                console.log("login olmadı");
                return new LoginSonucu(false, "Kullanıcı adı ve parola doldurulmalı");
            }
            return loginMotoru.LoginYap(kullaniciAdi, parola);
        };
        return KullaniciMotoru;
    })();
    GorevTakipApp.KullaniciMotoru = KullaniciMotoru;
    var LoginSonucu = (function () {
        function LoginSonucu(basarili, mesaj) {
            this.Basarili = basarili;
            this.Mesaj = mesaj;
            return;
        }
        return LoginSonucu;
    })();
    GorevTakipApp.LoginSonucu = LoginSonucu;
    var Kullanici = (function () {
        function Kullanici(id, adi, soyadi) {
            this.Id = id;
            this.Adi = adi;
            this.Soyadi = soyadi;
            this.Parola = "";
        }
        return Kullanici;
    })();
    GorevTakipApp.Kullanici = Kullanici;
})(GorevTakipApp || (GorevTakipApp = {}));
var GorevTakipApp;
(function (GorevTakipApp) {
    var LoginMotoru = (function () {
        function LoginMotoru(angularQNesnesi, angularHttpNesnesi) {
            this.angularHttpNesnesi = angularHttpNesnesi;
            this.angularQNesnesi = angularQNesnesi;
        }
        LoginMotoru.prototype.LoginYap = function (kullaniciAdi, parola) {
            var loginSonucu = new GorevTakipApp.LoginSonucu(true, "Tamamdır");
            loginSonucu.Kullanici = new GorevTakipApp.Kullanici(1, "ÇETİN", "YAŞAR");
            return loginSonucu;
        };
        LoginMotoru.prototype._LoginYap = function (kullaniciAdi, parola) {
            var iletisimci = new WebApiIletisimci(new AngularPromiseProvider(this.angularQNesnesi), this.angularHttpNesnesi);
            iletisimci.SunucuyaPromiseliIstekGonder("http://www.gorevtakip.com/Index.HashsizLogin.iam", ["cetin", "onur0207"], true).then(function (data) {
                //if (hataVar(data)) {
                alert("Hata data : " + JSON.stringify(data));
                //   return;
                // }
            });
            console.log("login oldu:" + parola);
            var loginSonucu = new GorevTakipApp.LoginSonucu(true, "Başarılı değil");
            loginSonucu.Kullanici = new GorevTakipApp.Kullanici(1, "ÇETİN", "YAŞAR");
            return loginSonucu;
        };
        return LoginMotoru;
    })();
    GorevTakipApp.LoginMotoru = LoginMotoru;
})(GorevTakipApp || (GorevTakipApp = {}));
//# sourceMappingURL=kutuphane.js.map
module GorevTakipApp {
    declare var WebApiIletisimci: any;
    declare var AngularPromiseProvider: any;

    export class LoginMotoru {
        private angularHttpNesnesi;
        private angularQNesnesi;

        constructor(angularQNesnesi, angularHttpNesnesi) {
            this.angularHttpNesnesi = angularHttpNesnesi;
            this.angularQNesnesi = angularQNesnesi;
        }

        public LoginYap(kullaniciAdi: string, parola: string): LoginSonucu {
            var loginSonucu = new LoginSonucu(true, "Tamamdır");
            loginSonucu.Kullanici = new Kullanici(1, "ÇETİN", "YAŞAR");
            return loginSonucu;
        }

        public _LoginYap(kullaniciAdi: string, parola: string): LoginSonucu {
            var iletisimci = new WebApiIletisimci(new AngularPromiseProvider(this.angularQNesnesi), this.angularHttpNesnesi);

            iletisimci.SunucuyaPromiseliIstekGonder("http://www.gorevtakip.com/Index.HashsizLogin.iam", ["cetin", "onur0207"], true).then(function (data) {
                //if (hataVar(data)) {
                alert("Hata data : " + JSON.stringify(data));
                //   return;
                // }

            });
            console.log("login oldu:" + parola);

            var loginSonucu = new LoginSonucu(true, "Başarılı değil");
            loginSonucu.Kullanici = new Kullanici(1, "ÇETİN", "YAŞAR");
            return loginSonucu;
        }
    }
}
 
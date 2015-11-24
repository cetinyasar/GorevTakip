module GorevTakipApp {
    export class KullaniciMotoru {
        LoginYap(loginMotoru: LoginMotoru, kullaniciAdi: string, parola: string): LoginSonucu {
            if (kullaniciAdi === "" || parola === "") {
                console.log("login olmadı");
                return new LoginSonucu(false, "Kullanıcı adı ve parola doldurulmalı");
            }

            return loginMotoru.LoginYap(kullaniciAdi, parola);
        }
    }

    export class LoginSonucu {
        public Basarili: boolean;
        public Kullanici: Kullanici;
        public Mesaj: string;

        constructor(basarili: boolean, mesaj: string) {
            this.Basarili = basarili;
            this.Mesaj = mesaj;
            return;
        }
    }

    export class Kullanici {
        public Id: number;
        public Adi: string;
        public Soyadi: string;
        public Parola: string;
        constructor(id: number, adi: string, soyadi: string) {
            this.Id = id;
            this.Adi = adi;
            this.Soyadi = soyadi;
            this.Parola = "";
        }
    }
}
 
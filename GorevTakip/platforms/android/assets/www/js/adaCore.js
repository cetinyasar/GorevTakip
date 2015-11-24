Date.prototype.adaShortDateStringAl = function () {
    return (this.getDate() + "").padLeft(2, '0') + "." + ((this.getMonth() + 1) + "").padLeft(2, '0') + "." + this.getFullYear();
};

Date.prototype.adaShortTimeStringAl = function () {
    return (this.getHours() + "").padLeft(2, '0') + ":" + (this.getMinutes() + "").padLeft(2, '0');
};

Date.prototype.adaShortDateTimeStringAl = function () {
    return this.adaShortDateStringAl() + " " + this.adaShortTimeStringAl();
};

Date.prototype.jsonStringYap = function () {
    return this.getFullYear() + "-" + ((this.getMonth() + 1) + "").padLeft(2, '0') + "-" + (this.getDate() + "").padLeft(2, '0') + "T" + (this.getHours() + "").padLeft(2, '0') + ":" + (this.getMinutes() + "").padLeft(2, '0') + ":" + (this.getSeconds() + "").padLeft(2, '0');
};

Date.prototype.kolayOkunurAl = function () {
    var simdi = new Date();
    var saatBolumu = (this.getHours() + "").padLeft(2, '0') + ":" + (this.getMinutes() + "").padLeft(2, '0');
    if (simdi.toDateString() == this.toDateString())
        return "Bugün " + saatBolumu;
    if (simdi.addDays(1).toDateString() == this.toDateString())
        return "Yarın " + saatBolumu;
    if (simdi.addDays(-1).toDateString() == this.toDateString())
        return "Dün " + saatBolumu;
    var yilBolumu = (this.getDate() + "").padLeft(2, '0') + "." + ((this.getMonth() + 1) + "").padLeft(2, '0') + "." + this.getFullYear();
    return yilBolumu + " " + saatBolumu;
};

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.addHours = function (hours) {
    return new Date(this.getTime() + hours * 60000 * 60);
};

Date.prototype.addMinutes = function (minutes) {
    return new Date(this.getTime() + minutes * 60000);
};
var AdaCore;
(function (AdaCore) {
    var AdaMesajlasmaClient = (function () {
        function AdaMesajlasmaClient(aboneOlunacakKanalAdlari, onOpenHandler, sunucuAdresi, port, sslKullanilacak) {
            if (typeof onOpenHandler === "undefined") { onOpenHandler = null; }
            if (typeof sunucuAdresi === "undefined") { sunucuAdresi = "mesajlasma.adayazilim.com"; }
            if (typeof port === "undefined") { port = 8181; }
            if (typeof sslKullanilacak === "undefined") { sslKullanilacak = true; }
            this.aboneOlunacakKanalAdlari = aboneOlunacakKanalAdlari;
            this.onOpenHandler = onOpenHandler;
            this.sunucuAdresi = sunucuAdresi;
            this.port = port;
            this.sslKullanilacak = sslKullanilacak;
            this.onMessageFunctions = new Array();
            this.baglantiDurumu = 0;
            this.hataSayisi = 0;
            this.baglantiAdresi = (this.sslKullanilacak ? "wss" : "ws") + "://" + this.sunucuAdresi + ":" + this.port;
            this.BaglantiYap();
        }
        AdaMesajlasmaClient.prototype.BaglantiYap = function () {
            var _this = this;
            var wsImpl = window['WebSocket'] || window['MozWebSocket'];
            if (AdaCore.isUndefined(wsImpl) || wsImpl == null)
                return;

            if (this.hataSayisi >= 15) {
                console.log("Web Soket Bağlantı denemesi sayısı " + this.hataSayisi + " olduğundan artık bağlantı denenmiyor :" + Date.now());
                return;
            }

            this.webSocket = new wsImpl(this.baglantiAdresi);

            this.webSocket.onopen = function () {
                _this.SocketOpenIslemleriniYap();
                console.log("onopen:" + Date.now());
                _this.hataSayisi = 0;
            };

            this.webSocket.onmessage = function (event) {
                _this.SunucudanGelenMesajIsle(event);
            };

            this.webSocket.onclose = function () {
                _this.baglantiDurumu = 2;
                console.log("onclose:" + Date.now());
                _this.hataSayisi++;
                var beklenecekMs = _this.hataSayisi * 1000;
                setTimeout(AdaMesajlasmaClient.BaglantiYap, beklenecekMs, _this);
            };

            this.webSocket.onerror = function () {
                console.log("onerror:" + Date.now());
                //Hiç Bağlantı Yapılmasada onerror dan sonra onclose u çağrıyor...
            };
        };

        AdaMesajlasmaClient.BaglantiYap = function (client) {
            client.BaglantiYap();
        };

        AdaMesajlasmaClient.prototype.SocketOpenIslemleriniYap = function () {
            var _this = this;
            this.baglantiDurumu = 1;
            this.aboneOlunacakKanalAdlari.forEach(function (kanalAdi) {
                return _this.AboneOl(kanalAdi);
            });
            if (this.onOpenHandler != null)
                this.onOpenHandler();
        };

        AdaMesajlasmaClient.prototype.SunucudanGelenMesajIsle = function (event) {
            var mesajNesnesi = JSON.parse(event.data);
            if (!AdaCore.isUndefined(mesajNesnesi.MesajId))
                this.MesajGonder("ACK:" + mesajNesnesi.MesajId);
            this.onMessageFunctions.forEach(function (func) {
                func(mesajNesnesi);
            });
        };

        AdaMesajlasmaClient.prototype.OnMessageFunctionEkle = function (handler) {
            this.onMessageFunctions.push(handler);
        };

        AdaMesajlasmaClient.prototype.OnMessageFunctionSil = function (handler) {
            for (var i = this.onMessageFunctions.length; i > 0; i--)
                if (this.onMessageFunctions[i - 1] == handler)
                    this.onMessageFunctions.splice(i - 1, 1);
        };
        AdaMesajlasmaClient.prototype.OnMessageFunctionHepsiniSil = function () {
            this.onMessageFunctions = new Array();
        };

        AdaMesajlasmaClient.prototype.AboneOl = function (kanalAdi) {
            if (this.baglantiDurumu == 1)
                this.MesajGonder("ABONEOL:" + kanalAdi);
        };

        AdaMesajlasmaClient.prototype.MesajGonder = function (mesaj) {
            this.webSocket.send(mesaj);
        };
        return AdaMesajlasmaClient;
    })();
    AdaCore.AdaMesajlasmaClient = AdaMesajlasmaClient;
})(AdaCore || (AdaCore = {}));
String.prototype.padLeft = function (uzunluk, padKarakteri) {
    var pad = "";
    for (var i = 0; i < uzunluk; i++)
        pad += padKarakteri;
    return pad.substring(0, pad.length - this.length) + this;
};

String.prototype.padRight = function (uzunluk, padKarakteri) {
    var pad = "";
    for (var i = 0; i < uzunluk; i++)
        pad += padKarakteri;
    return this + pad.substring(0, pad.length - this.length);
};

String.prototype.tarihAl = function () {
    if (this.indexOf('.') < this.indexOf(' ') < this.indexOf(':')) {
        var tarihSaat = this.split(' ');
        if (tarihSaat.length == 2) {
            var tarihArray = tarihSaat[0].split('.');
            var saatArray = tarihSaat[1].split(':');
            if (tarihArray.length == 3 && saatArray.length == 3) {
                return new Date(tarihArray[2] * 1, tarihArray[1] * 1 - 1, tarihArray[0] * 1, saatArray[0] * 1, saatArray[1] * 1, saatArray[2] * 1);
            }
        }
    }

    if (this.length < 19)
        return new Date(1, 1, 1);
    return new Date(this.substr(0, 4), this.substr(5, 2) * 1 - 1, this.substr(8, 2), this.substr(11, 2), this.substr(14, 2), this.substr(17, 2), 0);
};

String.prototype.tarihStrAl = function () {
    if (this.indexOf('.') < this.indexOf(' ') < this.indexOf(':')) {
        var tarihSaat = this.split(' ');
        if (tarihSaat.length == 2) {
            var tarihArray = tarihSaat[0].split('.');
            var saatArray = tarihSaat[1].split(':');
            if (tarihArray.length == 3 && saatArray.length == 3) {
                return tarihArray[2] + "." + tarihArray[1] + "." + tarihArray[0];
            }
        }
    }

    if (this.length < 19)
        return "01.01.1900";
    return this.substr(8, 2) + "." + this.substr(5, 2) + "." + this.substr(0, 4);
};

String.prototype.adaShortDateStringdenTarihAl = function () {
    if (this.length < 10)
        return new Date(1, 1, 1);
    return new Date(this.substr(6, 4), this.substr(3, 2) * 1 - 1, this.substr(0, 2), 0, 0, 0, 0);
};

String.prototype.gecerliBirEPostaAdresiMi = function () {
    var emailRegEx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return emailRegEx.test(this);
};
var AdaCore;
(function (AdaCore) {
    var AngularPromiseProvider = (function () {
        function AngularPromiseProvider(angularQNesnesi) {
            this.angularQNesnesi = angularQNesnesi;
        }
        AngularPromiseProvider.prototype.kilitOlustur = function () {
            return this.angularQNesnesi.defer();
        };

        AngularPromiseProvider.prototype.kilitCoz = function (kilitNesnesi, cozumVerisi) {
            kilitNesnesi.resolve(cozumVerisi);
        };

        AngularPromiseProvider.prototype.kilitPromiseAl = function (kilitNesnesi) {
            return kilitNesnesi.promise;
        };
        return AngularPromiseProvider;
    })();
    AdaCore.AngularPromiseProvider = AngularPromiseProvider;
})(AdaCore || (AdaCore = {}));
var AdaCore;
(function (AdaCore) {
    function isUndefined(nesne) {
        return typeof nesne == 'undefined';
    }
    AdaCore.isUndefined = isUndefined;

    function adaVeriOkunabilirStrAl(veri) {
        if (AdaCore.dateNesnesiMi(veri))
            return veri.adaShortDateTimeStringAl();
        return veri;
    }
    AdaCore.adaVeriOkunabilirStrAl = adaVeriOkunabilirStrAl;

    function dateNesnesiMi(nesne) {
        return nesne instanceof Date;
    }
    AdaCore.dateNesnesiMi = dateNesnesiMi;

    function parseRakam(str, yuvarlanmayacakOndalikAdedi) {
        if (typeof yuvarlanmayacakOndalikAdedi === "undefined") { yuvarlanmayacakOndalikAdedi = 2; }
        if (isNaN(parseFloat(str)))
            return 0;
        var sonuc = parseFloat(str);
        return Math.round(sonuc * Math.pow(10, yuvarlanmayacakOndalikAdedi)) / Math.pow(10, yuvarlanmayacakOndalikAdedi);
    }
    AdaCore.parseRakam = parseRakam;

    function ePostaAdresiGecerliMi(adres) {
        var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegEx.test(adres);
    }
    AdaCore.ePostaAdresiGecerliMi = ePostaAdresiGecerliMi;
})(AdaCore || (AdaCore = {}));
var AdaCore;
(function (AdaCore) {
    function sunucuFormatinaCevir(nesne) {
        var tarihleriTarihStrYap = function (input) {
            if (typeof input !== "object")
                return input;
            for (var key in input) {
                if (AdaCore.isUndefined(input) || input == null)
                    continue;
                if (!input.hasOwnProperty(key))
                    continue;
                var value = input[key];
                if (value != null && !AdaCore.isUndefined(value.getFullYear))
                    input[key] = value.jsonStringYap();
                else if (value != null && typeof value === "object")
                    tarihleriTarihStrYap(value);
            }
            return input;
        };

        tarihleriTarihStrYap(nesne);
        return nesne;
    }
    AdaCore.sunucuFormatinaCevir = sunucuFormatinaCevir;

    function istemciFormatinaCevir(nesne) {
        var regexIso8601 = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/;
        var tarihStringleriTarihYap = function (input) {
            if (typeof input !== "object")
                return input;
            for (var key in input) {
                if (AdaCore.isUndefined(input) || input == null)
                    continue;
                if (!input.hasOwnProperty(key))
                    continue;
                var value = input[key];

                //alert(key + ": " + value);
                if (typeof value === "string" && value.match(regexIso8601))
                    input[key] = value.tarihAl();
                else if (value != null && typeof value === "object")
                    tarihStringleriTarihYap(value);
            }
            return input;
        };

        tarihStringleriTarihYap(nesne);
        return nesne;
    }
    AdaCore.istemciFormatinaCevir = istemciFormatinaCevir;
})(AdaCore || (AdaCore = {}));
/// <reference path="WebApiVeriCevrimFonksiyonlari.ts" />
/// <reference path="IPromiseProvider.ts" />
var AdaCore;
(function (AdaCore) {
    var VeriAnalizMotoru = (function () {
        function VeriAnalizMotoru(webApiIletisimcisi, promiseProvider) {
            this.webApiIletisimcisi = webApiIletisimcisi;
            this.promiseProvider = promiseProvider;
        }
        VeriAnalizMotoru.prototype.HamVeriOlusturIdDon = function (veriOlusturmaBilgisi, requestUzanti) {
            if (typeof requestUzanti === "undefined") { requestUzanti = "ada"; }
            return this.webApiIletisimcisi.SunucuyaPromiseliIstekGonder("VeriAnaliz.HamVeriOlusturIdDon." + requestUzanti, veriOlusturmaBilgisi);
        };

        VeriAnalizMotoru.prototype.VeriBicimlendirCoklu = function (hamVeriId, veriBicimleri, requestUzanti, yeniOlusturulanVeriyiSakla) {
            if (typeof requestUzanti === "undefined") { requestUzanti = "ada"; }
            if (typeof yeniOlusturulanVeriyiSakla === "undefined") { yeniOlusturulanVeriyiSakla = false; }
            return this.webApiIletisimcisi.SunucuyaPromiseliIstekGonder("VeriAnaliz.VeriBicimlendirCoklu." + requestUzanti, [hamVeriId, veriBicimleri, yeniOlusturulanVeriyiSakla]);
        };

        VeriAnalizMotoru.prototype.VeriBicimlendirKisitlamali = function (hamVeriId, veriBicimleri, requestUzanti, yeniOlusturulanVeriyiSakla, gosterilecekSatirSayisi) {
            if (typeof requestUzanti === "undefined") { requestUzanti = "ada"; }
            if (typeof yeniOlusturulanVeriyiSakla === "undefined") { yeniOlusturulanVeriyiSakla = false; }
            if (typeof gosterilecekSatirSayisi === "undefined") { gosterilecekSatirSayisi = 100; }
            return this.webApiIletisimcisi.SunucuyaPromiseliIstekGonder("VeriAnaliz.VeriBicimlendirKisitlamali." + requestUzanti, [hamVeriId, veriBicimleri, yeniOlusturulanVeriyiSakla, gosterilecekSatirSayisi]);
        };

        VeriAnalizMotoru.prototype.HamVeriAl = function (hamVeriId, veriBicimleri, requestUzanti, yeniOlusturulanVeriyiSakla, gosterilecekSatirSayisi) {
            if (typeof requestUzanti === "undefined") { requestUzanti = "ada"; }
            if (typeof yeniOlusturulanVeriyiSakla === "undefined") { yeniOlusturulanVeriyiSakla = false; }
            if (typeof gosterilecekSatirSayisi === "undefined") { gosterilecekSatirSayisi = 100; }
            return this.webApiIletisimcisi.SunucuyaPromiseliIstekGonder("YeniVeriAnaliz.HamVeriAl." + requestUzanti, [hamVeriId, veriBicimleri, yeniOlusturulanVeriyiSakla, gosterilecekSatirSayisi]);
        };

        VeriAnalizMotoru.prototype.VeriBicimlendir = function (hamVeriId, veriBicimi, requestUzanti) {
            if (typeof requestUzanti === "undefined") { requestUzanti = "ada"; }
            return this.webApiIletisimcisi.SunucuyaPromiseliIstekGonder("VeriAnaliz.VeriBicimlendir." + requestUzanti, [hamVeriId, veriBicimi]);
        };

        VeriAnalizMotoru.prototype.ExcelOlustur = function (hamVeriId, requestUzanti) {
            if (typeof requestUzanti === "undefined") { requestUzanti = "ada"; }
            return this.webApiIletisimcisi.SunucuyaPromiseliIstekGonder("VeriAnaliz.ExcelOlustur." + requestUzanti, [hamVeriId]);
        };
        return VeriAnalizMotoru;
    })();
    AdaCore.VeriAnalizMotoru = VeriAnalizMotoru;
})(AdaCore || (AdaCore = {}));
/// <reference path="WebApiVeriCevrimFonksiyonlari.ts" />
var AdaCore;
(function (AdaCore) {
    var WebApiIletisimci = (function () {
        function WebApiIletisimci(promiseProvider, httpVekili) {
            this.promiseProvider = promiseProvider;
            this.httpVekili = httpVekili;
        }
        WebApiIletisimci.prototype.SunucuyaPromiseliIstekGonder = function (url, parametreler, parametreleriKlonlayarakGonder, mockResult) {
            if (typeof parametreleriKlonlayarakGonder === "undefined") { parametreleriKlonlayarakGonder = false; }
            if (typeof mockResult === "undefined") { mockResult = null; }
            if (AdaCore.isUndefined(parametreler))
                throw "Sunucuya gönderilen parametre undefined olamaz. (WebApiIletisimci.SunucuyaPromiseliIstekGonder)";
            var kilit = this.promiseProvider.kilitOlustur();
            var gonderilecekParametreler = this.gonderilecekParametreleriOlustur(parametreler, parametreleriKlonlayarakGonder);
            if (mockResult == null)
                this.sunucuyaIstekGonderGelenSonucIleKilitCoz(url, gonderilecekParametreler, kilit);
            else
                this.rastgeleSureBekleVeMockResultIleKilitCoz(mockResult, kilit);
            return this.promiseProvider.kilitPromiseAl(kilit);
        };

        WebApiIletisimci.prototype.sunucuyaIstekGonderGelenSonucIleKilitCoz = function (url, gonderilecekParametreler, kilit) {
            var _this = this;
            this.httpVekili.post(url, AdaCore.sunucuFormatinaCevir(gonderilecekParametreler)).success(function (data) {
                _this.promiseProvider.kilitCoz(kilit, AdaCore.istemciFormatinaCevir(data));
            });
        };

        WebApiIletisimci.prototype.rastgeleSureBekleVeMockResultIleKilitCoz = function (mockResult, kilit) {
            var _this = this;
            setTimeout(function () {
                _this.promiseProvider.kilitCoz(kilit, mockResult);
            }, 1000);
        };

        WebApiIletisimci.prototype.gonderilecekParametreleriOlustur = function (parametreler, parametreleriKlonlayarakGonder) {
            if (parametreler == null)
                return null;
            var donus;
            if (parametreler.constructor === Array) {
                donus = parametreler;
            } else {
                var tmp = new Array();
                tmp[0] = parametreler;
                donus = tmp;
            }

            if (parametreleriKlonlayarakGonder && window["jQuery"]) {
                var yeniParametrelerArray = [];
                for (var i = 0; i < donus.length; i++) {
                    if (typeof (donus[i]) === "object")
                        yeniParametrelerArray.push(window["jQuery"].extend(true, {}, donus[i]));
                    else
                        yeniParametrelerArray.push(donus[i]);
                }

                return yeniParametrelerArray;
            }
            return donus;
        };
        return WebApiIletisimci;
    })();
    AdaCore.WebApiIletisimci = WebApiIletisimci;
})(AdaCore || (AdaCore = {}));

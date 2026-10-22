const quiz = document.getElementById("quiz");
const nawigacja = document.querySelector(".nawigacja-pytan");
const przyciskRozpocznij = document.getElementById("rozpocznij-test");
const przyciskPoprzednie = document.getElementById("poprzednie-pytanie");
const przyciskNastepne = document.getElementById("nastepne-pytanie");
const przyciskSprawdz = document.getElementById("sprawdz-odpowiedzi");
const oknoWyniku = document.getElementById("wynik");
const przyciskZamknij = document.getElementById("zamknij-wynik");
const pytania = Array.from(quiz.querySelectorAll('fieldset[class^="pyt"]'));
let pytaniaWTeście = [];
let aktualnePytanie = 0;

function pokazPytanie() {
    pytaniaWTeście.forEach(function (pytanie, indeks) {
        pytanie.hidden = indeks !== aktualnePytanie;
    });

    przyciskPoprzednie.disabled = aktualnePytanie === 0;
    przyciskNastepne.hidden = aktualnePytanie === pytaniaWTeście.length - 1;
    przyciskSprawdz.hidden = aktualnePytanie !== pytaniaWTeście.length - 1;
}

function rozpocznijTest() {
    const potasowanaPula = pytania.slice();

    for (let indeks = potasowanaPula.length - 1; indeks > 0; indeks--) {
        const losowyIndeks = Math.floor(Math.random() * (indeks + 1));
        [potasowanaPula[indeks], potasowanaPula[losowyIndeks]] =
            [potasowanaPula[losowyIndeks], potasowanaPula[indeks]];
    }

    pytaniaWTeście = potasowanaPula.slice(0, 6);
    pytania.forEach(function (pytanie) {
        pytanie.hidden = true;
        pytanie.querySelectorAll("input").forEach(function (odpowiedz) {
            odpowiedz.checked = false;
        });
    });

    pytaniaWTeście.forEach(function (pytanie) {
        quiz.insertBefore(pytanie, nawigacja);
    });

    aktualnePytanie = 0;
    quiz.hidden = false;
    przyciskRozpocznij.hidden = true;
    pokazPytanie();
}

function sprawdzOdpowiedzi() {
    let punkty = 0;

    pytaniaWTeście.forEach(function (pytanie) {
        const zaznaczone = Array.from(
            pytanie.querySelectorAll("input:checked"),
            function (odpowiedz) {
                return odpowiedz.value;
            }
        ).sort();
        const poprawne = pytanie.dataset.correct.split(",").sort();

        if (zaznaczone.length === poprawne.length &&
            zaznaczone.every(function (odpowiedz, indeks) {
                return odpowiedz === poprawne[indeks];
            })) {
            punkty++;
        }
    });

    const procent = Math.round((punkty / 6) * 100);
    const status = punkty >= 5
        ? "Zaliczony"
        : "Niezaliczony";

    document.getElementById("wynik-tekst").textContent = punkty + "/6";
    document.getElementById("wynik-procent").textContent = procent + "%";
    document.getElementById("komunikat-wyniku").textContent =
        punkty >= 5
            ? "Gratulacje, zaliczyłeś test!"
            : "Niestety, test niezaliczony. Spróbuj ponownie.";
    document.getElementById("wynik-email-punkty").value = punkty + "/6";
    document.getElementById("wynik-email-procent").value = procent + "%";
    document.getElementById("wynik-email-status").value = status;

    oknoWyniku.showModal();
}

przyciskRozpocznij.addEventListener("click", rozpocznijTest);
przyciskPoprzednie.addEventListener("click", function () {
    if (aktualnePytanie > 0) {
        aktualnePytanie--;
        pokazPytanie();
    }
});
przyciskNastepne.addEventListener("click", function () {
    if (aktualnePytanie < pytaniaWTeście.length - 1) {
        aktualnePytanie++;
        pokazPytanie();
    }
});
przyciskSprawdz.addEventListener("click", sprawdzOdpowiedzi);
przyciskZamknij.addEventListener("click", function () {
    oknoWyniku.close();
});
oknoWyniku.addEventListener("close", function () {
    quiz.hidden = true;
    przyciskRozpocznij.textContent = "Wylosuj nowy test";
    przyciskRozpocznij.hidden = false;
});

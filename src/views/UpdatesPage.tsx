const UpdatesPage = () => {
    return (
      <div className="flex flex-col w-full h-full">
        <div
          className="flex pl-4 bg-fourth h-8  items-center
                                    text-fifth text-sm font-medium"
        >
          Aktualizacje
        </div>
        <div
          className="flex pl-4 h-20 items-center
                                    text-black text-3xl font-medium"
        >
          Aktualizacje
        </div>
        <div className="relative inline-block text-left pl-4">
        <div className="text-lg font-inter font-bold">1.0.4 alpha</div>
          <div>
            <ul className="pl-2 text-sm font-inter">
              <li>Dodana możliwość zmiany nazwy użytkownika</li>
              <li>Dodano więcej informacji do ustawień</li>
              <li>Dodana funkcjonalność streaku dni</li>
              <li>Zmiana wizualna informacji o poziomie i XP</li>
              <li>Dodana możliwość eksportu folderu słówek do pliku CSV</li>
              <li>Dodana możliwość importu folderu słówek z pliku CSV</li>
              <li>Poprawiona możliwość kliknięcia w folder</li>
              <li>Dodana pierwsza wersja Chatu z AI</li>
            </ul>
          </div>
        <div className="text-lg font-inter font-bold">1.0.3 alpha</div>
          <div>
            <ul className="pl-2 text-sm font-inter">
              <li>Dodane zostało logo</li>
              <li>Dodany system zdobywania doświadczenia oraz pierwsze 10 poziomów</li>
              <li>Dodano ranking użytkowników</li>
              <li>Refaktoryzacja kodu źródłowego</li>
            </ul>
          </div>
        <div className="text-lg font-inter font-bold">1.0.2 alpha</div>
          <div>
            <ul className="pl-2 text-sm font-inter">
              <li>Usunięte niezaimplementowane "puste strony", do czasu ich zaimplementowania</li>
              <li>Naprawiono błędy z tworzeniem słówek (błąd ID)</li>
              <li>Naprawiono błąd z brakującymi słowami w folderach (wyświetlaniem ich)</li>
            </ul>
          </div>
        <div className="text-lg font-inter font-bold">1.0.1 alpha</div>
          <div>
            <ul className="pl-2 text-sm font-inter">
              <li>"Twoje Foldery" i "Kolekcje Słowek" dodane do menu w responsywnej wersji aplikacji</li>
              <li>Menu rozwijane zamyka się po wybraniu danej opcji</li>
              <li>Dodana możliwość resetu hasła</li>
              <li>Dodana możliwość weryfikacji adresu email</li>
              <li>Dodana możliwość rejestracji z pomocą konta Google</li>
            </ul>
          </div>
          <div className="text-lg font-inter font-bold">1.0.0 alpha</div>
          <div>
            <ul className="pl-2 text-sm font-inter">
              <li>Dodana informacja o wersji</li>
              <li>Usprawniona responsywność dla urządzeń mobilnych</li>
              <li>Naprawiony system rejestracji</li>
              <li>Dodana zakładka "Aktualizacje"</li>
              <li>Title zmieniony z "React App" na "ESłówka"</li>
              <li>Dodany opis w metatagach</li>
            </ul>
          </div>
        </div>
      </div>
    );
}

export default UpdatesPage;
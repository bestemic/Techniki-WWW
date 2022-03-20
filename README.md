# **Dynamiczna strona internetowa**
<br>
<div style="text-align: right"><b>Przemysław Pawlik</b></div>
<br>

## **1. Wstęp**
Strona zrealizowana jako drugi projekt zaliczeniowy z przedmiotu Techniki WWW na który uczęszczałem w roku akademickim 21/22.

----------
<br>

## **2. Opis programu**
Strona jest dynamiczną aplikacją internetową pozwalającą na zarządzenie zadaniami. 

----------
<br>

## **3. Dostępne operacje**
* Zakładanie konta
* Logowanie
* Usuwanie konta
* Wyświetlanie profilu
* Tworzenie zadań
* Edycja zadań
* Wyświetlanie aktwnych zadań
* Zamykanie zadań
* Wyświetlanie zakończonych zadań
* Wyświetlanie szczegółów zadania

----------
<br>

## **4. Endpointy**
* Zadania
    * GET `/tasks/active/:username` - pobranie aktywnych zadań użytkownika
    * GET `/tasks/ended/:username` - pobranie zakończonych zadań użytkownika
    * GET `/tasks/byID/:id` - pobranie zadania o podanym ID
    * POST `/tasks/` - stworzenie zadania
    * PATCH `/tasks/:id` - edycja zadania
    * PATCH `/tasks/end/:id` - zakończenie zadania

* Użytkownicy
    * GET `/validation/valid` - autoryzacja i zwrócenie informacji o zalogowanej osobie
    * GET `/validation/:id` - zwrócenie informacji o użytkowniku
    * POST `/validation/` - stworzenie użytkownika
    * POST `/validation/login` - logowanie i stworzenie tokenu autoryzacyjnego
    * DELETE `/validation/:id` - usunięcie użytkownika

----------
<br>

## **5. Biblioteki**
* Frontend
    * Axios
    * Bootstrap
    * Dayjs
    * Formik
    * React.js
    * React-Bootstrap
    * React-Datepicker
    * React-DOM
    * React-Icons
    * React-Router-DOM
    * Yup

* Backend
    * Bcrypt
    * Cors
    * Express.js
    * Jsonwebtoken
    * Mysql2
    * Sequelize
    * Sequelize-cli

----------
<br>

## **6. Sposób uruchomienia**

### **Baza danych**
Uruchomić serwer SQL, stworzyć bazę danych o nazwie `tododb`. Aplikacja po uruchomieniu utworzy struktorę bazy.
<br>
<br>

### **Serwer**
Przejść do `/serwer`

Zainstalować pakiety i  uruchomić serwer:
```
npm install
npm start
```

Serwer Express.js zostanie uruchomiony pod adresem `localhost:8080`. 
<br>
<br>

### **Klient**
Przejść do `/klient`

Zainstalować pakiety i  uruchomić klienta:
```
npm install
npm start
```

Serwer React.js zostanie uruchomiony pod adresem `localhost:3000`. 

----------
<br>

## **7. Wymagania**
Środowisko **Node.js**<br>
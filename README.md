# 📺 Etähallittava infotaulu

Infotaulujärjestelmä **Suomen Punaisen Ristin Nilsiän osastolle**. Järjestelmä korvaa paperiset ilmoitukset digitaalisella näytöllä, jonka sisältöä vapaaehtoiset hallitsevat selaimella mistä tahansa ilman teknistä osaamista.

**Opinnäytetyö, Savonia-ammattikorkeakoulu 2026 · arvosana 4/5**
📄 [Opinnäytetyö Theseuksessa](https://urn.fi/URN:NBN:fi:amk-2026060422056) · ✅ Tuotantokäytössä syksystä 2026

![Hallintapaneeli (testidata)](docs/hallintapaneeli.png)

---

## Ongelma ja ratkaisu

Osaston tiedotus perustui tulostettaviin ilmoituksiin, joiden päivittäminen vaati käynnin paikan päällä. Infotaulu tuo sisällön digitaaliselle pystynäytölle, ja sitä hallitaan selaimesta:

- **Vapaaehtoinen** kirjautuu sähköpostiin lähetetyllä kertakäyttökoodilla, lataa kuvan, videon tai PDF:n, tai luo ilmoituksen tekoälyapurilla.
- **Raspberry Pi** synkronoi sisällön automaattisesti ja pyörittää esitystä myös verkkokatkon aikana.
- **Ylläpito** näkee hallintapaneelista, onko näyttölaite verkossa ja paljonko tallennustilaa on käytössä.

---

## Ominaisuudet

### Sisällönhallinta
- Kuvien (JPG, PNG), videoiden (MP4), PDF:ien ja HTML-sisällön lataus, enintään 50 Mt
- Esitysjärjestyksen muuttaminen **raahaamalla** (dnd-kit)
- Esitysaika tiedostokohtaisesti (5–600 s)
- Tiedoston piilotus esityksestä poistamatta sitä
- **Vanhenemispäivä**: palvelin poistaa vanhentuneet tiedostot automaattisesti tunnin välein (node-cron)
- Esikatselu pystynäytön mittasuhteissa ennen julkaisua
- Tallennustilan käyttöaste palkkina

### ✨ Tekoälypohjainen sisältöapuri
- Käyttäjä kuvaa ilmoituksen omin sanoin, ja kielimalli (Groq, Llama 3.3 70B) tuottaa otsikon, leipätekstin ja kehotuksen SPR:n viestintätyylin mukaisesti
- Tekstit ovat muokattavissa ennen julkaisua
- Kolme visuaalista pohjaa: punainen kortti, tumma teema ja minimalistinen
- Julkaisu suoraan infotaululle tai lataus PNG-kuvana (1080 × 1920)

### 🔐 Tietoturva
- **Salasanaton kirjautuminen**: 6-numeroinen kertakäyttökoodi sähköpostiin (Resend), voimassa 5 minuuttia ja käytettävissä kerran
- Kirjautuminen sallittu vain **whitelistatuille** sähköpostiosoitteille
- **JWT**-istunto, joka vanhenee 15 minuutissa
- **Rate limiting** OTP-pyynnöille (5 pyyntöä / 10 min / IP)
- CORS rajattu tunnettuihin origineihin
- Salaisuudet vain ympäristömuuttujissa
- Kirjautumis-, lataus- ja poistotapahtumien lokitus (aika, käyttäjä, IP)

### 📡 Laitevalvonta
- Raspberry Pi lähettää säännöllisen heartbeat-viestin
- Hallintapaneeli näyttää laitteen tilan (online/offline), viimeisimmän yhteyden ja synkronoitujen tiedostojen määrän

### 🌍 Kieliversiot
- Käyttöliittymä suomeksi ja englanniksi (i18next)

---

## Arkkitehtuuri

```
┌──────────────────────┐        HTTPS / JWT        ┌──────────────────────────┐
│  Hallintapaneeli     │ ────────────────────────▶ │  REST API                │
│  React (selain)      │ ◀──────────────────────── │  Node.js + Express       │
└──────────────────────┘                           └────────────┬─────────────┘
                                                                │
                              ┌──────────────────┬──────────────┼──────────────────┐
                              ▼                  ▼              ▼                  ▼
                     ┌────────────────┐  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                     │ MongoDB Atlas  │  │ Resend       │ │ Groq API     │ │ node-cron    │
                     │ + GridFS       │  │ (OTP-posti)  │ │ (sisältö-AI) │ │ (siivous)    │
                     └────────────────┘  └──────────────┘ └──────────────┘ └──────────────┘
                              ▲
                              │ synkronointi + heartbeat
                     ┌────────┴───────────────────────┐
                     │  Raspberry Pi -näyttölaite     │
                     │  Linux · FastAPI-synkronointi  │
                     │  Paikallinen välimuisti        │
                     └────────────────────────────────┘
```

**Keskeiset suunnitteluratkaisut**

| Ratkaisu | Perustelu |
|---|---|
| **GridFS** tiedostoille | Tiedostot ja metatiedot samassa tietokannassa, ei erillistä tiedostopalvelua ylläpidettäväksi |
| **OTP ilman salasanoja** | Vapaaehtoisilla ei ole salasanoja muistettavana tai vuodettavana. Pääsy hallitaan whitelistalla. |
| **Paikallinen välimuisti Pi:llä** | Esitys jatkuu, vaikka verkko tai palvelin katkeaisi |
| **Lyhyt JWT-istunto (15 min)** | Jaetulla tai julkisella koneella unohtunut istunto vanhenee nopeasti |
| **AI-sisältö muokattavana luonnoksena** | Tekoäly nopeuttaa työtä, mutta ihminen tarkistaa aina ennen julkaisua |

---

## Teknologiat

| Osa | Tekniikat |
|---|---|
| **Frontend** | React, React Router, dnd-kit, i18next, html2canvas |
| **Backend** | Node.js, Express, Mongoose, Multer, node-cron, express-rate-limit |
| **Tietokanta** | MongoDB Atlas, GridFS |
| **Autentikointi** | Kertakäyttökoodit (otp-generator), JWT, Resend |
| **Tekoäly** | Groq API (Llama 3.3 70B) |
| **Näyttölaite** | Raspberry Pi, Linux, FastAPI |
| **Julkaisu** | Railway |

---

## Projektin rakenne

```
infotaulu/
├── client/                      # React-hallintapaneeli
│   └── src/
│       ├── components/
│       │   ├── aiAssistant/     # Tekoälyapuri ja visuaaliset pohjat
│       │   ├── i18n/            # Kieliversiot (fi/en)
│       │   ├── DeviceStatus.js  # Näyttölaitteen tila
│       │   ├── FileUploadForm.js
│       │   ├── SortableRow.js   # Raahattava tiedostorivi
│       │   └── StorageBar.js
│       ├── hooks/useAuth.js     # OTP-kirjautuminen ja istunto
│       ├── dashboard.js
│       └── login.js
└── server/                      # REST API
    ├── config/db.js             # MongoDB- ja GridFS-yhteys
    ├── controllers/             # Kirjautumis- ja tiedostologiikka
    ├── middleware/auth.js       # JWT-tarkistus
    ├── models/                  # Mongoose-skeemat
    ├── routes/                  # API-reitit
    ├── utils/whitelist.js       # Sallitut sähköpostit
    └── server.js                # Käynnistys, CORS ja ajastettu siivous
```

---

## API

Kaikki sisältöä lukevat ja muokkaavat reitit vaativat voimassa olevan JWT-tunnisteen.

| Metodi | Reitti | Kuvaus |
|---|---|---|
| `POST` | `/api/auth/generate-otp` | Lähettää kertakäyttökoodin |
| `POST` | `/api/auth/verify-otp` | Vahvistaa koodin, palauttaa JWT:n |
| `GET` | `/api/upload` | Listaa tiedostot |
| `POST` | `/api/upload` | Lataa tiedoston |
| `DELETE` | `/api/upload/:id` | Poistaa tiedoston |
| `GET` | `/api/upload/download/:id` | Lataa tiedoston |
| `PATCH` | `/api/upload/:id/toggle` | Näytä / piilota |
| `PATCH` | `/api/upload/:id/display-time` | Asettaa esitysajan |
| `PATCH` | `/api/upload/:id/expires` | Asettaa vanhenemispäivän |
| `PATCH` | `/api/upload/reorder` | Tallentaa esitysjärjestyksen |
| `GET` | `/api/upload/storage/stats` | Tallennustilan käyttö |
| `POST` | `/api/ai/generate` | Luo sisällön tekoälyllä |
| `POST` | `/api/heartbeat/ping` | Näyttölaitteen heartbeat |
| `GET` | `/api/heartbeat/status` | Näyttölaitteen tila |

---

## Ajaminen paikallisesti

**Vaatimukset:** Node.js 18+, MongoDB Atlas -tietokanta (ilmainen taso riittää) sekä Resend- ja Groq-API-avaimet.

```bash
git clone https://github.com/PennasenKake/infotaulu.git
cd infotaulu

# Backend
cd server
cp .env.example .env      # täytä arvot
npm install
node server.js            # http://localhost:5000

# Frontend (uusi terminaali)
cd client
npm install
npm start                 # http://localhost:3000
```

### Ympäristömuuttujat (`server/.env`)

| Muuttuja | Kuvaus |
|---|---|
| `PORT` | Palvelimen portti (oletus 5000) |
| `MONGO_URI` | MongoDB Atlas -yhteysmerkkijono |
| `JWT_SECRET` | JWT-allekirjoitusavain (pitkä satunnainen merkkijono) |
| `RESEND_API_KEY` | Sähköpostipalvelun API-avain |
| `ALLOWED_OTP_EMAILS` | Sallitut sähköpostit pilkulla eroteltuna |
| `GROQ_API_KEY` | Tekoälyapurin API-avain |

Frontend (`client/.env`): `REACT_APP_API_URL=http://localhost:5000`

---

## Kehitysmenetelmä

Hybridimalli: vesiputousmallin vaiheistus (määrittely → suunnittelu → toteutus → testaus → käyttöönotto) yhdistettynä ketterään, iteratiiviseen toteutukseen ja säännölliseen palautteeseen tilaajalta.

## Jatkokehitys

- [ ] Usean näyttölaitteen tuki
- [ ] Automaattiset testit (API-integraatiotestit)

---

## Tekijä

**Eero Korhonen**, ohjelmistotekniikan insinööri (AMK)
[LinkedIn](https://www.linkedin.com/in/eero-korhonen-171115261) · [GitHub](https://github.com/PennasenKake)

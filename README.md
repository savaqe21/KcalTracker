# 🥗 KcalTracker — Dashboard Dietetyczny

Minimalistyczny dashboard do śledzenia kalorii i makroskładników w trybie Dark Mode. Hostowany na GitHub Pages, z dynamicznym odczytem danych — zero przebudowywania po każdej edycji.

## ✨ Funkcje

- **Dynamiczne dane** — edytujesz `danekcal.json` bezpośrednio na GitHubie, dashboard odświeża się automatycznie bez `npm run build`
- **Przegląd tygodnia** — karty KPI (kalorie, deficyt/nadwyżka, szacowany spalony tłuszcz)
- **Wykres kalorii** — AreaChart z gradientem porównujący spożycie vs. limit dzienny
- **Wybór dnia** — 7 interaktywnych kart z miniaturowymi pierścieniami deficytu/nadwyżki
- **Makroskładniki** — RadialBarChart + paski postępu dla białka, węglowodanów i tłuszczów
- **Skeleton loader** — estetyczne ładowanie w klimacie dark mode
- **Sticky header** — przełącznik tygodni zawsze dostępny podczas scrollowania

## 🛠 Stos technologiczny

| Technologia | Rola |
|---|---|
| React 18 + TypeScript | Interfejs i typowanie |
| Vite | Bundler, dev server |
| Tailwind CSS | Stylowanie |
| Recharts | Wykresy (AreaChart, RadialBar) |
| Framer Motion | Animacje i micro-interactions |
| Lucide React | Ikony |

## 📁 Struktura projektu

```
src/
├── types/
│   └── diet.ts              # Typowanie TypeScript struktury JSON
├── components/
│   ├── WeekSelector.tsx     # Przełącznik tygodni
│   ├── KPICard.tsx          # Karty podsumowujące tydzień
│   ├── MainChart.tsx        # AreaChart spożycie vs. limit
│   ├── DaySelector.tsx      # Pozioma lista 7 dni
│   └── MacroRings.tsx       # Wykres makroskładników
└── App.tsx                  # Kontroler stanu + fetch()

public/
└── danekcal.json            # ← TUTAJ EDYTUJESZ DANE
```

## 📊 Format danych (`danekcal.json`)

```json
[
  {
    "tydzien_numer": 1,
    "zakres_dat": "2026-06-02 do 2026-06-08",
    "dni": [
      {
        "dzien_numer": 1,
        "data": "2026-06-02",
        "dzien_tygodnia": "Wtorek",
        "kalorie_spozyte": 1850,
        "limit_bazowy": 2000,
        "bilans": -150,
        "makroskladniki": {
          "bialko_g": 175.0,
          "weglowodany_g": 145.0,
          "tluszcze_g": 65.0
        }
      }
    ],
    "podsumowanie_tygodnia": {
      "lacznie_spozyte_kcal": 13200,
      "laczny_limit_kcal": 14000,
      "laczne_zapytanie_zero_kcal": 18200,
      "wypracowany_deficyt_kcal": 800,
      "szacowany_spalony_tluszcz_kg": 0.11
    }
  }
]
```

Aby dodać nowy tydzień — dorzuć kolejny obiekt do tablicy. Dashboard automatycznie wygeneruje dla niego przycisk w selektorze tygodni.

## 🚀 Uruchomienie lokalne

```bash
npm install
npm run dev
```

## 🏗 Build produkcyjny

```bash
npm run build
```

## 🌐 Deploy na GitHub Pages

Projekt wdraża się automatycznie po każdym pushu do gałęzi `main` za pomocą GitHub Actions.

Wymagana konfiguracja repozytorium:
**Settings → Pages → Source → GitHub Actions**

Plik workflow: `.github/workflows/deploy.yml`

## 🎨 Paleta kolorów

| Kolor | Hex | Użycie |
|---|---|---|
| Tło | `#09090b` | Główne tło aplikacji |
| Powierzchnia | `#141416` | Tło kart |
| Ramka | `#232326` | Obramowania |
| Emerald | `#10b981` | Deficyt, białko |
| Indigo | `#6366f1` | Węglowodany, neutralny bilans |
| Amber | `#f59e0b` | Tłuszcze, kalorie |
| Rose | `#f43f5e` | Nadwyżka, alert |

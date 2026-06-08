export interface Makroskladniki {
  bialko_g: number
  weglowodany_g: number
  tluszcze_g: number
}

export interface Dzien {
  dzien_numer: number
  data: string
  dzien_tygodnia: string
  kalorie_spozyte: number
  limit_bazowy: number
  bilans: number
  makroskladniki: Makroskladniki
}

export interface PodsumowanieTygodnia {
  lacznie_spozyte_kcal: number
  laczny_limit_kcal: number
  laczne_zapytanie_zero_kcal: number
  wypracowany_deficyt_kcal: number
  szacowany_spalony_tluszcz_kg: number
}

export interface Tydzien {
  tydzien_numer: number
  zakres_dat: string
  dni: Dzien[]
  podsumowanie_tygodnia: PodsumowanieTygodnia
}

export type DietData = Tydzien[]

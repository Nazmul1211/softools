export type PetType = "cat" | "dog";
export type DogSize = "small" | "medium" | "large" | "giant";

const DOG_POST_SECOND_YEAR_FACTOR: Record<DogSize, number> = {
  small: 4.3,
  medium: 5.0,
  large: 5.8,
  giant: 7.0,
};

const DOG_SENIOR_START_YEAR: Record<DogSize, number> = {
  small: 10,
  medium: 8,
  large: 7,
  giant: 6,
};

const DOG_EXPECTED_LIFESPAN: Record<DogSize, number> = {
  small: 15,
  medium: 13,
  large: 11,
  giant: 9,
};

export function yearsMonthsToDecimal(years: number, months: number): number {
  const safeYears = Number.isFinite(years) ? Math.max(0, years) : 0;
  const safeMonths = Number.isFinite(months)
    ? Math.max(0, Math.min(11, months))
    : 0;

  return safeYears + safeMonths / 12;
}

export function catAgeToHumanYears(petAgeYears: number): number {
  if (petAgeYears <= 0) return 0;
  if (petAgeYears <= 1) return petAgeYears * 15;
  if (petAgeYears <= 2) return 15 + (petAgeYears - 1) * 9;

  return 24 + (petAgeYears - 2) * 4;
}

export function dogAgeToHumanYears(
  petAgeYears: number,
  size: DogSize = "medium"
): number {
  if (petAgeYears <= 0) return 0;
  if (petAgeYears <= 1) return petAgeYears * 15;
  if (petAgeYears <= 2) return 15 + (petAgeYears - 1) * 9;

  return 24 + (petAgeYears - 2) * DOG_POST_SECOND_YEAR_FACTOR[size];
}

export function dogAgeToHumanYearsLog(petAgeYears: number): number | null {
  if (petAgeYears <= 0) return null;

  return 16 * Math.log(petAgeYears) + 31;
}

export function getCatLifeStage(petAgeYears: number): string {
  if (petAgeYears < 0.6) return "Kitten";
  if (petAgeYears < 2) return "Junior";
  if (petAgeYears < 7) return "Adult";
  if (petAgeYears < 11) return "Mature";
  if (petAgeYears < 15) return "Senior";

  return "Super Senior";
}

export function getDogLifeStage(
  petAgeYears: number,
  size: DogSize = "medium"
): string {
  const seniorStart = DOG_SENIOR_START_YEAR[size];

  if (petAgeYears < 1) return "Puppy";
  if (petAgeYears < 3) return "Young Adult";
  if (petAgeYears < seniorStart) return "Adult";
  if (petAgeYears < seniorStart + 4) return "Senior";

  return "Geriatric";
}

export function getDogPostSecondYearFactor(size: DogSize): number {
  return DOG_POST_SECOND_YEAR_FACTOR[size];
}

export function getDogSeniorStartYear(size: DogSize): number {
  return DOG_SENIOR_START_YEAR[size];
}

export function getDogExpectedLifespan(size: DogSize): number {
  return DOG_EXPECTED_LIFESPAN[size];
}

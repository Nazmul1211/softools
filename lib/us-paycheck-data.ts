export interface UsPaycheckStateProfile {
  code: string;
  slug: string;
  name: string;
  estimatedRate: number;
  noIncomeTax?: boolean;
}

export const usPaycheckStates: UsPaycheckStateProfile[] = [
  { code: "AL", slug: "alabama", name: "Alabama", estimatedRate: 4.5 },
  { code: "AK", slug: "alaska", name: "Alaska", estimatedRate: 0, noIncomeTax: true },
  { code: "AZ", slug: "arizona", name: "Arizona", estimatedRate: 2.5 },
  { code: "AR", slug: "arkansas", name: "Arkansas", estimatedRate: 4.4 },
  { code: "CA", slug: "california", name: "California", estimatedRate: 7.5 },
  { code: "CO", slug: "colorado", name: "Colorado", estimatedRate: 4.4 },
  { code: "CT", slug: "connecticut", name: "Connecticut", estimatedRate: 5.0 },
  { code: "DE", slug: "delaware", name: "Delaware", estimatedRate: 5.5 },
  { code: "FL", slug: "florida", name: "Florida", estimatedRate: 0, noIncomeTax: true },
  { code: "GA", slug: "georgia", name: "Georgia", estimatedRate: 5.4 },
  { code: "HI", slug: "hawaii", name: "Hawaii", estimatedRate: 6.5 },
  { code: "ID", slug: "idaho", name: "Idaho", estimatedRate: 5.8 },
  { code: "IL", slug: "illinois", name: "Illinois", estimatedRate: 4.95 },
  { code: "IN", slug: "indiana", name: "Indiana", estimatedRate: 3.05 },
  { code: "IA", slug: "iowa", name: "Iowa", estimatedRate: 3.8 },
  { code: "KS", slug: "kansas", name: "Kansas", estimatedRate: 5.0 },
  { code: "KY", slug: "kentucky", name: "Kentucky", estimatedRate: 4.0 },
  { code: "LA", slug: "louisiana", name: "Louisiana", estimatedRate: 3.0 },
  { code: "ME", slug: "maine", name: "Maine", estimatedRate: 5.8 },
  { code: "MD", slug: "maryland", name: "Maryland", estimatedRate: 4.75 },
  { code: "MA", slug: "massachusetts", name: "Massachusetts", estimatedRate: 5.0 },
  { code: "MI", slug: "michigan", name: "Michigan", estimatedRate: 4.25 },
  { code: "MN", slug: "minnesota", name: "Minnesota", estimatedRate: 6.0 },
  { code: "MS", slug: "mississippi", name: "Mississippi", estimatedRate: 4.7 },
  { code: "MO", slug: "missouri", name: "Missouri", estimatedRate: 4.95 },
  { code: "MT", slug: "montana", name: "Montana", estimatedRate: 5.5 },
  { code: "NE", slug: "nebraska", name: "Nebraska", estimatedRate: 5.0 },
  { code: "NV", slug: "nevada", name: "Nevada", estimatedRate: 0, noIncomeTax: true },
  { code: "NH", slug: "new-hampshire", name: "New Hampshire", estimatedRate: 0, noIncomeTax: true },
  { code: "NJ", slug: "new-jersey", name: "New Jersey", estimatedRate: 6.0 },
  { code: "NM", slug: "new-mexico", name: "New Mexico", estimatedRate: 4.9 },
  { code: "NY", slug: "new-york", name: "New York", estimatedRate: 6.5 },
  { code: "NC", slug: "north-carolina", name: "North Carolina", estimatedRate: 4.5 },
  { code: "ND", slug: "north-dakota", name: "North Dakota", estimatedRate: 2.5 },
  { code: "OH", slug: "ohio", name: "Ohio", estimatedRate: 3.5 },
  { code: "OK", slug: "oklahoma", name: "Oklahoma", estimatedRate: 4.75 },
  { code: "OR", slug: "oregon", name: "Oregon", estimatedRate: 7.0 },
  { code: "PA", slug: "pennsylvania", name: "Pennsylvania", estimatedRate: 3.07 },
  { code: "RI", slug: "rhode-island", name: "Rhode Island", estimatedRate: 4.5 },
  { code: "SC", slug: "south-carolina", name: "South Carolina", estimatedRate: 5.5 },
  { code: "SD", slug: "south-dakota", name: "South Dakota", estimatedRate: 0, noIncomeTax: true },
  { code: "TN", slug: "tennessee", name: "Tennessee", estimatedRate: 0, noIncomeTax: true },
  { code: "TX", slug: "texas", name: "Texas", estimatedRate: 0, noIncomeTax: true },
  { code: "UT", slug: "utah", name: "Utah", estimatedRate: 4.65 },
  { code: "VT", slug: "vermont", name: "Vermont", estimatedRate: 5.5 },
  { code: "VA", slug: "virginia", name: "Virginia", estimatedRate: 4.8 },
  { code: "WA", slug: "washington", name: "Washington", estimatedRate: 0, noIncomeTax: true },
  { code: "WV", slug: "west-virginia", name: "West Virginia", estimatedRate: 4.5 },
  { code: "WI", slug: "wisconsin", name: "Wisconsin", estimatedRate: 5.0 },
  { code: "WY", slug: "wyoming", name: "Wyoming", estimatedRate: 0, noIncomeTax: true },
  { code: "DC", slug: "district-of-columbia", name: "District of Columbia", estimatedRate: 6.0 },
];

export function getUsStateByCode(code: string): UsPaycheckStateProfile | undefined {
  return usPaycheckStates.find((state) => state.code === code);
}

export function getUsStateBySlug(slug: string): UsPaycheckStateProfile | undefined {
  return usPaycheckStates.find((state) => state.slug === slug);
}

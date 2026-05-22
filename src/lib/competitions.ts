export type Competition = {
  name: string;
  year: string;
  type: string;
};

/**
 * Static competition entries for the homepage Competitions section,
 * listed newest-first across two columns.
 */
export const competitions: Competition[] = [
  { name: "Helsinki Library Pavilion", year: "2025", type: "Open" },
  { name: "Riverbank Memorial Garden", year: "2024", type: "Invited" },
  { name: "Civic Square Reimagined", year: "2024", type: "Open" },
  { name: "Tsukiji Cultural Center", year: "2023", type: "International" },
  { name: "Coastal Research Station", year: "2022", type: "Invited" },
  { name: "Highland Visitor Lodge", year: "2022", type: "Open" },
  { name: "Porto Waterfront Masterplan", year: "2021", type: "International" },
  { name: "Atelier on the Hill", year: "2020", type: "Open" },
  { name: "Iceland Aurora Observatory", year: "2020", type: "International" },
  { name: "New Town Hall, Oslo", year: "2019", type: "Invited" },
  { name: "Forest Chapel Reconstruction", year: "2018", type: "Open" },
  { name: "Marrakech Artist Residency", year: "2017", type: "International" },
];

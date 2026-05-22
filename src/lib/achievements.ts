export type Achievement = {
  title: string;
  year: string;
  type: string;
  image: string;
};

/**
 * Static recognitions data for the homepage Achievements carousel.
 * Replace `image` paths with real photography when available.
 */
export const achievements: Achievement[] = [
  {
    title: "Royal Gold Medal",
    year: "2024",
    type: "Award",
    image: "/award1.png",
  },
  {
    title: "Architect of the Year",
    year: "2023",
    type: "Award",
    image: "/award2.png",
  },
  {
    title: "AJ100 Practice of the Year",
    year: "2022",
    type: "Recognition",
    image: "/award4.jpg",
  },
  {
    title: "Civic Trust Award",
    year: "2021",
    type: "Award",
    image: "/award4.jpg",
  },
  {
    title: "RIBA National Award",
    year: "2020",
    type: "Award",
    image: "/award5.png",
  },
  {
    title: "Stirling Prize Shortlist",
    year: "2019",
    type: "Recognition",
    image: "/award6.png",
  },
  {
    title: "Mies van der Rohe Nomination",
    year: "2018",
    type: "Nomination",
    image: "/award7.png",
  },
  {
    title: "Wood Awards — Gold",
    year: "2017",
    type: "Award",
    image: "/award8.png",
  },
];

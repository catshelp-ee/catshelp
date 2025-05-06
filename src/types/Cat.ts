export interface Cat {
  title?: string;
  description?: string;
  name?: string;
  age?: string;
  appearance?: string;
  procedures?: string;
  issues?: string;
  rescueDate?: string;
  history?: string;
  characteristics?: string;
  likes?: string;
  descriptionOfCharacter?: string;
  treatOtherCats?: string;
  treatDogs?: string;
  treatChildren?: string;
  outdoorsIndoors?: string;
  images?: string[];
}

export const defaultCat: Cat = {
  title: "armas kiisu otsib kodu",
  description: "väga nunnu ja sõbralik talle meeldib mängida palju",
  name: "Karvakera",
  age: "01.11.2018",
  appearance: "Must, Pikakarvaline",
  procedures: "Marutaudi vaktsiin, Ussirohi",
  issues: "nohu",
  rescueDate: "21.11.2020",
  history: "",
  characteristics: "",
  likes: "linde vaadata",
  descriptionOfCharacter: "",
  treatOtherCats: "",
  treatDogs: "",
  treatChildren: "",
  outdoorsIndoors: "toa ja õuekassiks",
  images: [
    "/Cats/ingver.png",
    "/Cats/cute-cat.jpg",
    "/Cats/cute-cat2.jpg",
    "/Cats/cute-cat3.jpg",
  ],
};

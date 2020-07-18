import data from "../db.json";

const nameItemLocal = data.info.nameLocalStorage;

export const checkExistsLocal = () =>
  window.localStorage.getItem(nameItemLocal) !== null;

export const setLocal = (data) => {
  window.localStorage.setItem(nameItemLocal, data);
};

export const getLocal = () => {
  if (!checkExistsLocal()) {
    return setLocal([]);
  }

  const dataString = window.localStorage.getItem(nameItemLocal);
  if (dataString.length <= 1) return [];

  return dataString.split(",").map((data) => {
    const [id, dataItem, titleItem] = data.split("_*_");

    return {
      id,
      data: dataItem,
      title: titleItem,
    };
  });
};

export const makeBriefShortLink = (shortLink) => {
  const MAX_LENGTH_STRING = 25;

  return shortLink.slice(8, MAX_LENGTH_STRING) + "...";
};

export const isEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
};

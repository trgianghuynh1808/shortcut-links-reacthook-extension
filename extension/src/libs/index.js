import data from "../db.json";

const nameItemLocal = data.info.nameLocalStorage;

export const checkExistsLocal = () =>
  window.localStorage.getItem(nameItemLocal) !== null;

export const setLocal = (data) => {
  window.localStorage.setItem(nameItemLocal, data);
};

export const getLocal = () => {
  if (!checkExistsLocal()) {
    // return setLocal(data.defaultShortcutLinks);
    return setLocal([]);
  }

  const dataString = window.localStorage.getItem(nameItemLocal);
  if (dataString.length <= 1) return [];

  return dataString.split(",").map((data) => {
    const [id, dataItem] = data.split("_");

    return {
      id,
      data: dataItem,
    };
  });
};

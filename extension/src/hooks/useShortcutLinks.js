import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { getLocal, setLocal } from "../libs";

const updateData = (newData, setShortcutLink) => {
  setShortcutLink(newData);
  setLocal(
    newData.map((item) => {
      return `${item.id}_${item.data}_${item.title}`;
    })
  );
};

const useShortcutLinks = () => {
  const [shortcutLinks, setShortcutLink] = useState(getLocal());

  const addShortcutLink = (curShortcutLink) => {
    const tempCurId = uuidv4();

    const newData = [
      ...shortcutLinks,
      {
        id: tempCurId,
        data: curShortcutLink,
        title: "",
      },
    ];

    updateData(newData, setShortcutLink);
  };

  const removeShortcutLink = (idShortcutLink) => {
    const newData = shortcutLinks.filter((item) => {
      return item.id !== idShortcutLink;
    });

    updateData(newData, setShortcutLink);
  };

  const addTitleShortcutLink = (id, title) => {
    const newData = [...shortcutLinks].map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        title,
      };
    });

    updateData(newData, setShortcutLink);
  };

  return [
    shortcutLinks,
    addShortcutLink,
    removeShortcutLink,
    addTitleShortcutLink,
  ];
};

export default useShortcutLinks;

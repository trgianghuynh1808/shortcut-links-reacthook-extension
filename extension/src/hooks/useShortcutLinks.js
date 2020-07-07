import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { getLocal, setLocal } from "../libs";

const updateData = (newData, setShortcutLink) => {
  setShortcutLink(newData);
  setLocal(
    newData.map((item) => {
      return `${item.id}_${item.data}`;
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

  return [shortcutLinks, addShortcutLink, removeShortcutLink];
};

export default useShortcutLinks;

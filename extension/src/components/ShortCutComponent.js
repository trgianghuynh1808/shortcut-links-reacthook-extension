import React, { Fragment, useState } from "react";

import useShortcutLinks from "../hooks/useShortcutLinks";

const ShortCutComponent = () => {
  const [
    shortcutLinks,
    addShortcutLink,
    removeShortcutLink,
  ] = useShortcutLinks();
  const [curInput, setCurInput] = useState("");

  if (!shortcutLinks) return <Fragment />;

  console.log(shortcutLinks.length);

  return (
    <Fragment>
      <div className="short-cut-wrp">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="text-success text-capitalize text-center">
              Shortcut Links Extension
            </div>
          </div>
        </div>
        <div className="input-group mb-3 mt-3 ">
          <input
            id="input-link"
            type="text"
            className="form-control"
            placeholder="Paste Link"
            onChange={(event) => {
              setCurInput(event.target.value);
            }}
            onPaste={(event) => {
              const curContent = (
                event.clipboardData || window.clipboardData
              ).getData("text");
              setCurInput(curContent);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addShortcutLink(curInput);
                setCurInput("");
              } else {
                e.preventDefault();
              }
            }}
            value={curInput}
            maxLength={0}
          />
        </div>
        <div className="mt-2">
          <ul className="list">
            {shortcutLinks.length <= 0 ? (
              <div>No things!</div>
            ) : (
              shortcutLinks.map((link, index) => {
                return (
                  <li key={index}>
                    <a href={link.data} target="_blank">
                      {link.data}
                    </a>
                    <span
                      className="ml-2 text-danger cursor-pointer"
                      onClick={() => {
                        removeShortcutLink(link.id);
                      }}
                    >
                      x
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
      <div className="text-center font-12">
        Press key <span className="font-weight-bold">Ctrl+Shift+F</span> to
        ON/OFF
      </div>

      <style jsx="true">{`
        .short-cut-wrp {
          padding: 30px;
        }

        .short-cut-wrp ul.list {
          list-style-type: square;
          padding: 0px;
        }
      `}</style>
    </Fragment>
  );
};

export default ShortCutComponent;

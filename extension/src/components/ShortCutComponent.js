import React, { Fragment, useState, useEffect } from "react";

import useShortcutLinks from "../hooks/useShortcutLinks";
import { makeBriefShortLink, getLocal } from "../libs";

const initStateShowEditInputs = () => {
  const data = getLocal();

  return data.map((item) => {
    return {
      id: item.id,
      isShowEditInput: false,
    };
  });
};

const ShortCutComponent = () => {
  const [
    shortcutLinks,
    addShortcutLink,
    removeShortcutLink,
    addTitleShortcutLink,
  ] = useShortcutLinks();
  const [curInput, setCurInput] = useState("");
  const [showEditInputs, setShowEditInputs] = useState(
    initStateShowEditInputs()
  );
  const [curEditInput, setCurEditInput] = useState("");

  useEffect(() => {
    setShowEditInputs(initStateShowEditInputs());
  }, [shortcutLinks]);

  if (!shortcutLinks) return <Fragment />;

  return (
    <Fragment>
      <div className="short-cut-wrp">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="text-success text-uppercase text-center">
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
          <table className="table">
            <thead className="text-center head-row">
              <tr>
                <th scope="col">Shortcut Links</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {shortcutLinks.length <= 0 ? (
                <tr className="text-center">
                  <th scope="row" colSpan="2">
                    No things!
                  </th>
                </tr>
              ) : (
                shortcutLinks.map((link, index) => {
                  const curShowEditInputs = showEditInputs.find(
                    (item) => item.id === link.id
                  );

                  return (
                    <tr key={index}>
                      <th scope="row">
                        {curShowEditInputs &&
                        curShowEditInputs.isShowEditInput === true ? (
                          <input
                            type="text"
                            placeholder="Enter title"
                            className="edit-input"
                            value={curEditInput}
                            onChange={(event) => {
                              setCurEditInput(event.target.value);
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addTitleShortcutLink(link.id, curEditInput);
                                setCurEditInput("");
                              }
                            }}
                          />
                        ) : (
                          <a href={link.data} target="_blank">
                            {link.title || makeBriefShortLink(link.data)}
                          </a>
                        )}
                      </th>
                      <th className="text-center">
                        <img
                          src={`${process.env.PUBLIC_URL}/icons/trash-icon.png`}
                          className=" mr-2 text-danger cursor-pointer"
                          onClick={() => {
                            removeShortcutLink(link.id);
                          }}
                        />

                        <img
                          src={`${process.env.PUBLIC_URL}/icons/edit-icon.png`}
                          className=" ml-2 text-danger cursor-pointer"
                          onClick={() => {
                            //clear content input
                            setCurEditInput("");

                            const curEditInput = showEditInputs.find(
                              (item) => item.id === link.id
                            );

                            const newShowEditInputs = [...showEditInputs].map(
                              (item) => {
                                if (item.id !== curEditInput.id)
                                  return {
                                    id: item.id,
                                    isShowEditInput: false,
                                  };

                                return {
                                  id: item.id,
                                  isShowEditInput: !curEditInput.isShowEditInput,
                                };
                              }
                            );

                            setShowEditInputs(newShowEditInputs);
                          }}
                          height={16}
                          width={16}
                        />
                      </th>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <ul className="list"></ul>
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

        .short-cut-wrp .head-row {
          background: goldenrod;
          color: white;
        }

        .short-cut-wrp .edit-input {
          height: 19px;
          width: 170px;
        }
      `}</style>
    </Fragment>
  );
};

export default ShortCutComponent;

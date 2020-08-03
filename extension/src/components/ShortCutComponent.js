import React, { Fragment, useState, useEffect } from "react";

import useShortcutLinks from "../hooks/useShortcutLinks";
import {
  makeBriefShortLink,
  getLocal,
  getDataStringLocal,
  setLocal
} from "../libs";

const initStateShowEditInputs = () => {
  const data = getLocal();

  return data.map(item => {
    return {
      id: item.id,
      isShowEditInput: false
    };
  });
};

const ShortCutComponent = () => {
  const [
    shortcutLinks,
    initShortcutLink,
    addShortcutLink,
    removeShortcutLink,
    addTitleShortcutLink
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

  const handleDownTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([getDataStringLocal()], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "export-data.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleImportTxtFile = e => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async e => {
      const data = e.target.result;
      setLocal(data);
      initShortcutLink();
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleQuestion = () => {
    alert("test hehe");
  };

  return (
    <Fragment>
      <div className="short-cut-wrp">
        <div className="row justify-content-between">
          <div className="col-10">
            <div className="text-success text-uppercase text-center">
              Shortcut Links Extension
            </div>
          </div>
          <div className="col-1">
            <img
              src={`${process.env.PUBLIC_URL}/icons/export-icon.png`}
              className=" mr-3 cursor-pointer"
              onClick={handleDownTxtFile}
              alt="export-icon"
            />

            <span className="">
              <label htmlFor="input-file">
                <img
                  src={`${process.env.PUBLIC_URL}/icons/import-icon.png`}
                  className=" mr-3 cursor-pointer"
                  alt="import-icon"
                />
              </label>

              <input
                className="d-none"
                id="input-file"
                type="file"
                onChange={event => handleImportTxtFile(event)}
              />
            </span>

            <img
              src={`${process.env.PUBLIC_URL}/icons/question-icon.png`}
              className="cursor-pointer"
              onClick={handleQuestion}
              alt="question-icon"
              height="20"
              width="20"
            />
          </div>
        </div>
        <div className="input-group mb-3 mt-3 ">
          <input
            id="input-link"
            type="text"
            className="form-control"
            placeholder="Paste Link"
            onChange={event => {
              setCurInput(event.target.value);
            }}
            onPaste={event => {
              const curContent = (
                event.clipboardData || window.clipboardData
              ).getData("text");
              setCurInput(curContent);
            }}
            onKeyPress={e => {
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
                    item => item.id === link.id
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
                            onChange={event => {
                              setCurEditInput(event.target.value);
                            }}
                            onKeyPress={e => {
                              if (e.key === "Enter") {
                                addTitleShortcutLink(link.id, curEditInput);
                                setCurEditInput("");
                              }
                            }}
                          />
                        ) : (
                          <a
                            href={link.data}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
                          alt="trash-icon"
                        />

                        <img
                          src={`${process.env.PUBLIC_URL}/icons/edit-icon.png`}
                          className=" ml-2 text-danger cursor-pointer"
                          alt="edit-icon"
                          onClick={() => {
                            //clear content input
                            setCurEditInput("");

                            const curEditInput = showEditInputs.find(
                              item => item.id === link.id
                            );

                            const newShowEditInputs = [...showEditInputs].map(
                              item => {
                                if (item.id !== curEditInput.id)
                                  return {
                                    id: item.id,
                                    isShowEditInput: false
                                  };

                                return {
                                  id: item.id,
                                  isShowEditInput: !curEditInput.isShowEditInput
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
        </div>
      </div>
      <div className="text-center font-12">
        Press key <span className="font-weight-bold">Ctrl+Shift+F</span> to
        ON/OFF.
      </div>
      <div className="text-center font-12">
        Press key <span className="font-weight-bold">Enter</span> to confirm.
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

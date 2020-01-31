import React from "react";
import propTypes from "prop-types";
import { Logger } from "aws-amplify";

const _logger = new Logger("File");

const FileCard = ({ files, onEditFile, onDeleteFile }) => {
  _logger("Mapping file cards.", files);

  return (
    <div className="col-xs-12 col-md-4">
      <div className="card">
        <div className="container fileHoverImage">
          <img
            width="100%"
            alt="fileImage"
            src={files.url}
            onError={e => {
              e.target.src =
                "https://sterlingcomputers.com/wp-content/themes/Sterling/images/no-image-found-360x260.png";
            }}
            className="card-img-top image mt-3"
          />
          <div className="middle">
            <div className="text">{files.typeFile.name}</div>
          </div>
        </div>
        <div className="card-body fileCardBody">
          <div className="container fileCardBodyContainer">
            <div className="card-title font-weight-bold">{files.fileName}</div>
            <div className="card-title">
              File Address: <div className="card-subtitle">{files.url}</div>
            </div>
            <div className="card-title">
              Uploaded:{" "}
              <div className="card-subtitle">
                {Date(files.dateCreated).slice(0, 21)}
              </div>
            </div>
          </div>
          <div className="row fileCardButtonRow">
            <button className="btn btn-success col-5" onClick={onEditFile}>
              Edit
            </button>
            <button className="btn btn-secondary col-5" onClick={onDeleteFile}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FileCard;

FileCard.propTypes = {
  files: propTypes.shape({
    typeFile: propTypes.shape({
      name: propTypes.string
    }),
    url: propTypes.string,
    createdBy: propTypes.number,
    dateCreated: propTypes.string
  })
};

import React from "react";
import * as fileService from "../../services/fileService";
import PropTypes from "prop-types";
import FileCard from "./FileCard";
import Swal from "sweetalert2";
import Pagination from "rc-pagination";
import localeInfo from 'rc-pagination/lib/locale/en_US';
import "rc-pagination/assets/index.css";
import "./File.css";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar";
import { Logger } from "aws-amplify";

const _logger = new Logger("File");

export default class File extends React.Component {
  state = {
    formData: {
      name: "",
      description: "",
      statusId: ""
    },
    pageIndex: 0,
    pageSize: 12,
    searchResult: ""
  };

  componentDidMount() {
    this.getAllFiles(this.state.pageIndex, this.state.pageSize);
  }

  getAllFiles = (pageIndex, pageSize) => {
    fileService
      .getAll(pageIndex, pageSize)
      .then(this.onDisplayFilesSuccess)
      .catch(this.onDisplayFilesFail);
  };

  onDisplayFilesSuccess = response => {
    let pageInfo = response.data.item;
    this.setState({
      files: pageInfo.pagedItems.map(this.renderFiles),
      currentPage: pageInfo.pageIndex + 1,
      total: pageInfo.totalCount
    });
  };

  handlePageChange = page => {
    if (this.state.searchResult) {
      this.getSearchResults(page - 1);
    } else {
      this.getAllFiles(page - 1, this.state.pageSize);
      this.setState({
        currentPage: page
      });
    }
  };

  onDisplayFilesFail = response => {
    _logger(response);
  };

  renderFiles = (files, i) => (
    <FileCard
      files={files}
      key={`FileCard_${i}`}
      onEditFile={this.editFile}
      onDeleteFile={this.deleteFile}
    />
  );

  editFile = fileInfo => {
    _logger(fileInfo);
    this.props.history.push(`file/${fileInfo.id}/edit`, fileInfo);
  };

  deleteFile = id => {
    _logger("this is the id of the delete element", id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        fileService
          .deleteFile(id)
          .then(this.deleteFileSuccess)
          .catch(this.deleteFileError);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled!", "Your file is safe :)", "error");
      }
    });
  };

  deleteFileSuccess = response => {
    _logger("SUCCESS", response);
    Swal.fire("Success!", "File deleted!", "success");

    this.getAllFiles(this.state.pageIndex, this.state.pageSize);
  };

  deleteFileError = errResponse => {
    _logger("ERROR", errResponse);
    Swal.fire("Error.", "Something went wrong.", "error");
  };

  onSearchChange = event => {
    this.setState({ searchResult: event, pageIndex: 0 }, () => {
      this.state.searchResult.length > 0
        ? this.getSearchResults(this.state.pageIndex)
        : this.getAllFiles(this.state.pageIndex, this.state.pageSize);
    });
  };

  getSearchResults = page => {
    fileService
      .search(this.state.searchResult, page, this.state.pageSize)
      .then(this.onSearchSuccess)
      .catch(this.onSearchFail);
  };

  onSearchSuccess = response => {
    this.setState({
      files: response.item.pagedItems.map(this.renderFiles),
      currentPage: response.item.pageIndex + 1,
      total: response.item.totalCount
    });
    _logger(response);
  };

  onSearchFail = errResponse => {
    _logger(errResponse);
    this.setState({ files: null });
  };

  render() {
    return (
      <>
        <div>
          <div className="jumbotron">
            <h1 className="pageHeader">Files</h1>
          </div>
          <div className="row pb-4">
            <div className="col-sm-6">
              <Link to="/file/new">
                <button className="btn btn-success">Add File</button>
              </Link>
            </div>
            <div className="col-sm-6">
              <SearchBar onChange={this.onSearchChange} />
            </div>
          </div>
          <div className="row">{this.state.files}</div>
          <div className="row">
            <Pagination
              defaultCurrent={this.state.currentPage}
              total={this.state.total}
              onChange={this.handlePageChange}
              pageSize={this.state.pageSize}
              locale={localeInfo}
            />
          </div>
        </div>
      </>
    );
  }
}

File.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }),
  prevPath: PropTypes.string
};

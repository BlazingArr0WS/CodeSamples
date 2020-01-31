import React from "react";
import {
  Navbar,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";
import SearchIcon from "../../assets/images/icons/search.svg";
import lifecycle from "react-pure-lifecycle";
import PropTypes from "prop-types";
import { Logger } from "aws-amplify";

const _logger = new Logger("FunctionalComponent");

const methods = {
  componentDidMount() {
    menuBackground();
  }
};

const menuBackground = () => {
  let nav = document.querySelector(".scrollNavbar");

  window.onscroll = function() {
    if (window.pageYOffset > 300) {
      nav.style.display = "block";
    } else {
      nav.style.display = "none";
    }
  };
};

const FunctionalComponent = ({ searchData }) => {
  _logger.info("FunctionalComponent", searchData);
  return (
    <div>
      <Navbar
        className="scrollNavbar fixed-top"
        style={{
          backgroundColor: "#0013639c",
          zIndex: "100",
          width: "100%",
          display: "none"
        }}
        dark
        expand="md"
      >
        <InputGroup className="col-xs-12 col-md-6 col-lg-4 m-auto">
          <Input
            className="border-0"
            placeholder="State, City, ZIP, Address, or School"
            name="FunctionalComponent"
            onChange={searchData.onSearchChange}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText
              className="border-0"
              style={{ backgroundColor: "#fff" }}
            >
              <img src={SearchIcon} alt="SearchIcon" />{" "}
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Navbar>
    </div>
  );
};
export default lifecycle(methods)(FunctionalComponent);

FunctionalComponent.propTypes = {
  searchData: PropTypes.shape({
    onSearchChange: PropTypes.func
  })
};

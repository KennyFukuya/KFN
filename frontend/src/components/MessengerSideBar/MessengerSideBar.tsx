import React, { useState } from "react";
import { debounce } from "lodash";
import styled from "styled-components";
import ChatUser from "../ChatUser/ChatUser";
import colors from "../../constants/colors";

const SideBarWrapper = styled.div`
  flex-basis: 30%;
  background: ${colors.dark.primary};
  color: #949494;
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 5px 0 0 5px;
`;

const UsersSectionHeader = styled.h3`
  color: #949494;
  font-weight: 400;
`;

const SearchWrapper = styled.div`
  background: ${colors.dark.search.background};
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;

  > span {
    color: ${colors.dark.search.color};
  }
`;

const SearchInput = styled.input`
  width: 80%;
  outline: none;
  border: none;
  background: ${colors.dark.search.background};
  color: ${colors.dark.search.color};
  font-weight: 500;
  font-size: 16px;
`;

function MessengerSideBar() {
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    300
  );

  return (
    <SideBarWrapper>
      <SearchWrapper>
        <span className="material-icons">search</span>
        <SearchInput
          placeholder="Search People"
          value={searchValue}
          onChange={debouncedSearch}
        />
      </SearchWrapper>

      <section>
        <UsersSectionHeader>Users</UsersSectionHeader>
        <ChatUser />
      </section>
    </SideBarWrapper>
  );
}

export default MessengerSideBar;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { debounce } from "lodash";
import styled from "styled-components";
import colors from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useMutation } from "react-query";
import UserBadge from "../UserBadge/UserBadge";
import useUserData from "../../hooks/useUserData";
import useTopics from "../../hooks/useTopics";
import { Topic } from "../../pages/Messenger";

const SideBarWrapper = styled.div`
  flex-basis: 30%;
  color: #949494;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 5px 0 0 5px;

  > :first-child {
    background: ${colors.dark.primary};
    flex-basis: 90%;

    > :first-child {
      padding: 20px;
    }

    > :last-child {
      padding: 0 30px;
    }
  }

  > :last-child {
    background: ${colors.dark.search.background};
    flex-basis: 10%;

    > section {
      padding: 20px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      > div {
        display: flex;
        gap: 15px;
        align-items: center;

        > div {
          width: 40px;
          height: 40px;
          cursor: default;

          &:after {
            width: 10px;
            height: 10px;
            top: 30px;
            right: 2px;
          }
        }
      }
    }
  }
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

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  > span {
    color: ${colors.dark.secondary};
  }
`;

const UserName = styled.span`
  color: ${colors.dark.secondary};
  font-size: 18px;
  font-weight: 500;
`;

const TopicsWrapper = styled.div`
  margin: 10px 0;
  font-size: 28px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;

  :nth-child(2) {
    margin: 0 5px 0 10px;
  }

  :last-child {
    font-size: 12px;
    align-self: end;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logoutConnection = async () => await api.post("/auth/google/logout");

interface MessageSideBar {
  setActiveTopic: React.Dispatch<React.SetStateAction<Topic | undefined>>;
}

function MessengerSideBar({ setActiveTopic }: MessageSideBar) {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const userData = useUserData();

  const { data: topics } = useTopics();

  const { mutate } = useMutation(logoutConnection, {
    onSuccess: () => {
      localStorage.removeItem("oauth");
      localStorage.removeItem("accessToken");

      navigate("/");
    },
    onError: (err) => {
      localStorage.removeItem("oauth");
      localStorage.removeItem("accessToken");

      navigate("/");

      console.error(err);
    },
  });

  const debouncedSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(event.target.value);
      setSearchValue(event.target.value);
    },
    300
  );

  const handleLogout = () => {
    mutate();
  };

  const getTopicsList = () => {
    if (!topics) {
      return null;
    }

    return topics.map((t: any, i: number) => {
      const handleTopicClick = () => {
        setActiveTopic(t);
      };

      return (
        <TopicsWrapper key={i} onClick={handleTopicClick}>
          <span className="material-icons-outlined">chat_bubble</span>
          <span>{t.name}</span>
          <span>0/100</span>
        </TopicsWrapper>
      );
    });
  };

  const badgeLabel =
    userData &&
    userData.given_name &&
    userData.family_name &&
    userData.given_name[0] + userData.family_name[0];

  return (
    <SideBarWrapper>
      <div>
        <section>
          <SearchWrapper>
            <span className="material-icons">search</span>
            <SearchInput
              placeholder="Search Topics"
              value={searchValue}
              onChange={debouncedSearch}
            />
          </SearchWrapper>
        </section>

        <section>{getTopicsList()}</section>
      </div>

      <div>
        <section>
          <div>
            <UserBadge isActive={true} hasShadow={true}>
              {badgeLabel}
            </UserBadge>
            <UserName>
              {userData && `${userData.given_name} ${userData.family_name}`}
            </UserName>
          </div>
          <LogoutButton onClick={handleLogout}>
            <span className="material-icons">logout</span>
          </LogoutButton>
        </section>
      </div>
    </SideBarWrapper>
  );
}

export default MessengerSideBar;

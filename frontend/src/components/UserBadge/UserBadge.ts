import styled, { css } from "styled-components";
import colors from "../../constants/colors";

interface UserBadge {
  isActive?: boolean;
  hasShadow?: boolean;
}

const UserBadge = styled.div<UserBadge>`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: ${colors.light.gray};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: ${colors.dark.black};
  cursor: pointer;
  position: relative;

  ${(props: UserBadge) =>
    props.hasShadow
      ? css`
          box-shadow: 1px 1px 3px #575656;
        `
      : null}

  ${(props: UserBadge) =>
    props.isActive
      ? css`
          &:after {
            content: "";
            width: 15px;
            height: 15px;
            border-radius: 7.5px;
            background-color: ${colors.light.green};
            position: absolute;
            top: 35px;
            right: 2px;
          }
        `
      : null}
`;

export default UserBadge;

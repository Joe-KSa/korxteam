import Dropdown from "../common/Dropdown";
import Button, { ButtonHoverStyle, ButtonStyle } from "../common/Button";

const DropdownModeration = () => {
  return (
    <Dropdown transform="translate3d(-64px, 54px, 0px)">
      <li role="item">
        <Button
          styleType={ButtonStyle.TEXT_ONLY}
          label="Proyectos"
          width="100%"
          justifyContent="start"
          iconMargin="0 5px 0 0"
          borderRadius="4px"
          href="/moderation/projects"
          hoverStyleType={ButtonHoverStyle.NORMAL}
          redirect
          // onClick={() => (window.location.href = "/moderation/projects")}
        />
      </li>
      <li role="item">
        <Button
          styleType={ButtonStyle.TEXT_ONLY}
          label="Miembros"
          width="100%"
          justifyContent="start"
          iconMargin="0 5px 0 0"
          borderRadius="4px"
          hoverStyleType={ButtonHoverStyle.NORMAL}
          redirect
          href="/moderation/members"
          // onClick={() => (window.location.href = "/moderation/members")}
        />
      </li>
    </Dropdown>
  );
};

export default DropdownModeration;

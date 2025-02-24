import Dropdown from "../common/Dropdown";
import Button, { ButtonHoverStyle, ButtonStyle } from "../common/Button";
import { BookIcon, RetoIcon } from "@/assets/icons";

const DrowpdownAddElement = () => {
  return (
    <Dropdown transform="translate3d(-64px, 54px, 0px)">
      <li role="item">
        <Button
          styleType={ButtonStyle.ICON_TEXT}
          label="Nuevo Proyecto"
          width="100%"
          justifyContent="start"
          redirect
          href="/new-project"
          iconMargin="0 5px 0 0"
          borderRadius="4px"
          hoverStyleType={ButtonHoverStyle.NORMAL}
        >
          <BookIcon className="medium-icon" />
        </Button>
      </li>
      <li role="item">
        <Button
          styleType={ButtonStyle.ICON_TEXT}
          label="Nuevo Reto"
          width="100%"
          justifyContent="start"
          iconMargin="0 5px 0 0"
          borderRadius="4px"
          hoverStyleType={ButtonHoverStyle.NORMAL}
        >
          <RetoIcon className="medium-icon"/>
        </Button>
      </li>
    </Dropdown>
  );
};

export default DrowpdownAddElement;

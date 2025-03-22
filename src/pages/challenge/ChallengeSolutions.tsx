import styles from "./styles/ChallengeSolutions.module.scss";
import WorkSpace from "@/components/ui/Workspace";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useChallenges } from "@/hooks/useChallenges";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "@/components/common/InputField";
import { tagProps } from "@/core/types";
import { languageSlugMap } from "./ChallengesItems";
import DiscordLogo from "@/assets/DiscordLogo.jpg";

const ChallengeSolutions = () => {
  const { id, language } = useParams();

  const { solutions, availableChallengeLanguages } = useChallenges(
    Number(id),
    language
  );

  const navigate = useNavigate();

  if (!solutions || !availableChallengeLanguages) return <div>Cargando...</div>;

  const handleChangeLanguage = (selected: tagProps) => {
    const slug = languageSlugMap[selected.name];

    navigate(`/challenge/${id}/solution/${slug}`);
  };

  const selectedLanguageTag = availableChallengeLanguages.find(
    (tag) => languageSlugMap[tag.name] === language
  );

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  return (
    <WorkSpace>
      <div className={styles.container}>
        <div
          className={styles.container__mask}
          style={
            {
              "--background-mask": getRandomColor(),
            } as React.CSSProperties
          }
        />
        <div className={styles.container__inner}>
          <div className={styles.container__header}>
            <h1 className={styles.container__header__title}>Soluciones</h1>
            <InputField
              type="select"
              valueSelected={selectedLanguageTag}
              options={availableChallengeLanguages}
              onChangeSelected={handleChangeLanguage}
              placeholderSelected="Lenguaje"
              showAllOptions
            />
          </div>

          {solutions?.map((solution) => (
            <div className={styles.card} key={solution.id}>
              <div className={styles.card__user}>
                <i>
                  <img
                    src={solution.creator.image}
                    draggable={false}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = DiscordLogo;
                      e.currentTarget.onerror = null;
                    }}
                  />
                </i>
                <span>{solution.creator.username}</span>
              </div>
              <div className={styles.card__content}>
                <SyntaxHighlighter
                  language={language}
                  style={atomOneDark}
                  customStyle={{
                    background: "#1b1b1b",
                    borderRadius: "4px",
                    minHeight: "100px",
                  }}
                >
                  {solution.code}
                </SyntaxHighlighter>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkSpace>
  );
};

export default ChallengeSolutions;

import { useEffect } from "react";
import styles from "./styles/ChallengeSolutions.module.scss";
import WorkSpace from "@/components/ui/Workspace";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useChallenges } from "@/hooks/useChallenges";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "@/components/common/InputField";
import { tagProps } from "@/core/types";
import { languageSlugMap } from "./ChallengesItems";

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

  return (
    <WorkSpace>
      <div className={styles.container}>
        <div className={styles.container__inner}>
          <h1 className={styles.container__header}>Soluciones</h1>
          <div>
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
                  <img src={solution.creator.image} draggable={false} alt="" />
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

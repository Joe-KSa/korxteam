import { JSX } from "react";
import { CplusIcon, JavaScriptIcon, PythonIcon, TagIcon } from "@/assets/icons";
import styles from "./styles/Challange.module.scss";
import Button, { ButtonStyle } from "@/components/common/Button";
import { useChallenges } from "@/hooks/useChallenges";
import { getChallengesProps, tagProps } from "@/core/types";
import { useUser } from "@/hooks/useUser";
import { Link } from "react-router-dom";


export const languageIcons = (size: "medium-icon" | "large-icon"): Record<string, JSX.Element> => ({
  JavaScript: <JavaScriptIcon className={size} />,
  Python: <PythonIcon className={size} />,
  "C++": <CplusIcon className={size} />,
});


export const languageSlugMap: Record<string, string> = {
  JavaScript: "javascript",
  Python: "python",
  "C++": "cpp",
};

export const ChallengeDetails = ({
  challenge,
}: {
  challenge: getChallengesProps;
}) => {
  const { user } = useUser();
  const firstLanguage = challenge.languages[0]?.name || "unknown";
  const languageSlug =
    languageSlugMap[firstLanguage] || firstLanguage.toLowerCase();

  return (
    <>
      <div className={styles.challengeItem__inner__left__title}>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreContainer__inner}>
            <div className={styles.scoreContainer__inner__content}>
              <span>{challenge.difficulty} krx</span>
            </div>
          </div>
        </div>
        {user ? (
          <Link
            to={`/challenge/${challenge.id}/${languageSlug}`}
            className={styles.challengeItem__inner__left__title__content}
          >
            {challenge.title}
          </Link>
        ) : (
          <span className={styles.challengeItem__inner__left__title__content}>
            {challenge.title}
          </span>
        )}
      </div>
      <div className={styles.challengeItem__inner__left__details}>
        <img src={challenge.creator.image} alt="" />
        {challenge.creator.username}
      </div>
    </>
  );
};

const ChallengeItem = ({ challenge }: { challenge: getChallengesProps }) => {
  const { user } = useUser();
  return (
    <div className={styles.challengeItem}>
      <div className={styles.challengeItem__inner}>
        <div className={styles.challengeItem__inner__left}>
          <ChallengeDetails challenge={challenge} />
          <div className={styles.challengeItem__inner__left__category}>
            <span>
              <TagIcon className="small-icon" />
            </span>
            {challenge.disciplines.map((discipline: tagProps) => (
              <div
                key={discipline.id}
                className={styles.challengeItem__inner__left__category__keyword}
              >
                {discipline.name}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.challengeItem__inner__right}>
          <ul>
            {challenge.languages.map((language: tagProps) => {
              const languageSlug =
                languageSlugMap[language.name] || language.name.toLowerCase();
              return (
                <li
                  key={language.id}
                  data-language={language.name.toLowerCase()}
                >
                  {user ? (
                    <Link to={`/challenge/${challenge.id}/${languageSlug}`}>
                      <div className={styles.languageContainer}>
                        {languageIcons("large-icon")[language.name]}
                      </div>
                    </Link>
                  ) : (
                    <div className={styles.languageContainer}>
                      {languageIcons("large-icon")[language.name]}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ChallengesItemsPage = () => {
  const { challenges } = useChallenges();

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  return (
    <main className={styles.container}>
      <div
        className={styles.container__mask}
        style={
          {
            "--background-mask": getRandomColor(),
          } as React.CSSProperties
        }
      ></div>
      <div className={styles.container__header}>
        <div className={styles.container__header__mask} />
        <div className={styles.container__header__inner}>
          <div className={styles.container__header__inner__wrapper}>
            <div className={styles.container__header__inner__wrapper__filters}>
              <Button
                styleType={ButtonStyle.TEXT_ONLY}
                label="Desafíos"
                backgroundColor="#fff"
                color="#121212"
                borderRadius="9999px"
              />
              <Button
                styleType={ButtonStyle.TEXT_ONLY}
                label="Activos"
                backgroundColor="#ffffff1a"
                borderRadius="9999px"
              />
              <Button
                styleType={ButtonStyle.TEXT_ONLY}
                label="Completados"
                backgroundColor="#ffffff1a"
                borderRadius="9999px"
              />
            </div>
          </div>
        </div>
      </div>
      <section className={styles.container__body}>
        <div className={styles.container__body__inner}>
          <section className={styles.container__body__inner__challenges}>
            {challenges.map((challenge) => (
              <ChallengeItem key={challenge.id} challenge={challenge} />
            ))}
          </section>
        </div>
      </section>
    </main>
  );
};

export default ChallengesItemsPage;

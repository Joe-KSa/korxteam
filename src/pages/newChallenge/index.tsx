import { useState, useEffect } from "react";
import Button, { ButtonStyle } from "@/components/common/Button";
import styles from "./styles/NewChallenge.module.scss";
import { BookIcon, DeleteIcon, SaveIcon, ShowIcon } from "@/assets/icons";
import InputField from "@/components/common/InputField";
import { ViewUpdate } from "@codemirror/view";
import CodeEditor from "@/components/common/CodeEditor";
import { SelectedEditor } from "@/components/widget/SelectedEditor";
import { useNavigate } from "react-router-dom";
import Dropdown from "@/components/common/Dropdown";
import { useChallengesById } from "@/hooks/useChallengesById";
import { useChallenges } from "@/hooks/useChallenges";
import { useParams } from "react-router-dom";
import {
  getUserChallengesProps,
  postChallengeProps,
  tagProps,
} from "@/core/types";
import { useUser } from "@/hooks/useUser";
import { languageIcons, languageSlugMap } from "../challenge/ChallengesItems";
import { MarkdownPreview } from "@/components/common/MarkdownPreview";
import { ChallengeService } from "@/core/services/challenge/challengeService";

const NewChallengePage = () => {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    title: "",
    description: "",
  });

  const [difficultyLevel, setDifficultyLevel] = useState<tagProps>();
  const [disciplines, setDisciplines] = useState<tagProps[]>([]);
  const [workspaceLanguage, setWorkSpaceLanguage] = useState<string[]>([]);
  const [languageId, setLanguageId] = useState<number | null>(null);
  const [code, setCode] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  const { devChallenges } = useChallengesById(user.id);

  // Dropdown
  const [showDevChallenges, setShowDevChallenges] = useState(false);

  // Carga de datos
  const { id, language } = useParams();
  const {
    challenge,
    disciplines: disciplinesItems,
    languageHint,
  } = useChallenges(Number(id), language);

  useEffect(() => {
    if (id && challenge) {
      setFormState({
        title: challenge.title || "",
        description: challenge.description
          .replace(/^"(.*)"$/, "$1")
          .replace(/\\n/g, "\n"),
      });

      setDifficultyLevel({
        id: challenge.difficulty,
        name: `Level ${challenge.difficulty}`,
      });
      setDisciplines(challenge.disciplines);
      setWorkSpaceLanguage(challenge.languages.map((l) => l.name));
    }
  }, [id, challenge]);

  useEffect(() => {
    if (id && challenge && languageHint) {
      setCode(languageHint.hint);
    }
  }, [id, challenge, languageHint]);

  const generateLevels = (count: number) =>
    [...Array(count)].map((_, i) => ({ id: i + 1, name: `Level ${i + 1}` }));

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDisciplinesChange = (newDiscipline: tagProps[]) => {
    setDisciplines(newDiscipline);
  };

  const handleSaveChallenge = async () => {
    try {
      if (languageId === null) {
        return alert("Ha ocurrido un error.");
      }

      if (!formState.title.trim() || !formState.description.trim()) {
        return alert("Por favor, rellena todos los campos.");
      }

      if (disciplines.length === 0) {
        return alert("Por favor, selecciona al menos una disciplina.");
      }

      const challengeData: postChallengeProps = {
        title: formState.title.trim(),
        description: JSON.stringify(formState.description.trim()),
        difficulty: difficultyLevel?.id || 1,
        creator: { id: user.id, username: user.username },
        disciplines: disciplines.map((d) => d.id),
        hint: code,
        languageId,
      };

      if (language && !workspaceLanguage.includes(language)) {
        setWorkSpaceLanguage([...workspaceLanguage, language]);
      }

      const challengeService = new ChallengeService();
      const response = id
        ? await challengeService.updateChallenge(Number(id), challengeData)
        : await challengeService.postChallenge(challengeData);

      if (response?.id) {
        alert("Reto guardado correctamente.");
        navigate(`/challenge/${response.id}/edit/${language}`);
      } else {
        alert("Error al guardar el reto.");
      }
    } catch (error) {
      console.error("Error al guardar el reto:", error);
      alert("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };

  const handleDeleteChallenge = async () => {
    if (!id) return;

    try {
      const challengeService = new ChallengeService();
      const response = await challengeService.deleteChallenge(Number(id));

      if (response.success) {
        alert("Reto eliminado correctamente.");
        navigate("/challenges");
      } else {
        alert("Error al eliminar el reto");
      }
    } catch (error) {
      console.error("Error al eliminar el reto:", error);
      alert("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };

  return (
    <main className={styles.container}>
      <form action="#">
        {/* Navbar */}
        <div className={styles.container__navbar}>
          <ul className={styles.container__navbar__actions}>
            <li id="save">
              <Button
                styleType={ButtonStyle.ICON_TEXT}
                label="Guardar"
                iconMargin="0 5px 0 0"
                onClick={() => handleSaveChallenge()}
              >
                <SaveIcon className="medium-icon" />
              </Button>
            </li>
            <li>
              <Button
                styleType={ButtonStyle.ICON_TEXT}
                label="Borrar"
                iconMargin="0 5px 0 0"
                onClick={() => handleDeleteChallenge()}
              >
                <DeleteIcon className="medium-icon" />
              </Button>
            </li>
          </ul>
          <ul className={styles.container__navbar__switch}>
            <li className={styles.container__navbar__switch__wrapper}>
              <div
                className={
                  styles.container__navbar__switch__wrapper__devChallenges
                }
                onClick={() => setShowDevChallenges(!showDevChallenges)}
              >
                Cambiar reto
              </div>
              {showDevChallenges && (
                <Dropdown transform="translate3d(0px, 45px, 0px)">
                  <li
                    className={styles.devChallengeItem}
                    key={0}
                    onClick={() => {
                      setFormState({ title: "", description: "" });
                      setDifficultyLevel({ id: 1, name: "Level 1" });
                      setDisciplines([]);
                      setWorkSpaceLanguage([]);
                      setLanguageId(null);
                      setCode("");
                      navigate("/challenge/new/javascript");
                    }}
                  >
                    <BookIcon className="medium-icon" />
                    Nuevo reto
                  </li>
                  {devChallenges.map((challenge: getUserChallengesProps) => (
                    <li
                      className={styles.devChallengeItem}
                      key={challenge.id}
                      onClick={() => {
                        navigate(
                          `/challenge/${challenge.id}/edit/${
                            languageSlugMap[challenge.languages[0].name]
                          }`
                        );
                      }}
                    >
                      <div className={styles.devChallengeItem__languages}>
                        {challenge.languages
                          .slice(0, 3)
                          .map((language: tagProps) => (
                            <i key={language.id} style={{ display: "flex" }}>
                              {languageIcons("medium-icon")[language.name]}
                            </i>
                          ))}
                      </div>
                      <span className={styles.devChallengeItem__title}>
                        {challenge.title}
                      </span>
                    </li>
                  ))}
                </Dropdown>
              )}
            </li>
          </ul>
        </div>

        {/* Form */}
        <div className={styles.container__form}>
          <div className={styles.container__form__inner}>
            <div>
              <div className={styles.container__form__inputs}>
                <InputField
                  label="Nombre:"
                  type="text"
                  htmlFor="Name"
                  value={formState.title}
                  placeholder="Dale un nombre al reto"
                  onChange={(value) => handleInputChange("title", value)}
                />

                <InputField
                  label="Nivel:"
                  type="select"
                  htmlFor="level"
                  valueSelected={difficultyLevel}
                  options={generateLevels(10)}
                  onChangeSelected={(value) => setDifficultyLevel(value)}
                />
                <InputField
                  label="Disciplina"
                  htmlFor="discipline"
                  type="skills"
                  itemsSkills={disciplines}
                  allSuggestionsSkills={disciplinesItems}
                  setItemsSkills={setDisciplines}
                  valueSkill={disciplines}
                  onChangeSkill={(value) => handleDisciplinesChange(value)}
                />
              </div>
            </div>
            <div className={styles.container__form__inner__header}>
              <Button
                styleType={ButtonStyle.TEXT_ONLY}
                label="Descripción"
                borderRadius="4px"
                backgroundColor={!showPreview ? "#1b1b1b" : "transparent"}
                onClick={() => setShowPreview(false)}
              />
              <Button
                styleType={ButtonStyle.ICON_TEXT}
                label="Preview"
                iconMargin="0 5px 0 0"
                backgroundColor={showPreview ? "#1b1b1b" : "transparent"}
                borderRadius="4px"
                onClick={() => setShowPreview(true)}
              >
                <ShowIcon className="medium-icon" />
              </Button>
            </div>
            <div
              className={styles.container__form__inner__body}
              style={{ padding: showPreview ? "1em" : "0" }}
            >
              {showPreview ? (
                <MarkdownPreview value={formState.description + "\\n &nbsp;"} />
              ) : (
                <CodeEditor
                  value={formState.description}
                  onChange={(value, _viewUpdate: ViewUpdate) =>
                    handleInputChange("description", value)
                  }
                  urlLanguage="markdown"
                />
              )}
            </div>
          </div>
          <SelectedEditor
            newChallenge
            workSpaceLanguage={workspaceLanguage}
            setWorkSpaceLanguage={setWorkSpaceLanguage}
            onLanguageChange={setLanguageId}
            value={code}
            onDataChange={(data) => setCode(data)}
          />
        </div>
      </form>
    </main>
  );
};

export default NewChallengePage;

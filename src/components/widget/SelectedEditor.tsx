import { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTags } from "@/hooks/useTags";
import InputField from "../common/InputField";
import styles from "./styles/SelectedEditor.module.scss";
import CodeEditor from "../common/CodeEditor";
import { tagProps } from "@/core/types";
import { ChallengeService } from "@/core/services/challenge/challengeService";
import {
  createLanguageSlugMap,
  createReverseLanguageMap,
  getAllowedTags,
} from "@/utils/languageUtils";

type SelectedEditorProps = {
  newChallenge: boolean;
  workSpaceLanguage?: string[];
  setWorkSpaceLanguage?: React.Dispatch<React.SetStateAction<string[]>>;
  onLanguageChange?: (languageId: number | null) => void;
  onDataChange?: (data: string) => void;
  value?: string;
  options?: string[];
};

export const SelectedEditor = ({
  newChallenge,
  workSpaceLanguage = [],
  setWorkSpaceLanguage = () => {},
  onLanguageChange = () => {},
  onDataChange = () => {},
  value = "",
  options,
}: SelectedEditorProps) => {
  const { tags } = useTags();
  const navigate = useNavigate();
  const { id, language } = useParams();

  // Generar mapeos dinámicamente desde los tags
  const languageSlugMap = useMemo(() => createLanguageSlugMap(tags), [tags]);

  const reverseLanguageMap = useMemo(
    () => createReverseLanguageMap(languageSlugMap),
    [languageSlugMap]
  );

  // Filtrar tags permitidos
  const allowedTags = useMemo(
    () => getAllowedTags(tags, options),
    [tags, options]
  );

  // Obtener lenguaje actual
  const currentLanguageName =
    reverseLanguageMap[language || "javascript"] || "JavaScript";

  const selectedLanguageTag = allowedTags.find(
    (tag) => tag.name === currentLanguageName
  );

  // Pasar el ID al padre
  useEffect(() => {
    onLanguageChange(selectedLanguageTag?.id || null);
  }, [selectedLanguageTag]);

  const handleChangeLanguage = (selected: tagProps) => {
    const slug = languageSlugMap[selected.name];

    if (!newChallenge && id) {
      navigate(`/challenge/${id}/${slug}`);
    } else {
      const isEditing = workSpaceLanguage.length > 0;
      const managing = isEditing ? id : "new";
      const editPath = isEditing ? "edit" : "";
      const newPath = `/challenge/${managing}/${editPath}/${slug}`.replace(
        "//",
        "/"
      );
      navigate(newPath);
    }
  };

  const handleRemoveWorkspaceLanguage = async (item: string) => {
    const slug = languageSlugMap[item] || item;
    setWorkSpaceLanguage((prev) => prev.filter((l) => l !== slug));

    if (!id) return;

    if (workSpaceLanguage.length === 1) {
      navigate("/challenge/new/javascript");
    }

    const response = await new ChallengeService().deleteChallengeLanguage(
      id,
      slug
    );

    if (response.success) {
      alert("Lenguaje de trabajo eliminado correctamente");

    } else {
      alert("Error al eliminar el lenguaje de trabajo");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <InputField
          type="select"
          options={allowedTags}
          valueSelected={selectedLanguageTag}
          onChangeSelected={handleChangeLanguage}
          itemsSelected={workSpaceLanguage.map(
            (lang) => reverseLanguageMap[lang] || lang
          )}
          placeholderSelected="Lenguaje"
          showAllOptions
          onRemoveSelectedIcon={handleRemoveWorkspaceLanguage}
        />
      </div>

      <span className={styles.container__editor__header}>Solución</span>
      <div className={styles.container__editor}>
        <div className={styles.container__editor__content}>
          <CodeEditor
            onChange={(newValue) => onDataChange(newValue)}
            value={value}
            lineNumbers
            foldGutter
            urlLanguage={languageSlugMap[currentLanguageName]}
          />
        </div>
      </div>
    </div>
  );
};

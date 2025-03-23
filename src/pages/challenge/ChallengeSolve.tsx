import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChallengeDetails } from "./ChallengesItems";
import { MarkdownPreview } from "@/components/common/MarkdownPreview";
import Button, { ButtonStyle } from "@/components/common/Button";
import { SelectedEditor } from "@/components/widget/SelectedEditor";
import { useChallenges } from "@/hooks/useChallenges";
import { ChallengeService } from "@/core/services/challenge/challengeService";
import Output, { OutputHandle } from "@/components/widget/Output";
import styles from "./styles/ChallengeSolve.module.scss";

const ChallengeSolvePage = () => {
  const { id, language } = useParams();
  const { challenge, languageHint, solution } = useChallenges(
    Number(id),
    language
  );
  const [codeSolution, setCodeSolution] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const outputRef = useRef<OutputHandle>(null);

  useEffect(() => {
    setCodeSolution(solution?.code || languageHint?.hint || "");
  }, [solution?.code, languageHint?.hint]);

  if (!challenge) return <div>Loading...</div>;

  const handleSaveSolution = async () => {
    try {
      if (!id || !language || !codeSolution) {
        alert("Debe seleccionar un lenguaje y escribir una solución.");
        return;
      }
      setIsSubmitting(true);
      const response = await new ChallengeService().postChallengeSolution(
        id,
        language,
        codeSolution
      );
      if (response.success) {
        alert("Solución guardada con éxito.");
        navigate(`/challenge/${id}/solution/${language}`);
      } else {
        alert("Error al guardar la solución. Intente de nuevo.");
      }
    } catch (error) {
      alert("Error al guardar la solución. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = () => {
    outputRef.current?.runCode();
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__left}>
        <ChallengeDetails challenge={challenge} />
        <div className={styles.container__left__header}>
          <span>Instrucciones </span>
        </div>
        <div className={styles.container__left__body}>
          <MarkdownPreview value={challenge?.description} />
        </div>
      </div>
      <div className={styles.container__right}>
        <SelectedEditor
          newChallenge={false}
          value={solution?.code || languageHint?.hint}
          options={challenge.languages.map((lang) => lang.name)}
          onDataChange={(value) => setCodeSolution(value)}
        />
        <Output
          ref={outputRef}
          language={language || "python"}
          sourceCode={codeSolution}
        />

        <div className={styles.container__right__footer}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              styleType={ButtonStyle.TEXT_ONLY}
              label="Testear"
              onClick={handleRunCode}
              padding="10px"
              borderRadius="4px"
              border
            />
            <Button
              styleType={ButtonStyle.TEXT_ONLY}
              label="Ver soluciones"
              padding="10px"
              redirect
              disabled={!solution?.code}
              href={`/challenge/${id}/solution/${language}`}
              borderRadius="4px"
              border
            />
          </div>
          <div>
            <Button
              styleType={ButtonStyle.TEXT_ONLY}
              label="Enviar"
              onClick={handleSaveSolution}
              padding="10px"
              borderRadius="4px"
              disabled={isSubmitting}
              border
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSolvePage;

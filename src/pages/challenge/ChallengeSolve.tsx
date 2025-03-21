import { MarkdownPreview } from "@/components/common/MarkdownPreview";
import styles from "./styles/ChallengeSolve.module.scss";
import { ChallengeDetails } from "./ChallengesItems";
import Button, { ButtonStyle } from "@/components/common/Button";
import { SelectedEditor } from "@/components/widget/SelectedEditor";
import { useChallenges } from "@/hooks/useChallenges";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ChallengeService } from "@/core/services/challenge/challengeService";

const ChallengeSolvePage = () => {
  const { id, language } = useParams();

  const { challenge, languageHint, solution } = useChallenges(
    Number(id),
    language
  );
  const [codeSolution, setCodeSolution] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      } else {
        alert("Error al guardar la solución. Intente de nuevo.");
      }
    } catch (error) {
      alert("Error al guardar la solución. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
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

        <div className={styles.container__right__footer}>
          <Button
            styleType={ButtonStyle.TEXT_ONLY}
            label="Resetear"
            padding="10px"
            borderRadius="4px"
            border
          />
          <div style={{ display: "flex", gap: "10px" }}>
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

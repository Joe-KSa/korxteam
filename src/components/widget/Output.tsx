import { ChallengeService } from "@/core/services/challenge/challengeService";
import { useState, useImperativeHandle, forwardRef } from "react";
import styles from "./styles/Output.module.scss";

export type OutputHandle = {
  runCode: () => void;
};

type OutputProps = {
  language: string;
  sourceCode: string;
};

const Output = forwardRef<OutputHandle, OutputProps>(
  ({ language, sourceCode }, ref) => {
    const [compiler, setCompiler] = useState<string>("");

    const runCode = async () => {
      if (!sourceCode) return;
      try {
        const { run: result } = await new ChallengeService().executeCode(
          language,
          sourceCode
        );
        setCompiler(result.output);
      } catch (err) {
        console.error("Error executing code:", err);
      }
    };

    useImperativeHandle(ref, () => ({
      runCode,
    }));

    return (
      <div className={styles.container}>
        <div className={styles.container__output}>
          <span className={styles.container__output__header}>Testeo</span>
          <div className={styles.container__output__content}>
            {compiler || ""}
          </div>
        </div>
      </div>
    );
  }
);

export default Output;

import { useEffect, useState, useCallback } from "react";
import { ChallengeService } from "@/core/services/challenge/challengeService";
import {
  ChallengeProps,
  ChallengeSolutionsResponse,
  getChallengeLanguageHint,
  getChallengesProps,
  getSolutionsProps,
  SolutionProps,
  tagProps,
} from "@/core/types";

export const useChallenges = (challengeId?: number, language?: string) => {
  const [challenges, setChallenges] = useState<getChallengesProps[]>([]);
  const [challenge, setChallenge] = useState<ChallengeProps | null>(null);
  const [disciplines, setDisciplines] = useState<tagProps[]>([]);
  const [languageHint, setLanguageHint] = useState<getChallengeLanguageHint>();
  const [solutions, setSolutions] = useState<SolutionProps[]>();
  const [availableChallengeLanguages, setAvailableChallengeLanguages] =
    useState<tagProps[]>([]);
  const [solution, setSolution] = useState<getSolutionsProps>();

  const loadChallenges = useCallback(async () => {
    const challengeData = await new ChallengeService().getChallenges();
    setChallenges(challengeData);
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const loadChallenge = useCallback(
    async (id: number) => {
      try {
        const challengeData = await new ChallengeService().getChallenge(id);
        setChallenge(challengeData);

        return challengeData;
      } catch (err) {
        console.error("Error loading challenge:", err);
      }
    },
    [setChallenge]
  );

  const loadLanguageHint = useCallback(
    async (id: number, language: string) => {
      try {
        const languageHintData = await new ChallengeService().getLanguageHint(
          id,
          language
        );
        setLanguageHint(languageHintData);
      } catch (err) {
        console.error("Error loading challenge:", err);
      }
    },
    [setLanguageHint]
  );

  const loadLanguageSolve = useCallback(
    async (id: number, language: string) => {
      try {
        const solutionData = await new ChallengeService().getSolution(
          String(id),
          language
        );
        // Si solutionData es null, significa que no se encontró solución
        if (solutionData) {
          setSolution(solutionData);
        }
      } catch (err) {
        console.error("Error posting solution:", err);
      }
    },
    [setSolution]
  );

  useEffect(() => {
    if (challengeId && language) {
      loadLanguageHint(challengeId, language);
    }
  }, [challengeId, language]);

  useEffect(() => {
    if (challengeId && language) {
      loadLanguageSolve(challengeId, language);
    }
  }, [challengeId, language]);

  useEffect(() => {
    if (challengeId) {
      loadChallenge(challengeId).then((challenge) => {
        if (challenge) {
          setChallenge(challenge);
        } else {
          setChallenge(null);
        }
      });
    }
  }, [challengeId]);

  const loadDisciplines = useCallback(async () => {
    try {
      const disciplinesData =
        await new ChallengeService().getChallengeDisciplines();
      setDisciplines(disciplinesData);
    } catch (err) {
      console.error("Error loading challenge disciplines:", err);
    }
  }, []);

  useEffect(() => {
    loadDisciplines();
  }, []);

  const loadSolutions = useCallback(
    async (id: number, language: string) => {
      try {
        const solutionsData: ChallengeSolutionsResponse =
          await new ChallengeService().getChallengeSolutions(
            String(id),
            language
          );

        setAvailableChallengeLanguages(solutionsData.availableLanguages);
        setSolutions(solutionsData.solutions);
      } catch (err) {
        console.error("Error loading challenge:", err);
      }
    },
    [setSolutions]
  );

  useEffect(() => {
    if (challengeId && language) {
      loadSolutions(challengeId, language);
    }
  }, [challengeId, language]);

  return {
    challenges,
    setChallenges,
    challenge,
    languageHint,
    disciplines,
    solutions,
    availableChallengeLanguages,
    solution,
  };
};

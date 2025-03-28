import { tagProps } from "@/core/types";

/**
 * Genera un mapeo de nombres de lenguaje a slugs.
 */
export const createLanguageSlugMap = (tags: tagProps[]) => {
  return tags.reduce((acc: Record<string, string>, tag) => {
    acc[tag.name] = tag.name.toLowerCase().replace(/\++/g, "pp").replace(/\#/g, "sharp");
    return acc;
  }, {});
};

/**
 * Genera un mapeo inverso de slugs a nombres de lenguaje.
 */
export const createReverseLanguageMap = (
  languageSlugMap: Record<string, string>
) => {
  return Object.entries(languageSlugMap).reduce(
    (acc: Record<string, string>, [name, slug]) => {
      acc[slug] = name;
      return acc;
    },
    {}
  );
};

/**
 * Filtra los tags permitidos en base a las opciones disponibles.
 */
export const getAllowedTags = (tags: tagProps[], options?: string[]) => {
  if (options?.length) {
    return tags.filter((tag) => options.includes(tag.name));
  }
  return tags.filter((tag) =>
    ["JavaScript", "C++", "Python", "GO", "Java", "C#"].includes(tag.name)
  );
};

/**
 * Mostrar versiones de los copiladores
 */

export const getCompilerVersions: Record<string, string> = {
  javascript: "18.15.0",
  cpp: "10.2.0",
  python: "3.10.0",
  csharp: "6.12.0",
  go: "1.16.2",
  java: "15.0.2",
  kotlin: "1.8.20",
  lua: "5.4.4",
  typescript: "5.0.3",
};

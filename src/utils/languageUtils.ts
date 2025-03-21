import { tagProps } from "@/core/types";

/**
 * Genera un mapeo de nombres de lenguaje a slugs.
 */
export const createLanguageSlugMap = (tags: tagProps[]) => {
  return tags.reduce((acc: Record<string, string>, tag) => {
    acc[tag.name] = tag.name.toLowerCase().replace(/\++/g, "pp");
    return acc;
  }, {});
};

/**
 * Genera un mapeo inverso de slugs a nombres de lenguaje.
 */
export const createReverseLanguageMap = (languageSlugMap: Record<string, string>) => {
  return Object.entries(languageSlugMap).reduce((acc: Record<string, string>, [name, slug]) => {
    acc[slug] = name;
    return acc;
  }, {});
};


/**
 * Filtra los tags permitidos en base a las opciones disponibles.
 */
export const getAllowedTags = (tags: tagProps[], options?: string[]) => {
  if (options?.length) {
    return tags.filter((tag) => options.includes(tag.name));
  }
  return tags.filter((tag) => ["JavaScript", "C++", "Python"].includes(tag.name));
};

export interface userProps {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  banner: string;
  bannerColor: string;
  createdAt: string;
  updatedAt: string;
  role: roleProps;
}

export interface imageProps {
  url: string;
  publicId: string;
}

export interface soundProps {
  url: string;
  path: string;
  type: string;
}

export interface memberImageProps {
  avatar: imageProps;
  banner: imageProps;
}

export interface memberProps {
  name: string;
  username: string;
  description: string;
  userId: string;
  github: string;
  phrase: string;
  primaryColor: string;
  secondaryColor: string;
  sound: soundProps;
  images: memberImageProps;
  createdAt: string;
  projectsCount: number;
  commentsCount: number;
  collaborationsCount: number;
}

export interface getMemberProps extends memberProps {
  id: number;
  hidden: boolean;
  role: roleProps;
  tags: tagProps[];
}

export interface postMemberProps extends memberProps {
  role: number | null;
  tags: (number | null)[];
}

export interface roleProps {
  id: number | null;
  name: string;
}

export interface tagProps {
  id: number | null;
  name: string;
}

export interface projectProps {
  title: string;
  description: string;
  repository: string;
  url: string;
  images: imageProps;
  members: getMemberProps[];
  tags: tagProps[];
  hidden: boolean;
}

export interface getProjectProps extends projectProps {
  id: number;
  likesCount: number;
  likes: Array<{ id: string; username?: string }>;
  creator: Pick<userProps, "id" | "name" | "username" | "image">;
}

export interface postProjectProps extends projectProps {
  creator: Pick<userProps, "id" | "username">;
  tags: (number | null)[];
  members: (number | null)[];
}

export interface fileFromCloudProps {
  publicId: string;
  url: string;
}

export interface fileFromSupabaseProps {
  soundPath: string;
  soundUrl: string;
}

export interface apiResponse {
  success: boolean;
  message?: string;
}

// Moderators

export interface moderatorProps {
  id: string;
  username: string;
  role: roleProps;
}

// Notifiactions

export interface NotificationProps {
  id: number;
  createdAt: string;
  message: string;
  project: {
    title: string;
    image: string;
  };
  sender: Pick<userProps, "name" | "image">;
  status: string;
}

// Comments
export interface PostComment {
  content: string;
  userId: string;
  parentCommentId: number | null;
}

// Challlenge

export interface ChallengeProps {
  id: number;
  title: string;
  description: string;
  creator: Pick<userProps, "id" | "name" | "username" | "image">;
  languages: tagProps[];
  disciplines: tagProps[];
  hint: string;
  language: tagProps;
  difficulty: number;
}

export type getChallengesProps = Omit<
  ChallengeProps,
  "description" | "hint" | "language"
>;

// User Challenge
export type getUserChallengesProps = Pick<
  ChallengeProps,
  "id" | "title" | "languages"
>;

export type getChallengeLanguageHint = Pick<
  ChallengeProps,
  "hint" | "language"
>;

export interface postChallengeProps {
  title: string;
  description: string;
  creator: {
    id: string;
    username: string;
  };
  disciplines: (number | null)[];
  hint: string;
  difficulty: number;
  languageId: number;
}

// Solutions

export interface SolutionProps {
  id: number;
  challengeId: number;
  creator: {
    id: string;
    username: string;
    name: string;
    image: string;
  };
  code: string;
  language: tagProps;
}

export type getSolutionsProps = Pick<SolutionProps, "code" | "language">;

export interface ChallengeSolutionsResponse {
  solutions: SolutionProps[];
  availableLanguages: TagsProps[];
}

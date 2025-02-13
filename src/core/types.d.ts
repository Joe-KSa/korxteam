export interface userProps {
  id: string;
  name: string;
  username: string
  email: string;
  image: string;
  banner: string;
  bannerColor: string;
  createdAt: string;
  writeAccess: 1 | 0;
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
  sound: soundProps
  hidden:  0 | 1 ;
  images: memberImageProps
  createdAt: string;
}

export interface getMemberProps extends memberProps {
  id: number;
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

export interface imageProps {
  url: string
  publicId: string; 
}

export interface projectProps {
  title: string;
  description: string;
  repository: string;
  url: string;
  images: imageProps;
}

export interface getProjectProps extends projectProps {
  id: number;
  members: getMemberProps[];
  tags: tagProps[];
  creator: Pick<memberProps, "id", "name", "username", "image">
}

export interface postProjectProps extends projectProps {
  tags: (number | null)[];
}

export interface postProjectMemberData {
  projectId: number;
  members: { memberId: number; roleId: number | null }[];
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
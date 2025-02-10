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
}

export interface memberProps {
  name: string;
  username: string;
  description: string;
  image: string;
  publicId: string;
  github: string;
  banner: string;
  publicBannerId: string
  phrase: string;
  primaryColor: string;
  secondaryColor: string;
  hidden:  0 | 1 ;
}

export interface getMemberProps extends memberProps {
  id: number;
  role: roleProps;
  tags: tagProps[];
  createdAt: string;
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
  image: string;
  publicId: string;
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
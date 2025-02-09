import { create } from "zustand";
import type {
  userProps,
  getProjectProps,
  getMemberProps,
  tagProps,
  roleProps,
} from "@/core/types";

interface projectStoreProps {
  projects: getProjectProps[];
  selectedProject: getProjectProps | null;
  setProjects: (projects: getProjectProps[]) => void;
  setSelectedProject: (project: getProjectProps | null) => void;
}

interface membersStoreProps {
  members: getMemberProps[];
  setMembers: (members: getMemberProps[]) => void;
  selectedMember: getMemberProps | null;
  setSelectedMember: (member: getMemberProps | null) => void;
}

interface tagsStoreProps {
  tags: tagProps[];
  setTags: (tags: tagProps[]) => void;
  suggestionsTags: tagProps[];
  setSuggestionsTags: (tags: tagProps[]) => void;
}

interface projectMembersStoreProps {
  projectMembers: getMemberProps[];
  setProjectMembers: (members: getMemberProps[]) => void;
}

interface rolesStoreProps {
  roles: roleProps[];
  setRoles: (roles: roleProps[]) => void;
}

interface userStore {
  user: userProps | null;
  setUser: (user: userProps | null) => void;
}

export const userStore = create<userStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const projectStore = create<projectStoreProps>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
}));

export const membersStore = create<membersStoreProps>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
  selectedMember: null,
  setSelectedMember: (member) => set({ selectedMember: member }),
}));

export const tagsStore = create<tagsStoreProps>((set) => ({
  tags: [],
  setTags: (tags) => set({ tags }),
  suggestionsTags: [],
  setSuggestionsTags: (tags) => set({ suggestionsTags: tags }),
}));

export const projectMembersStore = create<projectMembersStoreProps>((set) => ({
  projectMembers: [],
  setProjectMembers: (members) => set({ projectMembers: members }),
}));

export const rolStore = create<rolesStoreProps>((set) => ({
  roles: [],
  setRoles: (roles) => set({ roles }),
}));

// Tools
// store/store.ts

interface ImageStore {
  images: {
    imageUrl: string | null;
    bannerUrl: string | null;
    imageFile: File | null;
    bannerFile: File | null;
  };
  setImage: (field: 'image' | 'banner', file: File | null) => void;
}
export const useImageStore = create<ImageStore>((set) => ({
  images: {
    imageUrl: null,
    bannerUrl: null,
    imageFile: null,
    bannerFile: null,
  },
  setImage: (field, file) => {
    if (!file) {
      set(state => ({
        images: {
          ...state.images,
          [`${field}Url`]: null,
          [`${field}File`]: null
        }
      }));
      return;
    }
    
    const url = URL.createObjectURL(file);
    set(state => ({
      images: {
        ...state.images,
        [`${field}Url`]: url,
        [`${field}File`]: file
      }
    }));
  },
  clearStore: () => set({
    images: {
      imageUrl: null,
      bannerUrl: null,
      imageFile: null,
      bannerFile: null,
    }
  }),
}));
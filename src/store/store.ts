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
  projectDominantColor: string | null;
  setProjectDominantColor: (color: string | null) => void;
  showComments: boolean;
  setShowComments: (show: boolean) => void;
}

interface membersStoreProps {
  members: getMemberProps[];
  setMembers: (members: getMemberProps[]) => void;
  selectedMember: getMemberProps | null;
  setSelectedMember: (member: getMemberProps | null) => void;
  hiddenMembers: getMemberProps[] | null
  setHiddenMembers: (members: getMemberProps[]) => void;
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
  hasFetched: boolean;
  setHasFetched: (fetched: boolean) => void;
}

export const userStore = create<userStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  hasFetched: false,
  setHasFetched: (fetched) => set({ hasFetched: fetched }),
}));

export const projectStore = create<projectStoreProps>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  projectDominantColor: null,
  setProjectDominantColor: (color) => set({ projectDominantColor: color }),
  showComments: false,
  setShowComments: (showComments) => set({ showComments }),
}));

export const membersStore = create<membersStoreProps>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
  selectedMember: null,
  setSelectedMember: (member) => set({ selectedMember: member }),
  hiddenMembers: null,
  setHiddenMembers: (members) => set({ hiddenMembers: members }),
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

// Audio
interface AudioStore {
  audio: {
    audioUrl: string | null;
    audioFile: File | null;
  };
  setAudio: (file: File | null) => void;
  clearAudio: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  audio: {
    audioUrl: null,
    audioFile: null,
  },
  setAudio: (file) => {
    if (!file) {
      set({
        audio: {
          audioUrl: null,
          audioFile: null,
        },
      });
      return;
    }

    const url = URL.createObjectURL(file);
    set({
      audio: {
        audioUrl: url,
        audioFile: file,
      },
    });
  },
  clearAudio: () => {
    set((state) => {
      if (state.audio.audioUrl) {
        URL.revokeObjectURL(state.audio.audioUrl);
      }
      return {
        audio: {
          audioUrl: null,
          audioFile: null,
        },
      };
    });
  },
}));
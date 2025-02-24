declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly BACKEND_URI: string;
  readonly FRONTEND_URI: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.ico" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}
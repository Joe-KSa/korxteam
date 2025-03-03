import { type JSX } from "react";
import styles from "./styles/SkillTags.module.scss";
import * as icon from "@/assets/icons";
import { useMembers } from "@/hooks/useMembers";

interface SkillTagsProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
  children?: React.ReactNode;
  centerContent?: boolean;
  onlyIcon?: boolean;
  activeGradient?: boolean;
  enableTooltip?: boolean;
  size?: "small-icon" | "medium-icon" | "large-icon";
}

const SkillTags: React.FC<SkillTagsProps> = ({
  tags,
  size,
  onRemoveTag,
  children,
  centerContent,
  onlyIcon = false,
  activeGradient = false,
  enableTooltip = false,
}) => {
  const { selectedMember } = useMembers();

  const iconClassName = `${size || "small-icon"}`;

  const tagIcons: Record<string, JSX.Element | null> = {
    python: <icon.PythonIcon className={iconClassName} />,
    "c#": <icon.CsharpIcon className={iconClassName} />,
    php: <icon.PhpIcon className={iconClassName} />,
    javascript: <icon.JavaScriptIcon className={iconClassName} />,
    sql: <icon.SqlIcon className={iconClassName} />,
    go: <icon.GoIcon className={iconClassName} />,
    lua: <icon.LuaIcon className={iconClassName} />,
    css: <icon.CssIcon className={iconClassName} />,
    html: <icon.HtmlIcon className={iconClassName} />,
    sass: <icon.SassIcon className={iconClassName} />,
    typescript: <icon.TypescriptIcon className={iconClassName} />,
    rust: <icon.RustIcon className={iconClassName} />,
    java: <icon.JavaIcon className={iconClassName} />,
    angular: <icon.AngularIcon className={iconClassName} />,
    react: <icon.ReactIcon className={iconClassName} />,
    express: <icon.ExpressIcon className={iconClassName} />,
    "c++": <icon.CplusIcon className={iconClassName} />,
    node: <icon.NodeIcon className={iconClassName} />,
    "next.js": <icon.NextJsIcon className={iconClassName} />,
    unity: <icon.UnityIcon className={iconClassName} />,
    mongodb: <icon.MongoDBIcon className={iconClassName} />,
    docker: <icon.DockerIcon className={iconClassName} />,
    ruby: <icon.RubyIcon className={iconClassName} />,
    swift: <icon.SwiftIcon className={iconClassName} />,
    kotlin: <icon.KotlinIcon className={iconClassName} />,
    redis: <icon.RedisIcon className={iconClassName} />,
    redux: <icon.ReduxIcon className={iconClassName} />,
    vue: <icon.VueIcon className={iconClassName} />,
    prisma: <icon.PrismaIcon className={iconClassName} />,
    drizzle: <icon.DrizzleIcon className={iconClassName} />,
    svelte: <icon.SvelteIcon className={iconClassName} />,
    astro: <icon.AstroIcon className={iconClassName} />,
    "tailwind css": <icon.TailwindIcon className={iconClassName} />,
    julia: <icon.JuliaIcon className={iconClassName} />,
    gml: <icon.GMLIcon className={iconClassName} />,
    nim: <icon.NimIcon className={iconClassName} />,
    cobol: <icon.CobolIcon className={iconClassName} />,
    dart: <icon.DartIcon className={iconClassName} />,
    blender: <icon.BlenderIcon className={iconClassName} />,
    godot: <icon.GodotIcon className={iconClassName} />,
    unreal: <icon.UnrealIcon className={iconClassName} />,
    flutter: <icon.FlutterIcon className={iconClassName} />,
    turso: <icon.TursoIcon className={iconClassName} />,
    laravel: <icon.LaravelIcon className={iconClassName} />,
    aseprite: <icon.AsepriteIcon className={iconClassName} />,
    aws: <icon.AWSIcon className={iconClassName} />,
    nestjs: <icon.NestjsIcon className={iconClassName} />,
    azure: <icon.AzureIcon className={iconClassName} />,
    django: <icon.DjangoIcon className={iconClassName} />,
    flask: <icon.FlaskIcon className={iconClassName} />,
  };

  const getIcon = (tag: string) => tagIcons[tag.toLowerCase()] || null;

  return (
    <div
      className={`${styles.container} ${
        centerContent ? styles.container__center : ""
      }`}
    >
      {tags.map((tag, index) => (
        <div
          className={`${styles.tagContainer} ${
            !onlyIcon ? styles.tagContainer__text : ""
          } ${
            activeGradient &&
            (selectedMember?.primaryColor || selectedMember?.secondaryColor)
              ? styles.tagContainer__gradient
              : ""
          }`}
          key={`${tag}-${index}`}
        >
          <div className={styles.tagContent}>
            {!onlyIcon && (
              <div className={styles.tagContent__circleContainer}>
                <span
                  className={styles.tagContent__circleContainer__circle}
                  data-tag={tag.toLocaleLowerCase() || "default"}
                >
                  {onRemoveTag && (
                    <div
                      className={styles.tagRemove}
                      onClick={() => onRemoveTag(tag)}
                    >
                      X
                    </div>
                  )}
                </span>
              </div>
            )}
            <div
              className={styles.tagContent__text}
              data-tooltip={enableTooltip ? tag : undefined}
              >
              <i
                className={
                  onlyIcon
                    ? styles.tagContent__text__centerIcon
                    : styles.tagContent__text__gapText
                }
              >
                {getIcon(tag)}
              </i>
              {!onlyIcon && <span>{tag}</span>}
            </div>
          </div>
        </div>
      ))}
      {children}
    </div>
  );
};

export default SkillTags;

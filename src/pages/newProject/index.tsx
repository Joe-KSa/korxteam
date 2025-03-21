import { useRef, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import OverviewSection from "@/components/ui/OverviewSection";
import DetailsSection from "@/components/ui/DetailsSection";
import WorkSpace from "@/components/ui/Workspace";
import InputField from "@/components/common/InputField";
import styles from "./styles/newProject.module.scss";
import { useProjects } from "@/hooks/useProjects";
import ProjectCardPreview from "@/components/ui/ProjectCardPreview";
import { postProjectProps, tagProps } from "@/core/types";
import useDominantColor from "@/hooks/useDominantColor";
import TableMembers from "@/components/widget/TableMembers";
import Button, {
  ButtonHoverStyle,
  ButtonStyle,
} from "@/components/common/Button";
import { SwapIcon } from "@/assets/icons";
import useVisibilityObserver from "@/hooks/useVisibilityObserver";
import { useUser } from "@/hooks/useUser";
import { useMembers } from "@/hooks/useMembers";
import {
  handleImageUpload,
  ERROR_MESSAGES,
  handleDeleteImage,
} from "@/utils/handleUpload";
import { ProjectService } from "@/core/services/project/projectService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTags } from "@/hooks/useTags";

const DEFAULT_FORM_STATE = {
  title: "Insertar texto",
  description: "",
  repository: "",
  url: "",
  creator: { id: "", username: "" },
  images: { url: "", publicId: "", file: null as File | null },
};

const NewProjectPage = () => {
  // Hooks y estado basico
  const { user } = useUser();
  const { members } = useMembers();
  const location = useLocation();
  const isEditing = location.pathname.includes("/edit");
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  // Refs y observacion de visibilidad
  const projectFormRef = useRef<HTMLDivElement>(null);
  const isOverviewSectionVisible = useVisibilityObserver(
    projectFormRef as React.RefObject<HTMLElement>
  );

  const {
    projectDominantColor,
    setProjectDominantColor,
    setSelectedProject,
    selectedProject,
  } = useProjects();

  const { tags: tagsItems } = useTags();

  // Estado del proyecto y formulario
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [tags, setTags] = useState<tagProps[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  // Efectos de color dominante
  const imageUrl = formState.images.url || "";
  const calculatedColor = useDominantColor(imageUrl);

  const handleDeleteProject = async (projectId: number) => {
    if (!selectedProject) return;

    if (!window.confirm("¿Estás seguro que deseas borrar este proyecto?")) {
      return;
    }

    try {
      // Eliminar la imagen del proyecto en Cloudinary antes de borrar el proyecto
      if (selectedProject.images.publicId) {
        await handleDeleteImage(selectedProject.images.publicId);
      }

      // Eliminar el proyecto de la base de datos
      const response = await new ProjectService().deleteProject(projectId);

      if (response.success) {
        alert("El proyecto ha sido eliminado con éxito.");
      } else {
        throw new Error("Error al eliminar el proyecto.");
      }
    } catch (error) {
      console.error("Error eliminando el proyecto:", error);
      alert("Ocurrió un error al intentar eliminar el proyecto.");
    }
    setSelectedProject(null);
    navigate("/");
  };

  // Hooks
  useEffect(() => {
    if (isEditing && selectedProject?.members) {
      setSelectedMembers((prev) => [
        ...new Set([...prev, ...selectedProject.members.map((m) => m.id)]),
      ]);
    }
  }, [selectedProject?.id]);

  useEffect(() => {
    return () => {
      if (formState.images.url.startsWith("blob:")) {
        URL.revokeObjectURL(formState.images.url);
      }
    };
  }, [formState.images.url]);

  useEffect(() => {
    setProjectDominantColor(calculatedColor);
  }, [calculatedColor, setProjectDominantColor]);

  useEffect(() => {
    if (isEditing && selectedProject?.members) {
      const initialMemberIds = selectedProject.members.map((m) => m.id);
      setSelectedMembers((prev) => [
        ...new Set([...prev, ...initialMemberIds]), // Combinar sin duplicados
      ]);
    }
  }, [selectedProject, isEditing]);

  const currentUserMember = members.find(
    (member) => member.userId === user?.id
  );

  if (!currentUserMember) {
    console.error("El usuario actual no es un miembro registrado.");
    return <div>Loading...</div>;
  }

  const initializeProjectState = useCallback(() => {
    if (!user || !currentUserMember) return;

    if (isEditing && projectId) {
      new ProjectService()
        .getProjectById(Number(projectId))
        .then((projectData) => {
          if (!projectData) return;
          setFormState({
            ...projectData,
          });
          const projectMemberIds =
            projectData.members?.map((m: any) => m.id) || [];
          setSelectedMembers(projectMemberIds);

          setTags(projectData.tags || []);
          setSelectedProject(projectData);
        });
    } else {
      setFormState({
        ...DEFAULT_FORM_STATE,
      });
      setSelectedMembers([currentUserMember.id]);
      setProjectDominantColor(null);
      setTags([]);
      setSelectedProject(null);
      return;
    }
  }, [user, isEditing, setSelectedProject, setProjectDominantColor]);

  useEffect(() => {
    initializeProjectState();
  }, [location.pathname]);

  // Handlers de miembros
  const handleAddMember = useCallback(() => {
    if (!searchQuery.trim()) return;

    const foundMember = members.find(
      (m) => m.username.toLowerCase() === searchQuery.toLowerCase()
    );

    if (!foundMember) return setSearchError("Usuario no encontrado");

    if (foundMember.id === currentUserMember.id) {
      return setSearchError("Este miembro ya está agregado");
    }

    if (selectedMembers.includes(foundMember.id)) {
      return setSearchError("Este miembro ya está agregado");
    }

    setSelectedMembers((prev) => [...prev, foundMember.id]);
    setSearchQuery("");
    setSearchError("");
  }, [searchQuery, members, selectedMembers]);

  const handleToggleView = () => {
    setShowForm((prev) => !prev);
  };

  const handleTagsChange = (newTags: tagProps[]) => {
    setTags(newTags);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !currentUserMember.id) return;

    if (
      !formState.title.trim() ||
      !formState.description.trim() ||
      tags.length === 0
    ) {
      alert(
        "Los campos imagen, titulo, descripcion, tecnologias son requeridos."
      );
      return;
    }

    if (!formState.images.url) {
      alert("La imagen es requerida");
      return;
    }

    // Variable para almacenar la información de la imagen subida
    let uploadedImage: { imageUrl: string; publicId: string } | null = null;
    setIsSubmitting(true);

    try {
      // Subir la imagen y guardar su data
      const { url: imageUrl, publicId } = await handleImageUpload(
        formState.images.file,
        formState.images.publicId
      );
      uploadedImage = { imageUrl, publicId };

      const finalMembers = [
        ...new Set(
          [
            ...selectedMembers,
            selectedProject?.creator.id || currentUserMember.id,
          ]
            .map((id) => (typeof id === "string" ? parseInt(id, 10) : id)) // Convierte strings a números
            .filter((id) => !isNaN(id as number)) // Filtra NaN por si `parseInt` falla
        ),
      ];

      const projectData: Omit<postProjectProps, "hidden"> = {
        title: formState.title,
        description: formState.description,
        repository: formState.repository,
        url: formState.url,
        creator: {
          id: user.id,
          username: user.username,
        },
        images: {
          url: imageUrl,
          publicId,
        },
        tags: tags.map((t) => t.id),
        members: finalMembers,
      };

      let response;

      if (isEditing && selectedProject?.id) {
        response = await new ProjectService().updateProject(
          selectedProject.id,
          projectData
        );
      } else {
        response = await new ProjectService().createProject(projectData);
      }

      if (response.success) {
        alert(
          isEditing
            ? "El proyecto ha sido actualizado con éxito. Espera que un administrador lo acepte"
            : "El proyecto ha sido creado con éxito. Espera que un administrador lo acepte"
        );
        navigate("/");
        setSelectedProject(null);
      } else {
        // Si el proyecto no se crea (por ejemplo, por límite excedido en Redis), se lanza error
        throw new Error("Limite superado");
      }
    } catch (e) {
      console.error("Limite superado:", e);
      // Si ya se subió la imagen pero ocurrió un error, eliminarla de Cloudinary
      if (uploadedImage && uploadedImage.publicId) {
        try {
          await handleDeleteImage(uploadedImage.publicId);
        } catch (deleteError) {
          console.error(
            "Error eliminando la imagen de Cloudinary:",
            deleteError
          );
        }
      }
      alert(ERROR_MESSAGES.uploadProjectFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      if (event.target.type !== "textarea") {
        event.preventDefault();
      }
    }
  };

  return (
    <WorkSpace>
      <OverviewSection>
        <ProjectCardPreview
          project={{
            ...formState,
            tags,
            members: members.filter((m) => selectedMembers.includes(m.id)),
          }}
          dominantColor={projectDominantColor || ""}
          onImageChange={(imageUrl, file) =>
            setFormState((prev) => ({
              ...prev,
              images: { ...prev.images, url: imageUrl, file: file },
            }))
          }
        />
      </OverviewSection>
      <DetailsSection>
        <div className={styles.actions} ref={projectFormRef}>
          <div className={styles.actions__inner}>
            <div className={styles.actions__inner__wrapper}>
              <div className={styles.actions__inner__wrapper__swapper}>
                <Button
                  styleType={ButtonStyle.ICON}
                  backgroundColor="#121212"
                  padding="16px"
                  borderRadius="9999px"
                  onClick={handleToggleView}
                >
                  <SwapIcon className="large-icon" />
                </Button>
              </div>
              {/* Barra de búsqueda */}
              {!showForm ? (
                <div className={styles.searchContainer}>
                  <div className={styles.searchContainer__content}>
                    <input
                      type="text"
                      placeholder="Buscar miembros..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchError("");
                      }}
                      onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
                      className={styles.searchInput}
                    />
                    <Button
                      styleType={ButtonStyle.TEXT_ONLY}
                      label="Invitar"
                      onClick={handleAddMember}
                      hoverStyleType={ButtonHoverStyle.SCALE}
                    />
                  </div>

                  {searchError && (
                    <span className={styles.errorMessage}>{searchError}</span>
                  )}
                </div>
              ) : (
                <>
                  {isEditing && selectedProject && (
                    <div>
                      <Button
                        styleType={ButtonStyle.TEXT_ONLY}
                        label="Borrar Proyecto"
                        hoverStyleType={ButtonHoverStyle.SCALE}
                        backgroundColor="#121212"
                        onClick={() => handleDeleteProject(selectedProject.id)}
                        borderRadius="4px"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Máscara de color */}
        <div
          className={styles.mask}
          style={{
            backgroundColor: projectDominantColor || "",
          }}
        ></div>

        {/* Alterna entre el formulario y la tabla de miembros */}
        {showForm ? (
          <form
            className={styles.container}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.container__form}>
              <div className={styles.presentation}>
                <h1>{isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}</h1>
              </div>

              <InputField
                label="Título"
                type="text"
                maxLength={20}
                htmlFor="title"
                value={formState.title}
                onChange={(value) =>
                  setFormState({ ...formState, title: value })
                }
              />
              <InputField
                label="Descripción"
                type="textarea"
                maxLength={150}
                htmlFor="description"
                value={formState.description}
                onChange={(value) =>
                  setFormState({ ...formState, description: value })
                }
              />
              <InputField
                label="Tecnologías"
                type="skills"
                htmlFor="skills"
                maxLength={5}
                valueSkill={tags}
                itemsSkills={tags}
                setItemsSkills={setTags}
                allSuggestionsSkills={tagsItems}
                onChangeSkill={(value) => handleTagsChange(value)}
              />
              <InputField
                label="Repositorio"
                type="text"
                maxLength={75}
                htmlFor="repository"
                optional
                value={formState.repository}
                onChange={(value) =>
                  setFormState({ ...formState, repository: value })
                }
              />
              <InputField
                label="URL del Proyecto"
                type="text"
                maxLength={75}
                htmlFor="url"
                optional
                value={formState.url}
                onChange={(value) => setFormState({ ...formState, url: value })}
              />
            </div>
            <div>
              <Button
                styleType={ButtonStyle.TEXT_ONLY}
                label="Guardar cambios"
                backgroundColor="#202020"
                borderRadius="4px"
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        ) : (
          <TableMembers
            isOverviewSectionVisible={isOverviewSectionVisible}
            selectedMemberIds={selectedMembers}
            creatorId={
              isEditing
                ? Number(selectedProject?.creator.id)
                : currentUserMember.id
            }
            onRemoveMember={(memberId) => {
              const currentCreatorId = isEditing
                ? selectedProject?.creator.id
                : currentUserMember.id;

              // Solo permite eliminar si no es el creador
              if (memberId !== currentCreatorId) {
                setSelectedMembers((prev) =>
                  prev.filter((id) => id !== memberId)
                );
              }
            }}
          />
        )}
      </DetailsSection>
    </WorkSpace>
  );
};

export default NewProjectPage;

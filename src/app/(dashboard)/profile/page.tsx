"use client";

import { use, useState, useEffect } from "react";
import { AuthContext } from "../../../Contexts/AuthContext";
import { PageTitle } from "../../../components/PageTitle";
import { TextInput } from "../../../components/TextInput";
import { Button } from "../../../components/Button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Loader from "react-spinners/ClipLoader";
import { MdPhotoCamera } from "react-icons/md";
import Image from "next/image";
import { updateAvatar, updateUser } from "../../../services/queries/User";

const profileSchema = z.object({
  name: z.string()
    .min(1, "O campo nome é obrigatório."),
  email: z.string()
    .min(1, "O campo email é obrigatório.")
    .email("Digite um email válido.")
});

export default function Profile() {
  const { user, updateUserData } = use(AuthContext);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.avatar ?? null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
    validators: {
      onSubmit: profileSchema,
    },
  });

  useEffect(() => {
    if (user) {
      console.log(user.avatar)
      form.setFieldValue("name", user.name);
      form.setFieldValue("email", user.email);

      if (user.avatar) {
        setProfilePicture(user.avatar);
      }
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: {email: string, name: string}) => updateUser(user!._id, data),
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ['fetchUserAccessData'] });
      setIsEditing(false);
    },
    onError: (error) => {
      if(isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error("Ocorreu um erro ao atualizar o perfil. Tente novamente em instantes.");
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (data: FormData) => updateAvatar(data),
    onSuccess: (data) => {
      console.log(data)
      updateUserData(data)
      toast.success("Avatar atualizado com sucesso.");
    },
    onError: (error) => {
      if(isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }else {
        toast.error("Ocorreu um erro ao atualizar avatar. Tente novamente em instantes.");
      }
    }
  });

  async function handleSubmit(data: { email: string, name: string}) {
    await updateProfileMutation.mutateAsync(data);
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 3 * 1024 * 1024) {
      toast.error("A imagem deve ser menor que 5MB.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);


      await uploadAvatarMutation.mutateAsync(formData)
    } catch {
      toast.error("Erro ao fazer upload da imagem. Tente novamente.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col w-full h-full items-center bg-white shadow-lg rounded-lg px-10 py-5">
        <PageTitle title="Perfil do Usuário" />
        <Loader
          color={"#4f46e5"}
          loading={true}
          size={60}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg px-10 py-5 w-full h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="rounded-full p-2 hover:text-primary-500 transition text-primary-400 cursor-pointer"
            onClick={() => router.back()}
          >
            <IoIosArrowBack size={30} />
          </div>
          <PageTitle title="Perfil do Usuário" />
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary-400 hover:text-primary-500 hover:underline transition"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700 hover:underline transition"
            >
              Cancelar
            </button>
            <form.Subscribe>
              {({ canSubmit, isSubmitting }) => (
                <Button 
                  type="submit"
                  disabled={!canSubmit}
                  size="small"
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ?
                    <Loader
                      color={"#FFF"}
                      loading={isSubmitting}
                      size={20}
                    />
                  : 'Salvar'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4">
          {uploadAvatarMutation.isPending ? (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <Loader color={"#4f46e5"} loading={true} size={40} />
            </div>
          ) : profilePicture ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/images/avatars/${profilePicture}`}
              alt="Foto de perfil"
              fill
              className="rounded-full object-contain border-solid border-1 border-gray-300"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-500">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <label 
            className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition"
            htmlFor="profile-picture-upload"
          >
            <MdPhotoCamera size={24} />
            <input 
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </label>
        </div>
        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500 mt-1">
          Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6 mx-auto md:w-1/3"
      >
        <div className="w-full">
          <form.Field name="name">
            {(field) => (
              <TextInput
                id={field.name}
                label="Nome"
                type="text"
                value={field.state.value}
                onChange={(text) => field.handleChange(text)}
                placeholder="Seu nome completo"
                required={true}
                className="w-full"
                disabled={!isEditing}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>
        </div>

        <div className="w-full">
          <form.Field name="email">
            {(field) => (
              <TextInput
                id={field.name}
                label="Email"
                type="email"
                value={field.state.value}
                onChange={(text) => field.handleChange(text)}
                placeholder="Seu endereço de email"
                required={true}
                className="w-full"
                disabled={!isEditing}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>
        </div>
      </form>
    </div>
  );
}
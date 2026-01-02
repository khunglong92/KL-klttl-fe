import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContactInfoCrud } from "./hooks/use-contact-info-crud";
import {
  TextInput,
  Textarea,
  Card,
  Skeleton,
  Group,
  NumberInput,
  Stack,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import AppButton from "@/components/atoms/app-button";
import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";

import { useTranslation } from "react-i18next";

const getContactSchema = (t: any) =>
  z.object({
    companyName: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required")),
    address: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required")),
    phone: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required"))
      .regex(
        /^[0-9]+$/,
        t("admin.contactUsManager.form.validation.phoneInvalid")
      ),
    email: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required"))
      .email({
        message: t("admin.contactUsManager.form.validation.emailInvalid"),
      }),
    workingHours: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required")),
    googleMapUrl: z.string().optional().or(z.literal("")),
    foundingDate: z.string().optional().or(z.literal("")),
    companyType: z.string().optional().or(z.literal("")),
    aboutUs: z.string().optional().or(z.literal("")),
    yearsOfExperience: z.number().int().min(0).optional().or(z.literal(0)),
    projectsCompleted: z.number().int().min(0).optional().or(z.literal(0)),
    satisfiedClients: z.number().int().min(0).optional().or(z.literal(0)),
    satisfactionRate: z
      .number()
      .int()
      .min(0)
      .max(100)
      .optional()
      .or(z.literal(0)),
    mission: z.string().optional().or(z.literal("")),
    vision: z.string().optional().or(z.literal("")),
    facilitiesIntro: z.string().optional().or(z.literal("")),
    profileIntro: z.string().optional().or(z.literal("")),
  });

type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;

function ContactInfoSkeleton() {
  return (
    <Stack gap="md" p="lg">
      <Skeleton height={40} radius="md" />
      <Skeleton height={40} radius="md" />
      <Skeleton height={100} radius="md" />
      <Skeleton height={40} radius="md" />
    </Stack>
  );
}

export default function ContactInfoForm() {
  const { t } = useTranslation();
  const contactSchema = getContactSchema(t);
  const { isFetching, isSaving, submit, initialData } = useContactInfoCrud();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      companyName: "",
      address: "",
      phone: "",
      email: "",
      workingHours: "",
      googleMapUrl: "",
      foundingDate: "",
      companyType: "",
      aboutUs: "",
      yearsOfExperience: 0,
      projectsCompleted: 0,
      satisfiedClients: 0,
      satisfactionRate: 0,
      mission: "",
      vision: "",
      facilitiesIntro: "",
      profileIntro: "",
    },
  });

  // Watch values for rich text editors
  const aboutUsValue = watch("aboutUs");
  const missionValue = watch("mission");
  const visionValue = watch("vision");
  const facilitiesIntroValue = watch("facilitiesIntro");
  const profileIntroValue = watch("profileIntro");

  // Rich Text Editor for "Giới thiệu về chúng tôi"
  const aboutUsEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: aboutUsValue || "",
    onUpdate: ({ editor }) => {
      setValue("aboutUs", editor.getHTML(), { shouldDirty: true });
    },
  });

  // Rich Text Editor for "Sứ mệnh"
  const missionEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: missionValue || "",
    onUpdate: ({ editor }) => {
      setValue("mission", editor.getHTML(), { shouldDirty: true });
    },
  });

  // Rich Text Editor for "Tầm nhìn"
  const visionEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: visionValue || "",
    onUpdate: ({ editor }) => {
      setValue("vision", editor.getHTML(), { shouldDirty: true });
    },
  });

  // Rich Text Editor for "Cơ sở vật chất"
  const facilitiesIntroEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: facilitiesIntroValue || "",
    onUpdate: ({ editor }) => {
      setValue("facilitiesIntro", editor.getHTML(), { shouldDirty: true });
    },
  });

  // Rich Text Editor for "Hồ sơ năng lực"
  const profileIntroEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: profileIntroValue || "",
    onUpdate: ({ editor }) => {
      setValue("profileIntro", editor.getHTML(), { shouldDirty: true });
    },
  });

  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD for input[type="date"]
      const formattedData = {
        ...initialData,
        foundingDate: initialData.foundingDate
          ? new Date(initialData.foundingDate).toISOString().split("T")[0]
          : "",
      };

      reset(formattedData);

      // Update rich text editors with initial data
      if (aboutUsEditor && initialData.aboutUs) {
        aboutUsEditor.commands.setContent(initialData.aboutUs);
      }
      if (missionEditor && initialData.mission) {
        missionEditor.commands.setContent(initialData.mission);
      }
      if (visionEditor && initialData.vision) {
        visionEditor.commands.setContent(initialData.vision);
      }
      if (facilitiesIntroEditor && initialData.facilitiesIntro) {
        facilitiesIntroEditor.commands.setContent(initialData.facilitiesIntro);
      }
      if (profileIntroEditor && initialData.profileIntro) {
        profileIntroEditor.commands.setContent(initialData.profileIntro);
      }
    } else {
      reset({
        companyName: "",
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        googleMapUrl: "",
        foundingDate: "",
        companyType: "",
        aboutUs: "",
        yearsOfExperience: 0,
        projectsCompleted: 0,
        satisfiedClients: 0,
        satisfactionRate: 0,
        mission: "",
        vision: "",
        facilitiesIntro: "",
        profileIntro: "",
      });
      // Clear rich text editors
      if (aboutUsEditor) {
        aboutUsEditor.commands.setContent("");
      }
      if (missionEditor) {
        missionEditor.commands.setContent("");
      }
      if (visionEditor) {
        visionEditor.commands.setContent("");
      }
      if (facilitiesIntroEditor) {
        facilitiesIntroEditor.commands.setContent("");
      }
      if (profileIntroEditor) {
        profileIntroEditor.commands.setContent("");
      }
    }
  }, [
    initialData,
    reset,
    aboutUsEditor,
    missionEditor,
    visionEditor,
    facilitiesIntroEditor,
    profileIntroEditor,
  ]);

  if (isFetching) {
    return <ContactInfoSkeleton />;
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="max-w-4xl mx-auto"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold">
          {t("admin.contactUsManager.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("admin.contactUsManager.subtitle")}
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)} className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t("admin.contactUsManager.form.labels.companyName")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.companyName"
                )}
                withAsterisk
                error={errors.companyName?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t("admin.contactUsManager.form.labels.phone")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.phone"
                )}
                withAsterisk
                error={errors.phone?.message}
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t("admin.contactUsManager.form.labels.email")}
              placeholder={t("admin.contactUsManager.form.placeholders.email")}
              type="email"
              withAsterisk
              error={errors.email?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Textarea
              label={t("admin.contactUsManager.form.labels.address")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.address"
              )}
              withAsterisk
              error={errors.address?.message}
              autosize
              minRows={3}
              {...field}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="workingHours"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t("admin.contactUsManager.form.labels.workingHours")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.workingHours"
                )}
                withAsterisk
                error={errors.workingHours?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="googleMapUrl"
            control={control}
            render={({ field }) => (
              <Textarea
                label={t("admin.contactUsManager.form.labels.googleMapUrl")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.googleMapUrl"
                )}
                error={errors.googleMapUrl?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="foundingDate"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t("admin.contactUsManager.form.labels.foundingDate")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.foundingDate"
                )}
                type="date"
                error={errors.foundingDate?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="companyType"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t("admin.contactUsManager.form.labels.companyType")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.companyType"
                )}
                error={errors.companyType?.message}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("admin.contactUsManager.form.labels.aboutUs")}
          </label>
          <RichTextEditor editor={aboutUsEditor} className="rte-dark-theme">
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
          {errors.aboutUs && (
            <p className="text-red-500 text-sm mt-1">
              {errors.aboutUs.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="yearsOfExperience"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t(
                  "admin.contactUsManager.form.labels.yearsOfExperience"
                )}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.yearsOfExperience"
                )}
                min={0}
                error={errors.yearsOfExperience?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="projectsCompleted"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t(
                  "admin.contactUsManager.form.labels.projectsCompleted"
                )}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.projectsCompleted"
                )}
                min={0}
                error={errors.projectsCompleted?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="satisfiedClients"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t("admin.contactUsManager.form.labels.satisfiedClients")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.satisfiedClients"
                )}
                min={0}
                error={errors.satisfiedClients?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="satisfactionRate"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t("admin.contactUsManager.form.labels.satisfactionRate")}
                placeholder={t(
                  "admin.contactUsManager.form.placeholders.satisfactionRate"
                )}
                min={0}
                max={100}
                error={errors.satisfactionRate?.message}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("admin.contactUsManager.form.labels.mission")}
          </label>
          <RichTextEditor editor={missionEditor} className="rte-dark-theme">
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
          {errors.mission && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mission.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("admin.contactUsManager.form.labels.vision")}
          </label>
          <RichTextEditor editor={visionEditor} className="rte-dark-theme">
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
          {errors.vision && (
            <p className="text-red-500 text-sm mt-1">{errors.vision.message}</p>
          )}
        </div>

        <AppRichTextEditor
          label={t(
            "admin.contactUsManager.form.labels.facilitiesIntro",
            "Giới thiệu cơ sở vật chất"
          )}
          value={watch("facilitiesIntro") || ""}
          onChange={(value) =>
            setValue("facilitiesIntro", value, { shouldDirty: true })
          }
          error={errors.facilitiesIntro?.message}
          height="300px"
        />

        <AppRichTextEditor
          label={t(
            "admin.contactUsManager.form.labels.profileIntro",
            "Hồ sơ năng lực"
          )}
          value={watch("profileIntro") || ""}
          onChange={(value) =>
            setValue("profileIntro", value, { shouldDirty: true })
          }
          error={errors.profileIntro?.message}
          height="300px"
        />

        <Group justify="flex-end" mt="md">
          <AppButton
            label={t("admin.contactUsManager.form.save")}
            htmlType="submit"
            loading={isSaving}
            disabled={!isDirty}
            showArrow={false}
          />
        </Group>
      </form>
    </Card>
  );
}

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

const contactSchema = z.object({
  companyName: z.string().min(1, "Tên công ty không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa các chữ số"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email({ message: "Email không hợp lệ" }),
  workingHours: z.string().min(1, "Giờ làm việc không được để trống"),
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
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactInfoForm() {
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
    },
  });

  // Watch values for rich text editors
  const aboutUsValue = watch("aboutUs");
  const missionValue = watch("mission");
  const visionValue = watch("vision");

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

  useEffect(() => {
    if (initialData) {
      reset(initialData);
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
    }
  }, [initialData, reset, aboutUsEditor, missionEditor, visionEditor]);

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
        <h2 className="text-2xl font-bold">Thông Tin Liên Hệ</h2>
        <p className="text-sm text-gray-500 mt-1">
          Cập nhật thông tin liên hệ của công ty. Thông tin này sẽ được hiển thị
          công khai trên trang web.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)} className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Tên công ty"
                placeholder="Nhập tên công ty"
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
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
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
              label="Email"
              placeholder="example@email.com"
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
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
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
                label="Giờ làm việc"
                placeholder="Thứ 2 - Chủ nhật: 7:00 - 17:00"
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
                label="Link Google Map"
                placeholder="https://maps.google.com/..."
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
                label="Ngày thành lập"
                placeholder="YYYY-MM-DD"
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
                label="Loại hình công ty"
                placeholder="Nhập loại hình công ty"
                error={errors.companyType?.message}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Giới thiệu về chúng tôi
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
                label="Số năm kinh nghiệm"
                placeholder="Nhập số năm kinh nghiệm"
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
                label="Số dự án hoàn thành"
                placeholder="Nhập số dự án đã hoàn thành"
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
                label="Số khách hàng hài lòng"
                placeholder="Nhập số khách hàng hài lòng"
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
                label="Tỷ lệ hài lòng (%)"
                placeholder="Nhập tỷ lệ hài lòng"
                min={0}
                max={100}
                error={errors.satisfactionRate?.message}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sứ mệnh</label>
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
          <label className="block text-sm font-medium mb-2">Tầm nhìn</label>
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

        <Group justify="flex-end" mt="md">
          <AppButton
            label="Cập nhật"
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

function ContactInfoSkeleton() {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="max-w-4xl mx-auto"
    >
      <div className="p-4">
        <Skeleton height={30} width={200} mb="sm" />
        <Skeleton height={16} width="70%" />
      </div>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
        <Skeleton height={56} />
        <Skeleton height={80} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
        <Skeleton height={100} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Group justify="flex-end" mt="md">
          <Skeleton height={40} width={120} />
        </Group>
      </div>
    </Card>
  );
}

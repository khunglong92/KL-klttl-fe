import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactFormValues } from "../schema";
import { useEffect } from "react";

export const MissionVisionForm = () => {
  const { t } = useTranslation();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  const missionValue = watch("mission");
  const visionValue = watch("vision");

  // Rich Text Editor configuration
  const extensions = [
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
  ];

  const missionEditor = useEditor({
    extensions,
    content: missionValue || "",
    onUpdate: ({ editor }) => {
      setValue("mission", editor.getHTML(), { shouldDirty: true });
    },
  });

  const visionEditor = useEditor({
    extensions,
    content: visionValue || "",
    onUpdate: ({ editor }) => {
      setValue("vision", editor.getHTML(), { shouldDirty: true });
    },
  });

  // Sync editor content when external value changes (e.g. from reset)
  useEffect(() => {
    if (missionEditor && missionValue !== missionEditor.getHTML()) {
      // Only update if purely different to avoid cursor jumps, but strict check might fail on HTML formatting.
      // However, here we mostly care about initial load (reset).
      // If usage pattern is standard, RHF reset causes rerender.
      // Let's rely on standard useEffect pattern for resetting content.
      // Actually the hook 'useEditor' content prop is only for initial content.
      // We must manually setContent if value changes externally (like reset).

      // BUT, simple check:
      if (missionValue && missionValue !== missionEditor.getHTML()) {
        missionEditor.commands.setContent(missionValue);
      } else if (!missionValue) {
        missionEditor.commands.setContent("");
      }
    }
  }, [missionValue, missionEditor]);

  useEffect(() => {
    if (visionEditor && visionValue !== visionEditor.getHTML()) {
      if (visionValue) {
        visionEditor.commands.setContent(visionValue);
      } else {
        visionEditor.commands.setContent("");
      }
    }
  }, [visionValue, visionEditor]);

  return (
    <>
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
          <p className="text-red-500 text-sm mt-1">{errors.mission.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("admin.contactUsManager.form.labels.vision")}
        </label>
        <RichTextEditor editor={visionEditor} className="rte-dark-theme">
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            {/* Toolbar content is identical, can extraction be done? Yes but keeping it simple for now */}
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
    </>
  );
};

import { Stack, Text } from "@mantine/core";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageResize from "quill-image-resize-module-react";
import { useTheme } from "@/hooks/useTheme";

// Custom Image Blot to persist style, width, and height attributes
const BaseImage = Quill.import("formats/image") as any;

class CustomImage extends BaseImage {
  static formats(domNode: Element) {
    return {
      height: domNode.getAttribute("height"),
      width: domNode.getAttribute("width"),
      style: domNode.getAttribute("style"),
    };
  }

  format(name: string, value: any) {
    if (["height", "width", "style"].indexOf(name) > -1) {
      if (value) {
        this["domNode"].setAttribute(name, value);
      } else {
        this["domNode"].removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

// Register Quill modules
if (!Quill.imports["formats/image"]) {
  Quill.register("formats/image", CustomImage, true);
}
if (!Quill.imports["modules/imageResize"]) {
  Quill.register("modules/imageResize", ImageResize, true);
}

interface AppRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  label?: string;
  error?: string;
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "align",
  "color",
  "background",
  "width",
  "height",
  "style",
];

export function AppRichTextEditor({
  value,
  onChange,
  placeholder,
  height = "300px",
  label,
  error,
}: AppRichTextEditorProps) {
  const { theme } = useTheme();

  return (
    <Stack gap="xs">
      {label && <Text fw={500}>{label}</Text>}
      <div
        style={{
          overflow: "hidden",
          borderRadius: "8px",
          border: error ? "1px solid var(--mantine-color-red-5)" : undefined,
        }}
      >
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          style={{ height, marginBottom: "50px" }}
          placeholder={placeholder}
          className={theme === "dark" ? "quill-dark" : ""}
        />
      </div>
      {error && (
        <Text c="red" size="xs">
          {error}
        </Text>
      )}
    </Stack>
  );
}

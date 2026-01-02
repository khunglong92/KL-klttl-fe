import { Box, Stack, Text, Paper } from "@mantine/core";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageResize from "quill-image-resize-module-react";
import { Control, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { FormData } from "../../types";

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
Quill.register("formats/image", CustomImage, true);
Quill.register("modules/imageResize", ImageResize, true);

interface Props {
  control: Control<FormData>;
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

export function DetailedDescriptionSection({ control }: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  const {
    field: { value, onChange },
  } = useController({
    name: "detailedDescription",
    control,
  });

  return (
    <Stack gap="md">
      <Box>
        <Text size="md" fw={600} mb={4} c={textColor}>
          {t(
            "projectsAdmin.form.labels.detailedDescription",
            "Nội dung chi tiết dự án"
          )}
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          {t(
            "projectsAdmin.form.labels.detailedHint",
            "Sử dụng trình soạn thảo để viết mô tả chi tiết, thêm hình ảnh, định dạng văn bản..."
          )}
        </Text>
      </Box>

      <Paper withBorder p={0} radius="md" style={{ overflow: "hidden" }}>
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          style={{ height: "500px", marginBottom: "50px" }}
          placeholder={t(
            "projectsAdmin.form.placeholders.detailedContent",
            "Bắt đầu viết nội dung tại đây..."
          )}
        />
      </Paper>
    </Stack>
  );
}

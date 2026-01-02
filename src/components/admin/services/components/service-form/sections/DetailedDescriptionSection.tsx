import { Box, Stack, Text } from "@mantine/core";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageResize from "quill-image-resize-module-react";
import { Control, useController } from "react-hook-form";
import type { ServiceFormData } from "../hooks/use-service-form";
import { useTranslation } from "react-i18next";
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
Quill.register("formats/image", CustomImage, true);
Quill.register("modules/imageResize", ImageResize, true);

interface Props {
  control: Control<ServiceFormData>;
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

  const {
    field: { value, onChange },
  } = useController({
    name: "detailed_description",
    control,
  });

  return (
    <Stack gap="md">
      <Box>
        <Text size="sm" c="dimmed" mb="md">
          {t(
            "serviceForm.detailedHint",
            "Sử dụng trình soạn thảo để viết mô tả chi tiết, thêm hình ảnh, định dạng văn bản..."
          )}
        </Text>
      </Box>

      <div style={{ overflow: "hidden", borderRadius: "8px" }}>
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          style={{ height: "500px", marginBottom: "50px" }}
          placeholder={t(
            "serviceForm.detailedPlaceholder",
            "Bắt đầu viết nội dung tại đây..."
          )}
          className={theme === "dark" ? "quill-dark" : ""}
        />
      </div>
    </Stack>
  );
}

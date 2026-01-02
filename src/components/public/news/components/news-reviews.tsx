import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useNewsReviews, useCreateReview } from "@/services/hooks/useReviews";
import { Star, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import AppButton from "@/components/atoms/app-button";

interface NewsReviewsProps {
  newsId: string;
  newsTitle: string;
  targetType?: "NEWS" | "RECRUITMENT";
}

interface FormErrors {
  name?: string;
  email?: string;
  content?: string;
}

export function NewsReviews({
  newsId,
  newsTitle,
  targetType = "NEWS",
}: NewsReviewsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: reviewsData, isLoading } = useNewsReviews(newsId, targetType);
  const createReview = useCreateReview();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
    rating: 5,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const reviews = reviewsData?.data || [];

  // Calculate rating stats
  const ratingStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    reviews.forEach((r) => {
      stats[r.rating as keyof typeof stats]++;
      totalRating += r.rating;
    });
    return {
      breakdown: stats,
      average: reviews.length ? (totalRating / reviews.length).toFixed(1) : "0",
      total: reviews.length,
    };
  }, [reviews]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t(
        "reviews.form.errors.nameRequired",
        "Vui lòng nhập tên"
      );
    }

    if (!formData.email.trim()) {
      newErrors.email = t(
        "reviews.form.errors.emailRequired",
        "Vui lòng nhập email"
      );
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t(
        "reviews.form.errors.emailInvalid",
        "Email không hợp lệ"
      );
    }

    if (!formData.content.trim()) {
      newErrors.content = t(
        "reviews.form.errors.contentRequired",
        "Vui lòng nhập nội dung nhận xét"
      );
    } else if (formData.content.trim().length < 10) {
      newErrors.content = t(
        "reviews.form.errors.contentMin",
        "Nhận xét phải có ít nhất 10 ký tự"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error(t("reviews.form.required", "Vui lòng điền đầy đủ thông tin"));
      return;
    }

    try {
      await createReview.mutateAsync({
        ...formData,
        targetType: targetType,
        targetId: newsId,
      });
      toast.success(t("reviews.form.success", "Gửi đánh giá thành công!"));
      setFormData({ name: "", email: "", content: "", rating: 5 });
      setErrors({});
    } catch {
      toast.error(t("reviews.form.error", "Có lỗi xảy ra. Vui lòng thử lại."));
    }
  };

  const StarRating = ({
    rating,
    onSelect,
    size = "md",
  }: {
    rating: number;
    onSelect?: (r: number) => void;
    size?: "sm" | "md";
  }) => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onSelect?.(star)}
            disabled={!onSelect}
            className={cn(
              "transition-colors",
              onSelect && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                starSize,
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <h3
        className={cn(
          "text-xl font-bold",
          isDark ? "text-white" : "text-gray-900"
        )}
      >
        {t("reviews.title", "Đánh giá bài viết")}
      </h3>

      {/* Rating Summary */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          isDark
            ? "bg-[#1f2937] border-[#374151]"
            : "bg-gray-50 border-gray-200"
        )}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Average Rating */}
          <div
            className="text-center md:border-r md:pr-6 md:w-1/4"
            style={{
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <div
              className={cn(
                "text-sm mb-1",
                isDark ? "text-gray-400" : "text-gray-600"
              )}
            >
              {t("reviews.average", "Đánh Giá Trung Bình")}
            </div>
            <div className="text-4xl font-bold text-amber-500">
              {ratingStats.average} / 5
            </div>
            <div
              className={cn(
                "text-sm mt-1",
                isDark ? "text-gray-500" : "text-gray-500"
              )}
            >
              {ratingStats.total} {t("reviews.count", "người đánh giá")}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                ratingStats.breakdown[
                  star as keyof typeof ratingStats.breakdown
                ];
              const percentage = ratingStats.total
                ? (count / ratingStats.total) * 100
                : 0;
              return (
                <div key={star} className="flex items-center gap-2 mb-1.5">
                  <span
                    className={cn(
                      "text-sm w-6",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    {star} ★
                  </span>
                  <div
                    className={cn(
                      "flex-1 h-2 rounded-full overflow-hidden",
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    )}
                  >
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-amber-500 w-16">
                    {count} đánh giá
                  </span>
                </div>
              );
            })}
          </div>

          {/* Write Review Button */}
          <div className="md:w-1/4 flex items-center justify-center">
            <AppButton
              label={t("reviews.writeReview", "Viết bình luận")}
              onClick={() =>
                document
                  .getElementById("review-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h4
          className={cn(
            "text-lg font-semibold mb-4 border-b pb-2",
            isDark
              ? "text-white border-[#374151]"
              : "text-gray-900 border-gray-200"
          )}
        >
          {t("reviews.listTitle", "Đánh giá")}
        </h4>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          </div>
        ) : reviews.length === 0 ? (
          <p
            className={cn(
              "text-sm",
              isDark ? "text-gray-400" : "text-gray-600"
            )}
          >
            {t("reviews.noReviews", "Chưa có đánh giá nào.")}
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={cn(
                  "p-4 rounded-lg border",
                  isDark
                    ? "bg-[#1f2937] border-[#374151]"
                    : "bg-white border-gray-200"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "font-semibold",
                        isDark ? "text-white" : "text-gray-900"
                      )}
                    >
                      {review.name}
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <span
                    className={cn(
                      "ml-auto text-xs",
                      isDark ? "text-gray-500" : "text-gray-400"
                    )}
                  >
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form */}
      <div id="review-form">
        <h4
          className={cn(
            "text-lg font-semibold mb-4 border-b pb-2",
            isDark
              ? "text-white border-[#374151]"
              : "text-gray-900 border-gray-200"
          )}
        >
          {t(
            "reviews.formTitle",
            'Hãy là người đầu tiên nhận xét "{name}"'
          ).replace("{name}", newsTitle)}
        </h4>
        <p
          className={cn(
            "text-xs mb-4",
            isDark ? "text-gray-500" : "text-gray-500"
          )}
        >
          {t(
            "reviews.formNote",
            "Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu *"
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-1",
                isDark ? "text-gray-300" : "text-gray-700"
              )}
            >
              {t("reviews.form.rating", "Đánh giá của bạn")} *
            </label>
            <StarRating
              rating={formData.rating}
              onSelect={(r) => setFormData((f) => ({ ...f, rating: r }))}
            />
          </div>

          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-1",
                isDark ? "text-gray-300" : "text-gray-700"
              )}
            >
              {t("reviews.form.content", "Nhận xét của bạn")} *
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) =>
                setFormData((f) => ({ ...f, content: e.target.value }))
              }
              className={cn(
                "w-full px-3 py-2 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500",
                isDark
                  ? "bg-[#1f2937] border-[#374151] text-white"
                  : "bg-white border-gray-200 text-gray-900",
                errors.content && "border-red-500"
              )}
              placeholder={t(
                "reviews.form.contentPlaceholder",
                "Viết nhận xét của bạn..."
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-1",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}
              >
                {t("reviews.form.name", "Tên")} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                className={cn(
                  "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500",
                  isDark
                    ? "bg-[#1f2937] border-[#374151] text-white"
                    : "bg-white border-gray-200 text-gray-900",
                  errors.name && "border-red-500"
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-1",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}
              >
                {t("reviews.form.email", "Email")} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, email: e.target.value }))
                }
                className={cn(
                  "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500",
                  isDark
                    ? "bg-[#1f2937] border-[#374151] text-white"
                    : "bg-white border-gray-200 text-gray-900",
                  errors.email && "border-red-500"
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <AppButton
            label={t("reviews.form.submit", "Gửi đi")}
            leftSection={
              createReview.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )
            }
            onClick={() => handleSubmit()}
            showArrow={false}
            htmlType="submit"
          />
        </form>
      </div>
    </div>
  );
}

'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RichTextEditor from "@/components/ui/rich-text-editor/RichTextEditor";
import type { BlogArticle } from "@shared/blog/repository";




type BlogFormData =
  Pick<BlogArticle, "title" | "description" | "category" | "meta" | "image"> & {
  shortTitle: string;
  banner: string;
  keyTakeaways: string;
};


const emptyFormState: BlogFormData = {
  title: "",
  description: "",
  category: "",
  meta: "New · Dubai",
  image: "/images/Maskgroup.jpg",
  shortTitle: "",
  banner: "/images/Maskgroup.jpg",
  keyTakeaways: "",
};

const parseKeyTakeawaysText = (value: string): string[] => {
  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatKeyTakeawaysForInput = (items?: string[]): string => {
  return items && items.length ? items.join("\n") : "";
};

export default function BlogPage() {
  const [formState, setFormState] = useState<BlogFormData>(emptyFormState);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formBannerUploadData, setFormBannerUploadData] = useState<string | null>(null);
  const [formImageUploadData, setFormImageUploadData] = useState<string | null>(null);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [articleDialogForm, setArticleDialogForm] = useState({
    title: "",
    shortTitle: "",
    description: "",
    image: "",
    banner: "",
    keyTakeaways: "",
  });
  const [articleDialogImagePreview, setArticleDialogImagePreview] = useState<string | null>(null);
  const [articleDialogBannerUploadData, setArticleDialogBannerUploadData] = useState<string | null>(null);
  const [isDialogSubmitting, setIsDialogSubmitting] = useState(false);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    index: null as number | null,
    title: "",
  });
  const [deletingArticleIndex, setDeletingArticleIndex] = useState<number | null>(null);
  const currentSelectedArticle =
    selectedArticleIndex !== null && selectedArticleIndex >= 0 && selectedArticleIndex < articles.length
      ? articles[selectedArticleIndex]
      : undefined;
  const dialogMetaLabel = currentSelectedArticle?.meta ?? "New · Dubai";
  const dialogCategoryLabel = currentSelectedArticle?.category ?? "Blog";
  const dialogCardImage = articleDialogImagePreview || articleDialogForm.image || "/images/Maskgroup.jpg";
  const dialogBannerPreview = articleDialogBannerUploadData || articleDialogForm.banner || dialogCardImage;
  const dialogKeyTakeaways = parseKeyTakeawaysText(articleDialogForm.keyTakeaways);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/blog/articles");
        if (!response.ok) {
          throw new Error("Cannot load articles right now.");
        }
        const data = (await response.json()) as BlogArticle[];
        setArticles(data);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleChange = (field: keyof BlogFormData, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "banner") {
      setFormBannerUploadData(null);
    }
    if (field === "image") {
      setFormImageUploadData(null);
    }
  };

  const resetDialogForm = () => {
    setArticleDialogForm({ title: "", shortTitle: "", description: "", image: "", banner: "", keyTakeaways: "" });
    setArticleDialogImagePreview(null);
    setArticleDialogBannerUploadData(null);
    setSelectedArticleIndex(null);
  };

  const handleArticleDialogClose = () => {
    setArticleDialogOpen(false);
    resetDialogForm();
  };

  const openArticleDialog = (article: BlogArticle, index: number) => {
    setSelectedArticleIndex(index);
    setArticleDialogForm({
      title: article.title,
      shortTitle: article.shortTitle ?? "",
      description: article.description,
      image: article.image,
      banner: article.banner ?? "",
      keyTakeaways: formatKeyTakeawaysForInput(article.keyTakeaways),
    });
    setArticleDialogImagePreview(article.image);
    setArticleDialogOpen(true);
  };

  const handleArticleDialogFormChange = (
    field: "title" | "shortTitle" | "description" | "banner" | "keyTakeaways" | "image",
    value: string,
  ) => {
    setArticleDialogForm((prev) => ({ ...prev, [field]: value }));
    if (field === "banner") {
      setArticleDialogBannerUploadData(null);
    }
  };

  const handleArticleDialogFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setArticleDialogImagePreview(articleDialogForm.image || null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setArticleDialogImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormBannerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormBannerUploadData(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormBannerUploadData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormImageUploadData(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormImageUploadData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleArticleDialogBannerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setArticleDialogBannerUploadData(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setArticleDialogBannerUploadData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleArticleDialogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!articleDialogForm.title.trim() || !articleDialogForm.description.trim()) {
      return;
    }

    if (selectedArticleIndex === null || selectedArticleIndex < 0 || selectedArticleIndex >= articles.length) {
      setErrorMessage("Unable to find the selected article.");
      return;
    }

    const targetArticle = articles[selectedArticleIndex];
    const dialogKeyTakeaways = parseKeyTakeawaysText(articleDialogForm.keyTakeaways);
    const updatedArticle: BlogArticle = {
      title: articleDialogForm.title.trim(),
      shortTitle:
        articleDialogForm.shortTitle.trim() ||
        targetArticle.shortTitle ||
        targetArticle.title,
      description: articleDialogForm.description.trim(),
      category: targetArticle.category,
      meta: targetArticle.meta,
      image: articleDialogImagePreview || articleDialogForm.image || targetArticle.image || "/images/Maskgroup.jpg",
      banner:
        articleDialogBannerUploadData ||
        articleDialogForm.banner.trim() ||
        targetArticle.banner ||
        targetArticle.image ||
        "/images/Maskgroup.jpg",
      keyTakeaways: dialogKeyTakeaways,
    };

    setIsDialogSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/blog/articles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: selectedArticleIndex,
          article: updatedArticle,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to update the article.");
      }

      setArticles(payload as BlogArticle[]);
      setStatusMessage("Article updated successfully.");
      handleArticleDialogClose();
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsDialogSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/blog/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          banner: formBannerUploadData || formState.banner,
          image: formImageUploadData || formState.image,
          keyTakeaways: parseKeyTakeawaysText(formState.keyTakeaways),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to save this article.");
      }

      setArticles(payload as BlogArticle[]);
      setFormState({ ...emptyFormState });
      setFormImageUploadData(null);
      setFormBannerUploadData(null);
      setStatusMessage("Article saved successfully and is ready for public display.");
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resolveGlobalArticleIndex = (targetArticle: BlogArticle, fallbackIndex: number) => {
    const globalIndex = articles.findIndex(
      (item) =>
        item.title === targetArticle.title &&
        item.description === targetArticle.description &&
        item.category === targetArticle.category &&
        item.meta === targetArticle.meta,
    );
    return globalIndex !== -1 ? globalIndex : fallbackIndex;
  };

  const handleDeleteArticle = async (index: number) => {
    if (index < 0 || index >= articles.length) {
      return;
    }
    const backup = [...articles];
    setStatusMessage(null);
    setErrorMessage(null);
    setDeletingArticleIndex(index);
    setArticles((prev) => prev.filter((_, idx) => idx !== index));

    try {
      const response = await fetch("/api/blog/articles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to delete the article.");
      }

      setArticles(payload as BlogArticle[]);
      setStatusMessage("Article removed successfully.");
    } catch (error) {
      setErrorMessage((error as Error).message);
      setArticles(backup);
    } finally {
      setDeletingArticleIndex(null);
    }
  };

  const openDeleteConfirmDialog = (index: number, title: string) => {
    setConfirmDialog({ open: true, index, title });
  };

  const closeDeleteConfirmDialog = () => {
    setConfirmDialog({ open: false, index: null, title: "" });
  };

  const handleConfirmDelete = () => {
    const { index } = confirmDialog;
    closeDeleteConfirmDialog();
    if (typeof index === "number") {
      handleDeleteArticle(index);
    }
  };

  const recentArticles = useMemo(() => {
    return [...articles].slice(-6).reverse();
  }, [articles]);

  const isDialogFormValid = Boolean(
    articleDialogForm.title.trim() && articleDialogForm.description.trim(),
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Blog Management" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              New Article Form
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Articles added here are automatically displayed on the public blog page.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-slate-50/40 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Title
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  required
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Category
                <input
                  type="text"
                  value={formState.category}
                  onChange={(event) => handleChange("category", event.target.value)}
                  required
                  placeholder="e.g.: Resume"
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Short Title
              <input
                type="text"
                value={formState.shortTitle}
                onChange={(event) => handleChange("shortTitle", event.target.value)}
                placeholder="Compact overview for cards"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Description
              <RichTextEditor
                initialContent={formState.description}
                onChange={(value) => handleChange("description", value)}
                outputFormat="text"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Key Takeaways
              <RichTextEditor
                initialContent={formState.keyTakeaways}
                onChange={(value) => handleChange("keyTakeaways", value)}
                outputFormat="text"
              />
              <span className="text-xs text-gray-500">Present concise points to highlight the article.</span>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Banner URL (optional)
                <input
                  type="text"
                  value={formState.banner}
                  onChange={(event) => handleChange("banner", event.target.value)}
                  placeholder="/images/hero-banner.jpg"
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Upload banner image</p>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-indigo-500/60 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
                    Select file
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFormBannerFileChange}
                      className="hidden"
                    />
                  </label>
                  {(formBannerUploadData || formState.banner) && (
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={formBannerUploadData || formState.banner}
                          alt="Banner preview"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span>{formBannerUploadData ? "Uploaded banner preview" : "Banner URL preview"}</span>
                    </div>
                  )}
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                Image URL (optional)
                <input
                  type="text"
                  value={formState.image}
                  onChange={(event) => handleChange("image", event.target.value)}
                  placeholder="/images/people-collage.png"
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Upload image</p>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-indigo-500/60 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
                    Select file
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFormImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {(formImageUploadData || formState.image) && (
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={formImageUploadData || formState.image}
                        alt="Image preview"
                        className="h-full w-full object-cover"
                      />
                    </span>
                      <span>{formImageUploadData ? "Uploaded image preview" : "Image URL preview"}</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              Page Meta
              <input
                type="text"
                value={formState.meta}
                onChange={(event) => handleChange("meta", event.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
              />
            </label>

            {(statusMessage || errorMessage) && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  statusMessage ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                {statusMessage || errorMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Add Article to List"}
              </button>
            </div>
          </form>

          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">Recent Articles</h4>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {articles.length} entries recorded
              </span>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Loading articles...</p>
            ) : recentArticles.length ? (
              <div className="grid gap-3">
                {recentArticles.map((article, index) => {
                  const globalIndex = resolveGlobalArticleIndex(article, index);
                  return (
                    <div
                      key={`${article.title}-${index}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        openArticleDialog(article, globalIndex);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openArticleDialog(article, globalIndex);
                        }
                      }}
                      className="rounded-xl border border-gray-100 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 cursor-pointer"
                    >
                      {article.image && (
                        <div className="mb-3 h-36 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                          <img
                            src={article.image}
                            alt={`${article.title} thumbnail`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{article.title}</p>
                          <p className="text-xs uppercase text-indigo-600">{article.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDeleteConfirmDialog(globalIndex, article.title);
                          }}
                          className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600 transition hover:border-rose-400 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={deletingArticleIndex === globalIndex}
                        >
                          Delete
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{article.meta}</p>
                      <p className="mt-2 text-sm text-gray-600 max-h-12 overflow-hidden">
                        {article.shortTitle || article.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No articles have been added yet.</p>
            )}
          </div>
        </div>
      </div>
      {articleDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8 sm:py-10">
          <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white px-6 py-6 shadow-2xl shadow-slate-900/10 dark:bg-gray-900 sm:px-8 sm:py-8">
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-0 sm:pr-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Article Details</h3>
                  <p className="text-sm text-gray-500">
                    Update the title, short title, description, banner, or image for the selected article card.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleArticleDialogClose}
                  className="text-gray-400 transition hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <aside className="flex flex-col gap-5 rounded-3xl border border-indigo-100/80 bg-gradient-to-b from-indigo-50/70 to-white p-5 shadow-lg shadow-indigo-200/40 dark:border-indigo-700/60 dark:bg-gradient-to-b dark:from-indigo-900/40 dark:to-gray-900">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-indigo-600">
                    <span>Live preview</span>
                    <span className="text-gray-400">{dialogMetaLabel}</span>
                  </div>
                  <div className="h-44 w-full overflow-hidden rounded-2xl border border-white/30 bg-gray-100 dark:border-white/10">
                    <img src={dialogBannerPreview} alt="Banner preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {articleDialogForm.title || "Untitled article"}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{dialogCategoryLabel}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-200 max-h-20 overflow-hidden">
                      {articleDialogForm.description || "Share a short summary to preview it here."}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Key takeaways</p>
                    {dialogKeyTakeaways.length ? (
                      <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        {dialogKeyTakeaways.slice(0, 4).map((point, index) => (
                          <li key={`${point}-${index}`} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-gray-400">Add a key takeaway to see it previewed here.</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                    <span className="h-12 w-12 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                      <img src={dialogCardImage} alt="Card preview image" className="h-full w-full object-cover" />
                    </span>
                      <div>
                        <p className="text-xs uppercase text-gray-500">Card image</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Current frame</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">
                    {dialogKeyTakeaways.length ? "Content synced" : "Add key points"}
                  </span>
                  </div>
                </aside>

                <section className="rounded-3xl border border-gray-100 bg-white/80 p-5 shadow-lg shadow-slate-200/40 dark:border-gray-800 dark:bg-gray-900/80">
                  <form onSubmit={handleArticleDialogSubmit} className="space-y-4">
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Card Title
                      <input
                        type="text"
                        value={articleDialogForm.title}
                        onChange={(event) => handleArticleDialogFormChange("title", event.target.value)}
                        required
                        className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Short Title
                      <input
                        type="text"
                        value={articleDialogForm.shortTitle}
                        onChange={(event) => handleArticleDialogFormChange("shortTitle", event.target.value)}
                        className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Image URL (optional)
                      <input
                        type="text"
                        value={articleDialogForm.image}
                        onChange={(event) => handleArticleDialogFormChange("image", event.target.value)}
                        placeholder="/images/people-collage.png"
                        className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Brief Description
                      <RichTextEditor
                        initialContent={articleDialogForm.description}
                        onChange={(value) => handleArticleDialogFormChange("description", value)}
                        outputFormat="text"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Key Takeaways
                      <RichTextEditor
                        initialContent={articleDialogForm.keyTakeaways}
                        onChange={(value) => handleArticleDialogFormChange("keyTakeaways", value)}
                        outputFormat="text"
                      />
                      <span className="text-xs text-gray-500">
                      Use concise bullet-like sentences that match the card preview.
                    </span>
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Banner URL
                      <input
                        type="text"
                        value={articleDialogForm.banner}
                        onChange={(event) => handleArticleDialogFormChange("banner", event.target.value)}
                        className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </label>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Upload banner image</p>
                      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-indigo-500/60 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-200">
                        Select file
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleArticleDialogBannerFileChange}
                          className="hidden"
                        />
                      </label>
                      {(articleDialogBannerUploadData || articleDialogForm.banner) && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <img
                            src={articleDialogBannerUploadData || articleDialogForm.banner}
                            alt="Banner preview"
                            className="h-full w-full object-cover"
                          />
                        </span>
                          <span>{articleDialogBannerUploadData ? "Uploaded banner preview" : "Banner URL preview"}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">Upload a new image</p>
                      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-indigo-500/60 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-200">
                        Select file
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleArticleDialogFileChange}
                          className="hidden"
                        />
                      </label>
                      {(articleDialogImagePreview || articleDialogForm.image) && (
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                        <span className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={articleDialogImagePreview || articleDialogForm.image}
                            alt="Image preview"
                            className="h-full w-full object-cover"
                          />
                        </span>
                          <span>New or current image</span>
                        </div>
                      )}
                    </div>
                    {!isDialogFormValid && (
                      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        Title and description are required before saving.
                      </p>
                    )}
                    <div className="sticky bottom-0 -mx-5 mt-2 flex items-center justify-between gap-3 border-t border-gray-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
                      <button
                        type="button"
                        onClick={handleArticleDialogClose}
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isDialogSubmitting || !isDialogFormValid}
                        className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isDialogSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Delete Article?</p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to remove this article from the list?
              </p>
              {confirmDialog.title && (
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {confirmDialog.title}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 mt-5">
              <button
                type="button"
                onClick={closeDeleteConfirmDialog}
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingArticleIndex === confirmDialog.index}
                className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

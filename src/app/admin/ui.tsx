"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Eye, EyeOff, GripVertical, LogOut, Save, Star, Upload } from "lucide-react";
import {
  categories,
  type Category,
  type ImageAsset,
  type Photo,
  type SiteContent,
} from "@/lib/types";

type Props = {
  initialAuthed: boolean;
  initialContent: SiteContent | null;
};

export function AdminDashboard({ initialAuthed, initialContent }: Props) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(initialContent);
  const [activeId, setActiveId] = useState(initialContent?.photos[0]?.id || "");
  const [uploadCategory, setUploadCategory] = useState<Category>("Events");
  const [status, setStatus] = useState("");
  const activePhoto = useMemo(
    () => content?.photos.find((photo) => photo.id === activeId) || null,
    [content, activeId],
  );

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Signing in...");
    const body = new FormData();
    body.set("password", password);
    const response = await fetch("/api/admin/login", { method: "POST", body });
    if (!response.ok) {
      setStatus("Password did not match.");
      return;
    }
    const data = (await fetch("/api/admin/data").then((res) => res.json())) as SiteContent;
    setContent(data);
    setActiveId(data.photos[0]?.id || "");
    setAuthed(true);
    setStatus("");
  }

  async function save(nextContent = content) {
    if (!nextContent) return;
    setStatus("Saving...");
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextContent),
    });
    setStatus("Saved");
  }

  function updatePhoto(id: string, patch: Partial<Photo>) {
    if (!content) return;
    const next = {
      ...content,
      photos: content.photos.map((photo) =>
        photo.id === id ? { ...photo, ...patch } : photo,
      ),
    };
    setContent(next);
  }

  function updateAboutPortrait(patch: Partial<ImageAsset>) {
    if (!content) return;
    setContent({
      ...content,
      aboutPortrait: { ...content.aboutPortrait, ...patch },
    });
  }

  function updateCategory(photo: Photo, category: Category, checked: boolean) {
    const nextCategories = checked
      ? Array.from(new Set([...photo.categories, category]))
      : photo.categories.filter((item) => item !== category);
    updatePhoto(photo.id, { categories: nextCategories });
  }

  function reorder(fromId: string, toId: string) {
    if (!content || fromId === toId) return;
    const photos = [...content.photos];
    const fromIndex = photos.findIndex((photo) => photo.id === fromId);
    const toIndex = photos.findIndex((photo) => photo.id === toId);
    const [moved] = photos.splice(fromIndex, 1);
    photos.splice(toIndex, 0, moved);
    const next = {
      ...content,
      photos: photos.map((photo, index) => ({ ...photo, order: index + 1 })),
    };
    setContent(next);
    void save(next);
  }

  async function upload(files: FileList | null) {
    if (!files?.length || !content) return;
    setStatus("Uploading...");
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    body.set("category", uploadCategory);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { photos: Photo[] };
    const next = { ...content, photos: [...content.photos, ...data.photos] };
    setContent(next);
    setActiveId(data.photos[0]?.id || activeId);
    setStatus("Uploaded");
  }

  async function uploadAboutPortrait(file: File | undefined) {
    if (!file || !content) return;
    setStatus("Uploading about portrait...");
    const body = new FormData();
    body.set("file", file);
    body.set("alt", content.aboutPortrait.alt || "Portrait of Gibson Chu");
    const response = await fetch("/api/admin/about-portrait", {
      method: "POST",
      body,
    });

    if (!response.ok) {
      setStatus("About portrait upload failed.");
      return;
    }

    const data = (await response.json()) as { aboutPortrait: ImageAsset };
    setContent({ ...content, aboutPortrait: data.aboutPortrait });
    setStatus("About portrait updated");
  }

  if (!authed || !content) {
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <p>Admin</p>
          <h1>Gibson Chu Photography</h1>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit">Sign in</button>
          <small>{status || "Default local password: admin123"}</small>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-top">
          <div>
            <p>Admin</p>
            <h1>Photography Portfolio</h1>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Log out"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              setAuthed(false);
            }}
          >
            <LogOut size={18} aria-hidden />
          </button>
        </div>

        <label
          className="upload-zone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void upload(event.dataTransfer.files);
          }}
        >
          <Upload size={22} aria-hidden />
          <span>Drop photos or browse</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => void upload(event.target.files)}
          />
        </label>
        <select
          value={uploadCategory}
          onChange={(event) => setUploadCategory(event.target.value as Category)}
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <div className="photo-list">
          {content.photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              draggable
              onDragStart={(event) => event.dataTransfer.setData("photo", photo.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => reorder(event.dataTransfer.getData("photo"), photo.id)}
              className={photo.id === activeId ? "selected" : ""}
              onClick={() => setActiveId(photo.id)}
            >
              <GripVertical size={16} aria-hidden />
              <Image src={photo.src} alt="" width={64} height={48} />
              <span>{photo.title || "Untitled"}</span>
              {photo.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          ))}
        </div>
      </aside>

      <section className="admin-editor">
        <div className="editor-toolbar">
          <p>{status || "Ready"}</p>
          <button type="button" onClick={() => void save()}>
            <Save size={16} aria-hidden />
            Save changes
          </button>
        </div>

        <div className="content-editor">
          <label>
            Homepage intro text
            <textarea
              rows={3}
              value={content.homeIntro}
              onChange={(event) =>
                setContent({ ...content, homeIntro: event.target.value })
              }
            />
          </label>
          <label>
            About page text
            <textarea
              rows={5}
              value={content.aboutText}
              onChange={(event) =>
                setContent({ ...content, aboutText: event.target.value })
              }
            />
          </label>
          <div className="about-portrait-admin">
            <div className="about-portrait-preview">
              <Image
                src={content.aboutPortrait.src}
                alt={content.aboutPortrait.alt}
                width={content.aboutPortrait.width}
                height={content.aboutPortrait.height}
                sizes="220px"
              />
            </div>
            <div>
              <p>About portrait</p>
              <span>
                This is a separate image used only on the About page. It will
                not appear in portfolio grids or homepage tiles.
              </span>
              <label>
                Upload portrait of me
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    void uploadAboutPortrait(event.target.files?.[0])
                  }
                />
              </label>
              <label>
                About portrait alt text
                <input
                  value={content.aboutPortrait.alt}
                  onChange={(event) =>
                    updateAboutPortrait({ alt: event.target.value })
                  }
                />
              </label>
            </div>
          </div>
        </div>

        {activePhoto ? (
          <div className="photo-editor">
            <div className="admin-preview">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
            <div className="field-grid">
              {(["title", "caption", "location", "date", "camera", "filmStock", "alt"] as const).map(
                (field) => (
                  <label key={field}>
                    {field === "filmStock" ? "Film stock" : field}
                    <input
                      value={activePhoto[field] || ""}
                      onChange={(event) =>
                        updatePhoto(activePhoto.id, { [field]: event.target.value })
                      }
                    />
                  </label>
                ),
              )}

              <div className="photo-flags span-all">
                <div className="flag-control">
                  <button
                    type="button"
                    className={activePhoto.featured ? "active" : ""}
                    onClick={() =>
                      updatePhoto(activePhoto.id, { featured: !activePhoto.featured })
                    }
                  >
                    <Star size={16} aria-hidden />
                    {activePhoto.featured ? "Featured: On" : "Featured: Off"}
                  </button>
                  <p>
                    Marks this photo as a preferred image for homepage entry
                    tiles and future selected-work placements.
                  </p>
                </div>
                <div className="flag-control">
                  <button
                    type="button"
                    className={activePhoto.hero ? "active" : ""}
                    onClick={() => {
                      const next = {
                        ...content,
                        photos: content.photos.map((photo) => ({
                          ...photo,
                          hero: photo.id === activePhoto.id,
                        })),
                      };
                      setContent(next);
                    }}
                  >
                    Hero image: {activePhoto.hero ? "Selected" : "Use this"}
                  </button>
                  <p>
                    Chooses the single large image at the top of the homepage.
                    Selecting this photo replaces the previous hero.
                  </p>
                </div>
                <div className="flag-control">
                  <button
                    type="button"
                    className={activePhoto.visible ? "active" : ""}
                    onClick={() =>
                      updatePhoto(activePhoto.id, { visible: !activePhoto.visible })
                    }
                  >
                    {activePhoto.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    {activePhoto.visible ? "Public: Visible" : "Public: Hidden"}
                  </button>
                  <p>
                    Controls whether this photo appears on the public website.
                    Hidden photos stay saved in admin.
                  </p>
                </div>
              </div>

              <fieldset className="span-all">
                <legend>Categories</legend>
                {categories.map((category) => (
                  <label key={category}>
                    <input
                      type="checkbox"
                      checked={activePhoto.categories.includes(category)}
                      onChange={(event) =>
                        updateCategory(activePhoto, category, event.target.checked)
                      }
                    />
                    {category}
                  </label>
                ))}
              </fieldset>
            </div>
          </div>
        ) : null}

        <section className="submissions">
          <h2>Contact submissions</h2>
          {content.submissions.length ? (
            content.submissions.map((submission) => (
              <article key={submission.id}>
                <p>
                  {submission.name} / {submission.email}
                </p>
                <small>
                  {[submission.shootType, submission.shootDate, submission.location, submission.budget]
                    .filter(Boolean)
                    .join(" / ")}
                </small>
                <span>{submission.message}</span>
              </article>
            ))
          ) : (
            <p>No submissions yet.</p>
          )}
        </section>
      </section>
    </main>
  );
}

import React, { useState, useEffect } from "react";

const API_BASE = "https://your-worker-url.workers.dev"; // <-- Replace this!

function App() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ title: "", video_url: "", tags: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/videos`)
      .then((res) => res.json())
      .then((data) => setVideos(data.videos || []))
      .catch(() => setVideos([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const res = await fetch(`${API_BASE}/api/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        video_url: form.video_url,
        tags: tagsArray,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Video posted successfully!");
      setForm({ title: "", video_url: "", tags: "" });
      setVideos((v) => [{ title: form.title, video_url: form.video_url, tags: tagsArray }, ...v]);
    } else {
      setMessage("Failed to post video.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1 style={{ color: "#0077cc" }}>DashTube</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="url"
          name="video_url"
          placeholder="YouTube Video URL"
          value={form.video_url}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ padding: 10, backgroundColor: "#0077cc", color: "white", border: "none", cursor: "pointer" }}>
          Post Video
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Video Feed</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {videos.map((vid, i) => (
          <li key={i} style={{ marginBottom: 20 }}>
            <h3>{vid.title}</h3>
            <iframe
              width="100%"
              height="200"
              src={vid.video_url.replace("watch?v=", "embed/")}
              title={vid.title}
              frameBorder="0"
              allowFullScreen
            />
            <p>Tags: {vid.tags?.join(", ") || "None"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

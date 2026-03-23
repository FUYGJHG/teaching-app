import { useEffect, useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState({ notes: [], videos: [] });
  const [note, setNote] = useState("");
  const [video, setVideo] = useState("");

  const [paid, setPaid] = useState(false);

  const fetchData = async () => {
    const res = await fetch("https://YOUR_BACKEND_URL/content"); // <-- Change
    const d = await res.json();
    setData(d);
  };

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn]);

  // LOGIN
  const login = () => {
    if (username === "admin" && password === "1234") {
      setRole("admin");
    } else {
      setRole("student");
    }
    setLoggedIn(true);
  };

  // ADD
  const addNote = async () => {
    if (!note) return;
    await fetch("https://YOUR_BACKEND_URL/add-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: note }),
    });
    setNote("");
    fetchData();
  };

  const addVideo = async () => {
    if (!video) return;
    await fetch("https://YOUR_BACKEND_URL/add-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: video }),
    });
    setVideo("");
    fetchData();
  };

  // DELETE
  const deleteNote = async (index) => {
    await fetch("https://YOUR_BACKEND_URL/delete-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });
    fetchData();
  };

  const deleteVideo = async (index) => {
    await fetch("https://YOUR_BACKEND_URL/delete-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });
    fetchData();
  };

  const getId = (url) => {
    if (url.includes("youtu.be")) return url.split("/").pop();
    if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
    return "";
  };

  if (!loggedIn) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f1f5f9" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "10px" }}>
          <h2>Login</h2>
          <input placeholder="Enter Name" onChange={(e) => setUsername(e.target.value)} />
          <br /><br />
          <input type="password" placeholder="Password (admin only)" onChange={(e) => setPassword(e.target.value)} />
          <br /><br />
          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ background: "#1e293b", color: "white", padding: "15px", display: "flex", justifyContent: "space-between" }}>
        <h2>My Coaching App</h2>
        <h3>{username}</h3>
      </div>

      {/* HERO */}
      <div style={{ padding: "30px", textAlign: "center", background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "white" }}>
        <h1>Learn Smart 🚀</h1>
      </div>

      {/* ADMIN PANEL */}
      {role === "admin" && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>Add Content</h2>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="PDF link" />
          <button onClick={addNote}>Add Note</button>
          <br /><br />
          <input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="YouTube link" />
          <button onClick={addVideo}>Add Video</button>
        </div>
      )}

      {/* PAYMENT */}
      {role === "student" && !paid && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>💰 Pay to Unlock</h2>
          <button
            onClick={() => { alert("Payment Success (Demo)"); setPaid(true); }}
            style={{ padding: "12px 25px", background: "orange", color: "white", border: "none" }}
          >
            Pay ₹2000
          </button>
        </div>
      )}

      {/* NOTES */}
      <div style={{ padding: "20px" }}>
        <h2>📄 Notes</h2>
        {data.notes.map((n, i) => (
          <div key={i} style={{ background: "white", margin: "10px", padding: "10px" }}>
            {role === "admin" || paid ? (
              <a href={n.link} target="_blank" rel="noreferrer">Open PDF</a>
            ) : <p>🔒 Locked</p>}
            {role === "admin" && <button onClick={() => deleteNote(i)}>❌</button>}
          </div>
        ))}
      </div>

      {/* VIDEOS */}
      <div style={{ padding: "20px" }}>
        <h2>🎥 Videos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {data.videos.map((v, i) => {
            const id = getId(v.url);
            return (
              <div key={i} style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
                {role === "admin" || paid ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`video-${i}`}
                    style={{ position: "absolute", width: "100%", height: "100%" }}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
                    🔒 Locked
                  </div>
                )}
                {role === "admin" && <button onClick={() => deleteVideo(i)} style={{ position: "absolute", top: "5px", right: "5px", background: "red", color: "white", border: "none" }}>❌</button>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
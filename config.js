const DEFAULT_ADMIN = {
    channelName: "Islamic alo",
    email: "saharuk787@gmail.com",
    password: "1234"
};

function getAdminConfig() {
    const saved = JSON.parse(localStorage.getItem("ia_admin_config") || "null");
    return saved || DEFAULT_ADMIN;
}

function saveAdminConfig(newEmail, newPassword) {
    const current = getAdminConfig();
    const updated = {
        channelName: current.channelName,
        email: newEmail.trim().toLowerCase(),
        password: newPassword
    };
    localStorage.setItem("ia_admin_config", JSON.stringify(updated));
}

function getVideos() {
    return JSON.parse(localStorage.getItem("ia_videos") || "[]");
}

function saveVideos(videos) {
    localStorage.setItem("ia_videos", JSON.stringify(videos));
}

function openVideoDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("IslamicAloVideoDB", 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains("videos")) {
                db.createObjectStore("videos", { keyPath: "id" });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function saveVideoBlobToDB(id, file) {
    try {
        const db = await openVideoDB();
        return new Promise((resolve) => {
            const tx = db.transaction("videos", "readwrite");
            tx.objectStore("videos").put({ id: id, blob: file });
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        });
    } catch (e) {
        return false;
    }
}

async function getVideoUrlFromDB(id, fallbackUrl) {
    try {
        const db = await openVideoDB();
        return new Promise((resolve) => {
            const tx = db.transaction("videos", "readonly");
            const req = tx.objectStore("videos").get(id);
            req.onsuccess = () => {
                if (req.result && req.result.blob) {
                    resolve(URL.createObjectURL(req.result.blob));
                } else {
                    resolve(fallbackUrl);
                }
            };
            req.onerror = () => resolve(fallbackUrl);
        });
    } catch (e) {
        return fallbackUrl;
    }
}

function getFollowers() {
    return JSON.parse(localStorage.getItem("ia_followers") || "[]");
}

function saveFollowers(followers) {
    localStorage.setItem("ia_followers", JSON.stringify(followers));
}

function isVideoExpired(createdAt) {
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    return (Date.now() - createdAt) > THIRTY_DAYS_MS;
}

function checkAdminAuth() {
    if (sessionStorage.getItem("ia_is_admin") !== "true") {
        window.location.href = "admin.html";
    }
}

async function deleteVideoBlobFromDB(id) {
    try {
        const db = await openVideoDB();
        return new Promise((resolve) => {
            const tx = db.transaction("videos", "readwrite");
            tx.objectStore("videos").delete(id);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        });
    } catch (e) {
        return false;
    }
}
